// Shared petition signatures store - in production, replace with database

import { PetitionSignature } from '@/types';

// In-memory store for demo - replace with Prisma database in production
export const petitionSignatures: PetitionSignature[] = [];

// Helper functions for petition operations
export function getAllSignatures(): PetitionSignature[] {
  return [...petitionSignatures];
}

export function getSignatureCount(): number {
  return petitionSignatures.length;
}

export function getSignatureById(id: string): PetitionSignature | undefined {
  return petitionSignatures.find((s) => s.id === id);
}

export function hasAlreadySigned(email: string): boolean {
  return petitionSignatures.some((s) => s.email.toLowerCase() === email.toLowerCase());
}

export function createSignature(data: Omit<PetitionSignature, 'id' | 'created_at'>): PetitionSignature {
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

  petitionSignatures.push(newSignature);
  return newSignature;
}

export function getSubscribedEmails(): PetitionSignature[] {
  return petitionSignatures.filter((s) => s.subscribed === true);
}

export function deleteSignature(id: string): boolean {
  const index = petitionSignatures.findIndex((s) => s.id === id);
  if (index === -1) return false;

  petitionSignatures.splice(index, 1);
  return true;
}
