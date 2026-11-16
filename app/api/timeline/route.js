import { NextResponse } from 'next/server';
import { timelineEvents } from '../_data/timeline';

export async function GET() {
  return NextResponse.json(timelineEvents);
}
