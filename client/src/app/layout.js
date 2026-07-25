import { Source_Sans_3 } from 'next/font/google';
import './globals.css';

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
  weight: ['300', '400', '600', '700', '800', '900'],
});

export const metadata = {
  title: 'CardShield — Dark Web Credit Card Checker',
  description: 'Check if your credit card details have been exposed on the dark web. Detect compromised cards and request instant removal from dark web databases.',
  keywords: ['credit card', 'security', 'dark web', 'card checker', 'breach detection'],
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={sourceSans.variable}>
      <body>{children}</body>
    </html>
  );
}
