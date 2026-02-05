import { PetitionSignature } from '@/types';
import { prisma, isDatabaseConnected } from '@/lib/prisma';

// In-memory fallback for when no database is configured
const memoryStore: PetitionSignature[] = [];

export async function getAllSignatures(): Promise<PetitionSignature[]> {
  if (isDatabaseConnected) {
    const sigs = await prisma.petitionSignature.findMany({ orderBy: { created_at: 'desc' } });
    return sigs.map(mapDbSignature);
  }
  return [...memoryStore];
}

export async function getSignatureCount(): Promise<number> {
  if (isDatabaseConnected) {
    return prisma.petitionSignature.count();
  }
  return memoryStore.length;
}

export async function getSignatureById(id: string): Promise<PetitionSignature | undefined> {
  if (isDatabaseConnected) {
    const sig = await prisma.petitionSignature.findUnique({ where: { id } });
    return sig ? mapDbSignature(sig) : undefined;
  }
  return memoryStore.find((s) => s.id === id);
}

export async function hasAlreadySigned(email: string): Promise<boolean> {
  if (isDatabaseConnected) {
    const sig = await prisma.petitionSignature.findUnique({ where: { email: email.toLowerCase() } });
    return !!sig;
  }
  return memoryStore.some((s) => s.email.toLowerCase() === email.toLowerCase());
}

export async function createSignature(data: Omit<PetitionSignature, 'id' | 'created_at'>): Promise<PetitionSignature> {
  if (isDatabaseConnected) {
    const sig = await prisma.petitionSignature.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        city: data.city || null,
        state: data.state || 'MI',
        zipcode: data.zipcode || null,
        subscribed: data.subscribed || false,
      },
    });
    return mapDbSignature(sig);
  }

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
  if (isDatabaseConnected) {
    const sigs = await prisma.petitionSignature.findMany({ where: { subscribed: true } });
    return sigs.map(mapDbSignature);
  }
  return memoryStore.filter((s) => s.subscribed === true);
}

export async function deleteSignature(id: string): Promise<boolean> {
  if (isDatabaseConnected) {
    try {
      await prisma.petitionSignature.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  const index = memoryStore.findIndex((s) => s.id === id);
  if (index === -1) return false;
  memoryStore.splice(index, 1);
  return true;
}

function mapDbSignature(sig: { id: string; name: string; email: string; city: string | null; state: string | null; zipcode: string | null; subscribed: boolean; created_at: Date }): PetitionSignature {
  return {
    id: sig.id,
    name: sig.name,
    email: sig.email,
    city: sig.city || '',
    state: sig.state || 'MI',
    zipcode: sig.zipcode || '',
    subscribed: sig.subscribed,
    created_at: sig.created_at.toISOString(),
  };
}
