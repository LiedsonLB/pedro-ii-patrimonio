import { NextResponse } from 'next/server';
import { getAll, add } from '../_data/store';
import { categorias } from '../_data/patrimonios';

export const dynamic = 'force-dynamic';

// GET /api/patrimonios?q=igreja&category=Espaços culturais
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').toLowerCase();
  const category = searchParams.get('category');

  const data = getAll().filter((p) => {
    const okCat = !category || category === 'Todos' || p.category === category;
    const okQ =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.shortDesc.toLowerCase().includes(q) ||
      p.keywords.some((k) => k.toLowerCase().includes(q));
    return okCat && okQ;
  });

  return NextResponse.json({ total: data.length, categorias, data });
}

// POST /api/patrimonios  (cadastro de novo patrimônio)
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }
  if (!body?.name || !body?.shortDesc) {
    return NextResponse.json(
      { error: 'Campos obrigatórios: name e shortDesc' },
      { status: 400 }
    );
  }
  return NextResponse.json(add(body), { status: 201 });
}
