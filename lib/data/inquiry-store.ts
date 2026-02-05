// Inquiries store - in-memory for now
// TODO: Connect to database for persistence

import { Inquiry } from '@/types';

// In-memory store
const memoryStore: Inquiry[] = [];

export async function getAllInquiries(): Promise<Inquiry[]> {
  return [...memoryStore].sort((a, b) =>
    new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );
}

export async function getInquiryById(id: string): Promise<Inquiry | undefined> {
  return memoryStore.find((i) => i.id === id);
}

export async function createInquiry(data: Omit<Inquiry, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<Inquiry> {
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
  memoryStore.push(newInquiry);
  return newInquiry;
}

export async function updateInquiry(id: string, data: Partial<Inquiry>): Promise<Inquiry | null> {
  const index = memoryStore.findIndex((i) => i.id === id);
  if (index === -1) return null;

  memoryStore[index] = {
    ...memoryStore[index],
    ...data,
    updated_at: new Date().toISOString(),
  };
  return memoryStore[index];
}

export async function deleteInquiry(id: string): Promise<boolean> {
  const index = memoryStore.findIndex((i) => i.id === id);
  if (index === -1) return false;
  memoryStore.splice(index, 1);
  return true;
}

export async function getPendingCount(): Promise<number> {
  return memoryStore.filter((i) => i.status === 'pending').length;
}
