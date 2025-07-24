import '@/styles/globals.css';

import type { Metadata } from 'next';
import { JetBrains_Mono, Poppins } from 'next/font/google';
import { AppSidebar } from '@/components/app-sidebar';
import { AppTopbar } from '@/components/app-topbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TRPCReactProvider } from '@/trpc/react';

export const metadata: Metadata = {
  title: 'Personal Finance',
  description: 'A personal finance application for your every day needs!',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-mono',
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={`${poppins.variable} ${jetBrainsMono.variable}`} lang="en">
      <body>
        <SidebarProvider>
          <TRPCReactProvider>
            <nav className="flex">
              <AppSidebar />
              <AppTopbar />
            </nav>
            <main className="mt-18 w-full p-4">{children}</main>
          </TRPCReactProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
