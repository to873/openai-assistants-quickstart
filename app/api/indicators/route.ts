import { NextResponse } from 'next/server'

interface Indicator {
  type: string; // 'leading' | 'lagging'
  name: string;
  value: number;
  unit?: string;
  timestamp?: string;
  source?: string; // 'manual' | 'iot'
}

// In-memory storage for indicators. In production, replace with database or persistent store.
const indicators: Indicator[] = [];

export async function GET() {
  return NextResponse.json({ indicators });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const entry: Indicator = {
      ...data,
      timestamp: new Date().toISOString(),
    };
    indicators.push(entry);
    return NextResponse.json({ status: 'success', indicator: entry });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Invalid JSON' }, { status: 400 });
  }
}
