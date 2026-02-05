'use server';

import { getAuthToken, verifyToken } from './auth-actions';
import { Inquiry } from '@/types';
import {
  getAllInquiries,
  getInquiryById,
  createInquiry as createInquiryData,
  updateInquiry as updateInquiryData,
  deleteInquiry as deleteInquiryData,
} from '@/lib/data/inquiry-store';
import { sendInquiryConfirmationEmail, sendInquiryNotificationEmail } from '@/lib/email';

async function isAdmin(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;

  const result = await verifyToken(token);
  return result.authorized && result.user?.role === 'admin';
}

export async function fetchInquiries() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    return await getAllInquiries();
  } catch (error) {
    return { error: 'Failed to fetch inquiries' };
  }
}

export async function updateInquiry(id: string, data: Partial<Inquiry>) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    const updated = await updateInquiryData(id, data);

    if (!updated) {
      return { error: 'Inquiry not found' };
    }

    return updated;
  } catch (error) {
    return { error: 'Failed to update inquiry' };
  }
}

export async function deleteInquiry(id: string) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    const deleted = await deleteInquiryData(id);

    if (!deleted) {
      return { error: 'Inquiry not found' };
    }

    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete inquiry' };
  }
}

export async function createInquiry(data: Omit<Inquiry, 'id' | 'status' | 'created_at' | 'updated_at'> & { website?: string }) {
  try {
    // Check honeypot field
    if (data.website) {
      return { id: 'ok', name: data.name, email: data.email, message: data.message, subject: data.subject || '', status: 'new', created_at: new Date().toISOString() };
    }

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return { error: 'Name, email, and message are required' };
    }

    // Validate input lengths
    if (data.name.length > 100) {
      return { error: 'Name must be 100 characters or less' };
    }
    if (data.email.length > 254) {
      return { error: 'Email must be 254 characters or less' };
    }
    if (data.subject && data.subject.length > 200) {
      return { error: 'Subject must be 200 characters or less' };
    }
    if (data.message.length > 5000) {
      return { error: 'Message must be 5000 characters or less' };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { error: 'Invalid email format' };
    }

    const newInquiry = await createInquiryData(data);

    // Send emails (non-blocking)
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

    return newInquiry;
  } catch (error) {
    return { error: 'Failed to submit inquiry' };
  }
}
