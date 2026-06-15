import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import Link from "next/link";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "PQCT | Post-Quantum Cryptography Training",
  description: "Advanced experiential learning platform for the quantum-safe era.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="bg-background text-foreground min-h-screen flex flex-col font-sans selection:bg-primary/30">
        <header className="glass sticky top-0 z-50 border-b border-border/50">
          <div className="container mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-1.5 md:gap-2 group">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg md:rounded-xl flex items-center justify-center font-black text-primary-foreground text-sm md:text-base transform group-hover:rotate-12 transition-transform">
                P
              </div>
              <span className="text-lg md:text-2xl font-black tracking-tighter font-outfit bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                PQCT <span className="text-primary text-[10px] md:text-sm tracking-normal font-medium ml-0.5 md:ml-1">LAB</span>
              </span>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
              <Link href="/subject-overview" className="hover:text-primary transition-colors">Curriculum</Link>
              <Link href="/modules" className="hover:text-primary transition-colors">Modules</Link>
              <Link href="/virtual-lab" className="hover:text-primary transition-colors">Virtual Lab</Link>
              <Link href="/analytics" className="hover:text-primary transition-colors">Analytics</Link>
              <Link href="/question-bank" className="hover:text-primary transition-colors">Assessment</Link>
            </nav>

            <div className="flex items-center gap-2 md:gap-4">
              <Link 
                href="/modules/1-need-pqc" 
                className="bg-primary text-primary-foreground px-4 md:px-6 py-1.5 md:py-2.5 rounded-full font-bold text-[10px] md:text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
              >
                Start Learning
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t border-border/50 bg-slate-950 py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
            <div className="col-span-1 sm:col-span-2 md:col-span-2">
              <div className="flex items-center gap-2 mb-3 md:mb-6">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-primary rounded-lg flex items-center justify-center font-black text-primary-foreground text-[10px] md:text-xs">
                  P
                </div>
                <span className="text-base md:text-xl font-bold font-outfit">PQCT Platform</span>
              </div>
              <p className="text-muted-foreground max-w-sm leading-relaxed text-xs md:text-sm">
                Empowering the next generation of cryptographers through activity-based, 
                concept-driven, and project-oriented learning. Aligned with NEP 2020 standards.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2 md:mb-4 text-sm md:text-base">Content</h4>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-muted-foreground">
                <li><Link href="/modules" className="hover:text-primary">All Modules</Link></li>
                <li><Link href="/subject-overview" className="hover:text-primary">Curriculum</Link></li>
                <li><Link href="/virtual-lab" className="hover:text-primary">Virtual Labs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2 md:mb-4 text-sm md:text-base">Assessments</h4>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-muted-foreground">
                <li><Link href="/question-bank" className="hover:text-primary">Question Bank</Link></li>
                <li><Link href="/analytics" className="hover:text-primary">Analytics</Link></li>
                <li><Link href="/feedback" className="hover:text-primary">Submit Feedback</Link></li>
              </ul>
            </div>
          </div>
          <div className="container mx-auto px-4 md:px-6 mt-8 md:mt-12 pt-6 md:pt-8 border-t border-border/20 text-center text-[10px] md:text-xs text-muted-foreground">
            <p>© 2026 PQCT Learning Systems. Delivering complete syllabus coverage with deep conceptual mastery.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
