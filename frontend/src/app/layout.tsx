import './globals.css';
import ToastProvider from '@/components/layout/ToastProvider';
export const metadata = {
  title: 'LEARN GO!',
  description: 'Practice, flashcards, games, and summaries with on-device AI — LEARN GO!.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ToastProvider />
        {children}
      </body>
    </html>
  )
}
