import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Activity, Wallet, Brain } from "lucide-react";

export default function Home() {
  return (
    <div className="relative w-full h-[100dvh] overflow-hidden flex flex-col bg-background selection:bg-primary/30">

      {/* ── Background: Deep true black with radial glows ── */}
      <div className="absolute inset-0 gradient-bg -z-20" />
      
      {/* ── Background: Fading Dot Grid ── */}
      <div className="absolute inset-0 grid-pattern -z-10 opacity-70" />

      {/* ── Background: Glowing Ambient Orbs ── */}
      <div className="orb orb-1 opacity-20" style={{ zIndex: -5 }} />
      <div className="orb orb-2 opacity-20" style={{ zIndex: -5 }} />
      <div className="orb orb-3 opacity-20" style={{ zIndex: -5 }} />

      {/* ── Decorative concentric rings (top-right) ── */}
      <div className="ornament-ring absolute -top-32 -right-32 w-[420px] h-[420px]" style={{ zIndex: -4 }} />
      <div className="ornament-ring absolute -top-20 -right-20 w-[280px] h-[280px]" style={{ zIndex: -4 }} />
      <div className="ornament-ring absolute -top-6 -right-6 w-[160px] h-[160px]" style={{ zIndex: -4 }} />

      {/* ── Decorative rings (bottom-left) ── */}
      <div className="ornament-ring absolute -bottom-28 -left-28 w-[360px] h-[360px]" style={{ zIndex: -4 }} />
      <div className="ornament-ring absolute -bottom-14 -left-14 w-[220px] h-[220px]" style={{ zIndex: -4 }} />

      {/* ── Floating geometric SVG ornaments ── */}
      <svg className="absolute top-16 left-6 opacity-[0.07] animate-spin" style={{ animationDuration: "40s", zIndex: -4 }} width="80" height="80" viewBox="0 0 80 80">
        <polygon points="40,4 76,62 4,62" fill="none" stroke="#f97316" strokeWidth="1.5" />
        <polygon points="40,14 68,58 12,58" fill="none" stroke="#f97316" strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-24 right-8 opacity-[0.08]" style={{ animation: "orbFloat2 22s ease-in-out infinite", zIndex: -4 }} width="60" height="60" viewBox="0 0 60 60">
        <rect x="8" y="8" width="44" height="44" rx="6" fill="none" stroke="#fb923c" strokeWidth="1.5" transform="rotate(20 30 30)" />
        <rect x="16" y="16" width="28" height="28" rx="4" fill="none" stroke="#fb923c" strokeWidth="1" transform="rotate(20 30 30)" />
      </svg>
      <svg className="absolute top-1/2 right-4 -translate-y-1/2 opacity-[0.06]" style={{ animation: "orbFloat1 30s ease-in-out infinite", zIndex: -4 }} width="50" height="50" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="20" fill="none" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4 4" />
        <circle cx="25" cy="25" r="10" fill="none" stroke="#f97316" strokeWidth="1" strokeDasharray="3 3" />
      </svg>
      {/* Small plus marks */}
      {[[15, 55], [85, 25], [70, 70], [25, 35]].map(([x, y], i) => (
        <svg key={i} className="absolute opacity-[0.12]" style={{ left: `${x}%`, top: `${y}%`, zIndex: -4, animation: `orbFloat${(i % 3) + 1} ${18 + i * 4}s ease-in-out infinite` }} width="16" height="16" viewBox="0 0 16 16">
          <line x1="8" y1="0" x2="8" y2="16" stroke="#f97316" strokeWidth="1.5" />
          <line x1="0" y1="8" x2="16" y2="8" stroke="#f97316" strokeWidth="1.5" />
        </svg>
      ))}

      {/* ── MAIN CONTENT (Splash Screen Style) ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-5">
        
        {/* Massive Logo Center */}
        <div className="fade-up flex flex-col items-center justify-center transform -translate-y-12">
          {/* Glowing backdrop for logo */}
          <div className="absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.3)] border border-primary/20 mb-6">
            <img src="/logo.png" alt="AuditLife Logo" className="object-cover w-full h-full" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            AuditLife
          </h1>
          <p className="mt-2 text-sm text-primary font-medium tracking-wide">
            AI-POWERED SELF AUDIT
          </p>
        </div>

        {/* Bottom Section: Features & CTAs */}
        <div className="absolute bottom-0 left-0 w-full p-6 pb-10 flex flex-col items-center gap-8 bg-gradient-to-t from-background via-background/80 to-transparent">
          
          {/* Feature Icons */}
          <div className="fade-up fade-up-delay-1 flex items-center justify-center gap-8 sm:gap-12 w-full max-w-md">
            {[
              { icon: Activity, label: "Weekly Audit", color: "text-orange-400" },
              { icon: Brain, label: "AI Insights", color: "text-amber-400" },
              { icon: Wallet, label: "Finances", color: "text-yellow-400" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex flex-col items-center gap-2 group cursor-default">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-300 group-hover:-translate-y-1 shadow-lg">
                  <Icon className={`h-5 w-5 ${color} group-hover:scale-110 transition-transform`} />
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="fade-up fade-up-delay-2 flex flex-col sm:flex-row gap-3 w-full max-w-sm">
            <Button asChild size="lg" className="h-12 flex-1 glow-primary-hover text-sm rounded-xl font-bold shadow-[0_0_30px_rgba(249,115,22,0.25)]">
              <Link href="/register">
                Mulai Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="h-12 flex-1 border-white/10 bg-white/[0.02] hover:bg-white/[0.08] backdrop-blur-sm text-sm rounded-xl font-medium">
              <Link href="/login">
                Masuk
              </Link>
            </Button>
          </div>
          
          {/* Copyright */}
          <p className="text-[9px] text-muted-foreground/40 text-center mt-2">
            © {new Date().getFullYear()} AuditLife — All rights reserved.
          </p>

        </div>

      </main>

    </div>
  );
}
