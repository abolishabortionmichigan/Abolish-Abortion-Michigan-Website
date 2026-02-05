import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import {
  getAllInquiries,
  createInquiry,
} from '@/lib/data/inquiry-store';
import { sendInquiryConfirmationEmail, sendInquiryNotificationEmail } from '@/lib/email';

const JWT_SECRET = process.env.JWT_SECRET || '***REDACTED***';

function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const user = verifyAuth(request);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(await getAllInquiries());
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const newInquiry = await createInquiry({
      name: data.name,
      email: data.email,
      subject: data.subject || 'General Inquiry',
      message: data.message,
    });

    // Send emails (non-blocking - don't wait for completion)
    Promise.all([
      sendInquiryConfirmationEmail({
        id: newInquiry.id,
        name: newInquiry.name,
        email: newInquiry.email,
        subject: newInquiry.subject,
        message: newInquiry.message,
        created_at: newInquiry.created_at as string,
      }),
      sendInquiryNotificationEmail({
        id: newInquiry.id,
        name: newInquiry.name,
        email: newInquiry.email,
        subject: newInquiry.subject,
        message: newInquiry.message,
        created_at: newInquiry.created_at as string,
      }),
    ]).catch((error) => {
      console.error('Error sending inquiry emails:', error);
    });

    return NextResponse.json(newInquiry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create inquiry' }, { status: 500 });
  }
}
