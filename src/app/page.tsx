import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Activity, PieChart, Sparkles, Wallet, Brain } from "lucide-react";

export default function Home() {
  return (
    <div className="relative w-full h-[100dvh] overflow-hidden flex flex-col bg-background">

      {/* ── Animated gradient background ── */}
      <div className="absolute inset-0 gradient-bg -z-10" />

      {/* ── Dot pattern overlay ── */}
      <div className="absolute inset-0 ornament-dots -z-10 opacity-60" />

      {/* ── Glowing orbs ── */}
      <div className="orb orb-1" style={{ zIndex: 0 }} />
      <div className="orb orb-2" style={{ zIndex: 0 }} />
      <div className="orb orb-3" style={{ zIndex: 0 }} />

      {/* ── Decorative concentric rings (top-right) ── */}
      <div className="ornament-ring absolute -top-32 -right-32 w-[420px] h-[420px]" style={{ zIndex: 1 }} />
      <div className="ornament-ring absolute -top-20 -right-20 w-[280px] h-[280px]" style={{ zIndex: 1 }} />
      <div className="ornament-ring absolute -top-6 -right-6 w-[160px] h-[160px]" style={{ zIndex: 1 }} />

      {/* ── Decorative rings (bottom-left) ── */}
      <div className="ornament-ring absolute -bottom-28 -left-28 w-[360px] h-[360px]" style={{ zIndex: 1 }} />
      <div className="ornament-ring absolute -bottom-14 -left-14 w-[220px] h-[220px]" style={{ zIndex: 1 }} />

      {/* ── Floating geometric SVG ornaments ── */}
      <svg className="absolute top-16 left-6 opacity-[0.07] animate-spin" style={{ animationDuration: "40s", zIndex: 1 }} width="80" height="80" viewBox="0 0 80 80">
        <polygon points="40,4 76,62 4,62" fill="none" stroke="#f97316" strokeWidth="1.5" />
        <polygon points="40,14 68,58 12,58" fill="none" stroke="#f97316" strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-24 right-8 opacity-[0.08]" style={{ animation: "orbFloat2 22s ease-in-out infinite", zIndex: 1 }} width="60" height="60" viewBox="0 0 60 60">
        <rect x="8" y="8" width="44" height="44" rx="6" fill="none" stroke="#fb923c" strokeWidth="1.5" transform="rotate(20 30 30)" />
        <rect x="16" y="16" width="28" height="28" rx="4" fill="none" stroke="#fb923c" strokeWidth="1" transform="rotate(20 30 30)" />
      </svg>
      <svg className="absolute top-1/2 right-4 -translate-y-1/2 opacity-[0.06]" style={{ animation: "orbFloat1 30s ease-in-out infinite", zIndex: 1 }} width="50" height="50" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="20" fill="none" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4 4" />
        <circle cx="25" cy="25" r="10" fill="none" stroke="#f97316" strokeWidth="1" strokeDasharray="3 3" />
      </svg>
      {/* Small plus marks */}
      {[[15, 55], [85, 25], [70, 70], [25, 35]].map(([x, y], i) => (
        <svg key={i} className="absolute opacity-[0.12]" style={{ left: `${x}%`, top: `${y}%`, zIndex: 1, animation: `orbFloat${(i % 3) + 1} ${18 + i * 4}s ease-in-out infinite` }} width="16" height="16" viewBox="0 0 16 16">
          <line x1="8" y1="0" x2="8" y2="16" stroke="#f97316" strokeWidth="1.5" />
          <line x1="0" y1="8" x2="16" y2="8" stroke="#f97316" strokeWidth="1.5" />
        </svg>
      ))}

      {/* ── Horizontal glow line ── */}
      <div className="absolute top-1/2 left-0 w-full h-px opacity-10 -translate-y-16" style={{ background: "linear-gradient(90deg, transparent, #f97316, transparent)", zIndex: 1 }} />

      {/* ── HEADER ── */}
      <header className="relative z-20 px-5 h-14 flex items-center border-b border-white/5 bg-background/60 backdrop-blur-md shrink-0">
        <Link className="flex items-center gap-2" href="/">
          <div className="h-7 w-7 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="font-black text-sm tracking-tight">AuditLife</span>
        </Link>
        <nav className="ml-auto flex gap-2 items-center">
          <Button variant="ghost" asChild size="sm" className="h-8 border border-white/10 hover:bg-white/5 text-[10px] px-3 rounded-xl">
            <Link href="/login">Masuk</Link>
          </Button>
          <Button asChild size="sm" className="h-8 glow-primary-hover text-[10px] px-3 rounded-xl font-bold">
            <Link href="/register">Daftar</Link>
          </Button>
        </nav>
      </header>

      {/* ── MAIN CONTENT (centered, no scroll) ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 gap-6">
        {/* Badge */}
        <div className="fade-up inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] text-primary font-semibold backdrop-blur-sm neon-badge">
          <Sparkles className="h-3 w-3" />
          Platform Self-Audit Berbasis AI
        </div>

        {/* Headline */}
        <div className="fade-up fade-up-delay-1 text-center space-y-1">
          <h1 className="text-3xl font-black tracking-tighter leading-tight">
            Evaluasi Hidupmu.
          </h1>
          <h1 className="text-3xl font-black tracking-tighter leading-tight shimmer-text">
            Tingkatkan Potensimu.
          </h1>
          <p className="mt-3 mx-auto max-w-[280px] text-[11px] text-muted-foreground leading-relaxed">
            Platform self-audit berbasis AI yang membantu kamu memahami, mengevaluasi, dan meningkatkan kualitas hidup.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="fade-up fade-up-delay-2 flex flex-col gap-2.5 w-full max-w-[240px]">
          <Button asChild size="default" className="h-11 glow-primary-hover text-xs w-full rounded-xl font-bold shadow-lg">
            <Link href="/register">
              Mulai Audit Pertamamu
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button variant="outline" size="default" asChild className="h-11 border-white/10 hover:bg-white/5 text-xs w-full rounded-xl">
            <Link href="/login">Masuk Akun</Link>
          </Button>
        </div>

        {/* Feature Pills */}
        <div className="fade-up fade-up-delay-3 flex flex-wrap justify-center gap-2 max-w-[320px]">
          {[
            { icon: Activity, label: "Weekly Audit", color: "text-orange-400" },
            { icon: Brain, label: "AI Insight", color: "text-amber-400" },
            { icon: Wallet, label: "Financial Audit", color: "text-yellow-400" },
            { icon: PieChart, label: "Laporan", color: "text-orange-300" },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 backdrop-blur-sm hover:bg-white/[0.06] transition-all duration-200">
              <Icon className={`h-3 w-3 ${color}`} />
              <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="relative z-20 shrink-0 flex items-center justify-center py-3 border-t border-white/5 bg-black/20">
        <p className="text-[9px] text-muted-foreground/60">
          © {new Date().getFullYear()} AuditLife — All rights reserved.
        </p>
      </footer>
    </div>
  );
}
