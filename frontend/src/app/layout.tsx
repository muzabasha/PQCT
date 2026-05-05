import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quantum Crypto Lab - Learn by Doing",
  description: "Interactive learning platform for Post-Quantum Cryptography",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen flex flex-col`}>
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Quantum Crypto Lab
            </Link>
            <nav className="flex gap-6 overflow-x-auto text-sm">
              <Link href="/modules/1-need-pqc" className="hover:text-blue-400 transition-colors">1. Need PQC</Link>
              <Link href="/modules/2-rsa-ecc" className="hover:text-blue-400 transition-colors">2. RSA & ECC</Link>
              <Link href="/modules/3-shor-grover" className="hover:text-blue-400 transition-colors">3. Shor & Grover</Link>
              <Link href="/modules/4-shor-impact" className="hover:text-blue-400 transition-colors">4. Impact</Link>
              <Link href="/modules/5-pqc" className="hover:text-blue-400 transition-colors">5. PQC algos</Link>
              <Link href="/modules/6-dashboard" className="hover:text-blue-400 transition-colors">6. Dashboard</Link>
              <Link href="/sandbox" className="hover:text-purple-400 text-purple-300 transition-colors">Sandbox</Link>
              <Link href="/break-crypto" className="hover:text-red-400 text-red-300 transition-colors">Break Crypto</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-800 bg-slate-900 py-6 text-center text-slate-400 text-sm">
          <p>© 2026 Quantum Crypto Lab. Built for experiential learning.</p>
        </footer>
      </body>
    </html>
  );
}
