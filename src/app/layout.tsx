
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Import Inter
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProviderWrapper } from '@/components/theme-provider-wrapper'; // Import theme wrapper
import { ViewportHeightWrapper } from '@/components/viewport-height-wrapper';

// Configure Inter font
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'KGPT Chat',
  description: 'A chat application using KGPT AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Meta viewport ensures proper scaling on mobile devices */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {/* Removed direct Google Fonts links, relying on next/font */}
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ViewportHeightWrapper>
          <ThemeProviderWrapper>
            {children}
            <Toaster />
          </ThemeProviderWrapper>
        </ViewportHeightWrapper>
      </body>
    </html>
  );
}
