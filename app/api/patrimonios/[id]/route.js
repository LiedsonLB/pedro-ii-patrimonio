import { NextResponse } from 'next/server';
import { getById } from '../../_data/store';

export const dynamic = 'force-dynamic';

export async function GET(_request, { params }) {
  const item = getById(params.id);
  if (!item) {
    return NextResponse.json({ error: 'Patrimônio não encontrado' }, { status: 404 });
  }
  return NextResponse.json(item);
}
