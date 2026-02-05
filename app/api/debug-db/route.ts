import { NextResponse } from 'next/server';
import prisma, { isDatabaseConnected } from '@/lib/prisma';

export async function GET() {
  const info: Record<string, unknown> = {
    isDatabaseConnected,
    hasDbUrl: !!process.env.DATABASE_URL,
    dbUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) + '...',
    nodeEnv: process.env.NODE_ENV,
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
