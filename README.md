# Pedro II - Memória, História e Patrimônio (Next.js)

## Rodar

```bash
npm install
npm run dev      # http://localhost:3000
```

Build de produção: `npm run build && npm start`

## Estrutura

```
app/
  layout.jsx, page.jsx, globals.css
  api/
    _data/            dados (patrimonios.js, timeline.js) + store em memória
    patrimonios/      GET (lista, ?q= & ?category=) e POST (cadastro)
    patrimonios/[id]/ GET (ficha por id)
    timeline/         GET (linha do tempo)
components/App.jsx    interface (client component) que consome /api
```

## Observação

O POST grava em memória: some ao reiniciar/redeploy (Vercel). Para persistir, troque
`app/api/_data/store.js` por Supabase ou outro banco.
