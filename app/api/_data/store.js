import { patrimoniosSeed } from './patrimonios';

// Armazenamento em memória (reinicia a cada deploy/cold start).
// Para persistir de verdade, troque por Supabase/Postgres/etc.
const g = globalThis;
if (!g.__patrimonios) g.__patrimonios = [...patrimoniosSeed];

export const getAll = () => g.__patrimonios;
export const getById = (id) => g.__patrimonios.find((p) => p.id === Number(id));

export const add = (data) => {
  const id = g.__patrimonios.reduce((m, p) => Math.max(m, p.id), 0) + 1;
  const keywords = Array.isArray(data.keywords)
    ? data.keywords
    : String(data.keywords || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
  const entry = {
    ...data,
    id,
    keywords: keywords.length ? keywords : ['Novo'],
    coordinates: Array.isArray(data.coordinates) ? data.coordinates : [-4.425, -41.45],
    gallery: [data.image],
  };
  g.__patrimonios = [entry, ...g.__patrimonios];
  return entry;
};
