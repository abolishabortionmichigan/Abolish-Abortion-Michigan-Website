import { NextResponse } from 'next/server';

export async function GET() {
  // List ALL env var names (no values for security)
  const allVarNames = Object.keys(process.env).sort();

  return NextResponse.json({
    hasDbUrl: !!process.env.DATABASE_URL,
    totalEnvVars: allVarNames.length,
    allVarNames,
  });
}
