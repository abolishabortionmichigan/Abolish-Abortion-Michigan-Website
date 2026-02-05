import { NextResponse } from 'next/server';
import prisma, { isDatabaseConnected } from '@/lib/prisma';

export async function GET() {
  // Find any env vars that contain "DATABASE" or "DB" in the name
  const dbRelatedVars = Object.keys(process.env)
    .filter((key) => key.toUpperCase().includes('DATABASE') || key.toUpperCase().includes('POSTGRES'))
    .map((key) => ({ key, valuePrefix: process.env[key]?.substring(0, 20) + '...' }));

  const info: Record<string, unknown> = {
    isDatabaseConnected,
    hasDbUrl: !!process.env.DATABASE_URL,
    dbUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) + '...',
    nodeEnv: process.env.NODE_ENV,
    dbRelatedVars,
    totalEnvVars: Object.keys(process.env).length,
  };

  if (isDatabaseConnected) {
    try {
      const petitionCount = await prisma.petitionSignature.count();
      const inquiryCount = await prisma.inquiry.count();
      const newsCount = await prisma.newsArticle.count();
      info.dbConnected = true;
      info.petitionCount = petitionCount;
      info.inquiryCount = inquiryCount;
      info.newsCount = newsCount;
    } catch (error: unknown) {
      info.dbConnected = false;
      info.dbError = error instanceof Error ? error.message : String(error);
    }
  }

  return NextResponse.json(info);
}
