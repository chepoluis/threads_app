import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import Topbar from '@/components/share/Topbar';
import LeftSidebar from '@/components/share/LeftSidebar';
import RightSidebar from '@/components/share/RightSidebar';
import Bottombar from '@/components/share/Bottombar';

const inter = Inter({ subsets: ['latin'] });

// https://favicon.io/favicon-converter/ -> convert images and get different sizes
export const metadata: Metadata = {
  title: 'Threads',
  description: 'A next 14 Meta threads app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={inter.className}>
          <Topbar />
          
          {/* Alinea los 3 componentes en una fila */}
          <main className='flex flex-row'>
            <LeftSidebar />

            <section className='main-container'>
              <div className='w-full max-w-4xl'>
                {children}
              </div>
            </section>

            <RightSidebar />
          </main>

          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
}
