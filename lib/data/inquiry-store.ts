// Shared inquiries store - in production, replace with database
// This file is shared between API routes and server actions

import { Inquiry } from '@/types';

// In-memory store for demo - replace with Prisma database in production
export const inquiries: Inquiry[] = [];

// Helper functions for inquiry operations
export function getAllInquiries(): Inquiry[] {
  return [...inquiries];
}

export function getInquiryById(id: string): Inquiry | undefined {
  return inquiries.find((i) => i.id === id);
}

export function createInquiry(data: Omit<Inquiry, 'id' | 'status' | 'created_at' | 'updated_at'>): Inquiry {
  const newInquiry: Inquiry = {
    id: Date.now().toString(),
    name: data.name,
    email: data.email,
    subject: data.subject || 'General Inquiry',
    message: data.message,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  inquiries.push(newInquiry);
  return newInquiry;
}

export function updateInquiry(id: string, data: Partial<Inquiry>): Inquiry | null {
  const index = inquiries.findIndex((i) => i.id === id);
  if (index === -1) return null;

  inquiries[index] = {
    ...inquiries[index],
    ...data,
    updated_at: new Date().toISOString(),
  };

  return inquiries[index];
}

export function deleteInquiry(id: string): boolean {
  const index = inquiries.findIndex((i) => i.id === id);
  if (index === -1) return false;

  inquiries.splice(index, 1);
  return true;
}
