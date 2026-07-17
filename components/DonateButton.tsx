'use client';

import { capture } from '@/lib/analytics';

interface DonateButtonProps {
  href: string;
  variant: 'primary' | 'secondary';
  label: string;
  source: 'main_button' | 'monthly_partner';
  children?: React.ReactNode;
  className?: string;
}

/**
 * Thin client wrapper around the Zeffy donate link so we can fire a PostHog
 * event before the user navigates to the external donation platform. Everything
 * else on /donate stays server-rendered.
 */
export default function DonateButton({ href, label, source, className }: DonateButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => capture('donate_clicked', { source })}
      className={className}
    >
      {label}
    </a>
  );
}
