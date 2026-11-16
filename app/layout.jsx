import './globals.css';

export const metadata = {
  title: 'Pedro II - PI | Memória, História e Patrimônio',
  description:
    'Acervo digital oficial para salvaguarda, pesquisa e divulgação dos patrimônios históricos, culturais e naturais de Pedro II - Piauí.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
