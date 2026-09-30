'use server';

import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import { getStripe, shippingFor, AUTOMATIC_TAX } from '@/lib/stripe';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIpFromHeaders } from '@/lib/client-ip';
import { newOrderNumber } from '@/lib/store';
import { SITE_URL, ORG_NAME } from '@/lib/site';

type Result = { ok: true; url: string } | { ok: false; error: string };

const MAX_LINES = 30;
const MAX_QTY = 25;

/**
 * Prices the cart from the database and opens a Stripe Checkout Session.
 *
 * The browser sends only ids and quantities. Every price, name and image
 * below comes from our own tables -- a tampered cart cannot change what is
 * charged. Stripe then collects the shipping address, and the amount it
 * reports back is re-verified against this pricing in settleOrder() before
 * the order is ever marked paid.
 *
 * Checkout is guest-only: this repo's User table is the admin bootstrap and
 * has no member sign-up flow, so the buyer's email comes from Stripe.
 */
export async function startCheckout(input: {
  lines: { productId: string; variantId: string | null; quantity: number }[];
}): Promise<Result> {
  const stripe = getStripe();
  if (!stripe) return { ok: false, error: 'The store is not open yet. Please check back soon.' };

  const ip = getClientIpFromHeaders(await headers());
  const limit = await checkRateLimit(`checkout:${ip}`, 15);
  if (!limit.allowed) return { ok: false, error: 'Too many checkout attempts. Please wait a few minutes.' };

  const lines = (input.lines ?? [])
    .slice(0, MAX_LINES)
    .filter((l) => Number.isInteger(l.quantity) && l.quantity > 0);
  if (lines.length === 0) return { ok: false, error: 'Your cart is empty.' };

  const products = await prisma.product.findMany({
    where: { id: { in: [...new Set(lines.map((l) => l.productId))] }, active: true },
    include: { variants: true },
  });

  const priced: {
    product_id: string;
    variant_id: string | null;
    name: string;
    variant_label: string | null;
    unit_price_cents: number;
    quantity: number;
    image: string | null;
  }[] = [];

  for (const line of lines) {
    const p = products.find((x) => x.id === line.productId);
    if (!p) {
      return { ok: false, error: 'An item in your cart is no longer available. Please remove it and try again.' };
    }
    let variant = null;
    if (p.variants.some((v) => v.active)) {
      variant = p.variants.find((v) => v.id === line.variantId && v.active) ?? null;
      if (!variant) {
        return { ok: false, error: `Please choose ${p.options_label?.toLowerCase() || 'an option'} for ${p.name}.` };
      }
    }
    const quantity = Math.min(MAX_QTY, line.quantity);
    if (variant?.stock != null && variant.stock < quantity) {
      return {
        ok: false,
        error:
          variant.stock <= 0
            ? `${p.name} (${variant.label}) is sold out.`
            : `Only ${variant.stock} of ${p.name} (${variant.label}) left. Please lower the quantity.`,
      };
    }
    priced.push({
      product_id: p.id,
      variant_id: variant?.id ?? null,
      name: p.name,
      variant_label: variant?.label ?? null,
      unit_price_cents: variant?.price_cents ?? p.price_cents,
      quantity,
      image: p.images[0] ?? null,
    });
  }

  const subtotal = priced.reduce((n, l) => n + l.unit_price_cents * l.quantity, 0);
  const shipping = shippingFor(subtotal);

  // Order number is unique; retry on the (very unlikely) collision.
  let order = null;
  for (let attempt = 0; attempt < 4 && !order; attempt++) {
    try {
      order = await prisma.order.create({
        data: {
          order_number: newOrderNumber(),
          email: '',
          subtotal_cents: subtotal,
          shipping_cents: shipping,
          total_cents: subtotal + shipping,
          items: { create: priced },
        },
      });
    } catch (e) {
      if (attempt === 3) throw e;
    }
  }
  if (!order) return { ok: false, error: 'Could not start checkout.' };

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      client_reference_id: order.id,
      line_items: priced.map((l) => ({
        quantity: l.quantity,
        price_data: {
          currency: 'usd',
          unit_amount: l.unit_price_cents,
          product_data: {
            name: l.variant_label ? `${l.name} - ${l.variant_label}` : l.name,
            // Stripe rejects non-https image URLs, and local dev serves
            // relative paths, so only pass absolute https ones.
            ...(l.image && l.image.startsWith('https://') ? { images: [l.image] } : {}),
          },
          ...(AUTOMATIC_TAX ? { tax_behavior: 'exclusive' as const } : {}),
        },
      })),
      shipping_address_collection: { allowed_countries: ['US'] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            display_name: shipping === 0 ? 'Free shipping' : 'Standard shipping',
            fixed_amount: { amount: shipping, currency: 'usd' },
            ...(AUTOMATIC_TAX ? { tax_behavior: 'exclusive' as const } : {}),
          },
        },
      ],
      ...(AUTOMATIC_TAX ? { automatic_tax: { enabled: true } } : {}),
      metadata: { kind: 'order', order_id: order.id, order_number: order.order_number },
      payment_intent_data: {
        description: `${ORG_NAME} store order ${order.order_number}`,
        metadata: { kind: 'order', order_id: order.id, order_number: order.order_number },
      },
      // Shown above the Pay button. Stripe renders Markdown links here.
      custom_text: {
        submit: {
          message: `Most items are printed to order just for you. See our [shipping and returns policy](${SITE_URL}/shipping-returns).`,
        },
      },
      success_url: `${SITE_URL}/store/order/${order.order_number}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/store/cart?cancelled=1`,
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
    });

    await prisma.order.update({ where: { id: order.id }, data: { stripe_session_id: session.id } });
    if (!session.url) return { ok: false, error: 'Could not open checkout.' };
    return { ok: true, url: session.url };
  } catch (e) {
    console.error('Stripe checkout create failed:', e instanceof Error ? e.message : e);
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'cancelled', admin_note: 'Checkout session could not be created' },
    });
    return { ok: false, error: 'We could not open checkout just now. Please try again in a moment.' };
  }
}
