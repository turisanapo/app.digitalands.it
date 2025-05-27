import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Poppins } from 'next/font/google'
import { Toaster } from "sonner";
import { GoogleAnalytics } from '@/src/components/analytics/google-analytics';
import { RouteAnalytics } from '@/src/components/analytics/route-analytics';
import { AuthProvider } from '@/src/components/providers/auth-provider'
import { TimedModal } from '@/src/components/ui/timed-modal'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Digital Lands',
  description: 'Ragusa - La prima città italiana completamente dedicata ai nomadi digitali!',
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png' },
    ],
  },
  manifest: '/favicon/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} font-sans`}>
      <head>
        <GoogleAnalytics />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <RouteAnalytics />
        <AuthProvider>
          {children}
          <TimedModal />
        </AuthProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}