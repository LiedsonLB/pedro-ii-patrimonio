import './globals.css';

export const metadata = {
  title: 'Pedro II - PI | Memória, História e Patrimônio',
  description:
    'Acervo digital oficial para salvaguarda, pesquisa e divulgação dos patrimônios históricos, culturais e naturais de Pedro II - Piauí.',
  icons: {
    icon: 'pedroII_logo.png',
    shortcut: 'pedroII_logo.png',
    apple: 'pedroII_logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
