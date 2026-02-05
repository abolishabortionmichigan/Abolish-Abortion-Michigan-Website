// Petition signatures store - in-memory for now
// TODO: Connect to database for persistence

import { PetitionSignature } from '@/types';

// In-memory store
const memoryStore: PetitionSignature[] = [];

export async function getAllSignatures(): Promise<PetitionSignature[]> {
  return [...memoryStore].sort((a, b) =>
    new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );
}

export async function getSignatureCount(): Promise<number> {
  return memoryStore.length;
}

export async function getSignatureById(id: string): Promise<PetitionSignature | undefined> {
  return memoryStore.find((s) => s.id === id);
}

export async function hasAlreadySigned(email: string): Promise<boolean> {
  return memoryStore.some((s) => s.email.toLowerCase() === email.toLowerCase());
}

export async function createSignature(data: Omit<PetitionSignature, 'id' | 'created_at'>): Promise<PetitionSignature> {
  const newSignature: PetitionSignature = {
    id: Date.now().toString(),
    name: data.name,
    email: data.email,
    city: data.city || '',
    state: data.state || 'MI',
    zipcode: data.zipcode || '',
    subscribed: data.subscribed || false,
    created_at: new Date().toISOString(),
  };
  memoryStore.push(newSignature);
  return newSignature;
}

export async function getSubscribedEmails(): Promise<PetitionSignature[]> {
  return memoryStore.filter((s) => s.subscribed === true);
}

export async function deleteSignature(id: string): Promise<boolean> {
  const index = memoryStore.findIndex((s) => s.id === id);
  if (index === -1) return false;
  memoryStore.splice(index, 1);
  return true;
}
