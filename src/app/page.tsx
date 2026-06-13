import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Activity, PieChart, Sparkles, Wallet, Brain, LineChart, Target, Zap } from "lucide-react";

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

      {/* ── Horizontal glow line ── */}
      <div className="absolute top-1/2 left-0 w-full h-px opacity-10 -translate-y-16" style={{ background: "linear-gradient(90deg, transparent, #f97316, transparent)", zIndex: -4 }} />

      {/* ── Background: Floating UI Cards (Glassmorphism Mockups) ── */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none hidden sm:block">
        
        {/* Card 1: Left */}
        <div className="absolute top-[20%] left-[5%] lg:left-[10%] w-64 h-40 bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-3xl p-5 shadow-2xl transform -rotate-12 hover:rotate-0 transition-all duration-700 opacity-60">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 flex items-center justify-center">
              <Activity className="h-5 w-5 text-orange-500" />
            </div>
            <div className="space-y-1.5">
              <div className="h-2 w-20 bg-white/20 rounded-full" />
              <div className="h-2 w-12 bg-white/10 rounded-full" />
            </div>
          </div>
          <div className="space-y-2.5">
            <div className="h-2 w-full bg-white/10 rounded-full" />
            <div className="h-2 w-4/5 bg-white/10 rounded-full" />
            <div className="h-2 w-2/3 bg-white/10 rounded-full" />
          </div>
        </div>

        {/* Card 2: Right */}
        <div className="absolute top-[30%] right-[5%] lg:right-[15%] w-56 h-48 bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-3xl p-5 shadow-2xl transform rotate-12 hover:rotate-0 transition-all duration-700 opacity-60 flex flex-col items-center justify-center gap-3">
          <div className="relative">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="36" fill="none" stroke="rgba(249, 115, 22, 0.2)" strokeWidth="8" />
              <circle cx="48" cy="48" r="36" fill="none" stroke="#f97316" strokeWidth="8" strokeDasharray="226" strokeDashoffset="56" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="h-6 w-6 text-orange-500" />
            </div>
          </div>
          <div className="h-2 w-24 bg-white/20 rounded-full" />
          <div className="h-2 w-16 bg-white/10 rounded-full" />
        </div>

        {/* Card 3: Bottom Left */}
        <div className="absolute bottom-[10%] left-[15%] w-48 h-20 bg-gradient-to-r from-orange-500/10 to-transparent backdrop-blur-xl border border-orange-500/20 rounded-2xl p-4 shadow-2xl transform -rotate-6 opacity-40 flex items-center gap-4">
          <Wallet className="h-8 w-8 text-orange-400" />
          <div className="space-y-2">
            <div className="h-2 w-20 bg-orange-400/50 rounded-full" />
            <div className="h-2 w-12 bg-orange-400/30 rounded-full" />
          </div>
        </div>

      </div>

      {/* ── HEADER ── */}
      <header className="relative z-20 px-6 h-16 flex items-center border-b border-white/5 bg-background/40 backdrop-blur-md shrink-0">
        <Link className="flex items-center gap-2.5 group" href="/">
          <div className="h-8 w-8 relative rounded-xl overflow-hidden shadow-[0_0_15px_rgba(249,115,22,0.2)] border border-primary/20">
            <img src="/logo.png" alt="AuditLife Logo" className="object-cover w-full h-full" />
          </div>
          <span className="font-extrabold text-[15px] tracking-tight">AuditLife</span>
        </Link>
        <nav className="ml-auto flex gap-3 items-center">
          <Button variant="ghost" asChild size="sm" className="h-9 hover:bg-white/5 text-[11px] px-4 rounded-xl text-muted-foreground hover:text-foreground">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="sm" className="h-9 glow-primary-hover text-[11px] px-5 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/register">Mulai Sekarang</Link>
          </Button>
        </nav>
      </header>

      {/* ── MAIN CONTENT (centered, no scroll) ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 gap-8">
        
        {/* Glowing Badge */}
        <div className="fade-up inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs text-primary font-bold shadow-[0_0_20px_rgba(249,115,22,0.15)] backdrop-blur-md cursor-default hover:bg-primary/20 transition-colors">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          AI-Powered Self Audit
        </div>

        {/* Headline */}
        <div className="fade-up fade-up-delay-1 text-center space-y-3 max-w-2xl relative px-4">
          {/* Subtle glow behind text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] bg-primary/10 blur-[80px] -z-10 rounded-full pointer-events-none" />
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-[1.2]">
            Kendalikan Waktumu.
          </h1>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-[1.2] shimmer-text pb-1">
            Desain Masa Depanmu.
          </h1>
          <p className="mt-4 mx-auto max-w-[360px] text-xs sm:text-sm text-muted-foreground/90 leading-relaxed font-medium">
            Tinggalkan pencatatan manual. AuditLife menganalisis rutinitas mingguan dan keuanganmu dengan kecerdasan buatan.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="fade-up fade-up-delay-2 flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto mt-4">
          <Button asChild size="lg" className="h-12 glow-primary-hover text-sm px-8 rounded-xl font-bold shadow-[0_0_30px_rgba(249,115,22,0.25)]">
            <Link href="/register">
              Mulai Audit Gratis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="h-12 border-white/10 bg-white/[0.02] hover:bg-white/[0.08] backdrop-blur-sm text-sm px-8 rounded-xl font-medium">
            <Link href="/login">
              Masuk
            </Link>
          </Button>
        </div>

        {/* Feature Highlights (Bottom) */}
        <div className="fade-up fade-up-delay-3 flex items-center justify-center gap-6 sm:gap-10 mt-6 border-t border-white/5 pt-8 w-full max-w-3xl">
          {[
            { icon: Activity, label: "Weekly Audit", desc: "Track Habits" },
            { icon: Brain, label: "AI Insights", desc: "Smart Tips" },
            { icon: Wallet, label: "Finances", desc: "Budgeting" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex flex-col items-center gap-2 group cursor-default">
              <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-300 group-hover:-translate-y-1">
                <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-[11px] font-bold text-foreground">{label}</p>
                <p className="text-[9px] font-medium text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

    </div>
  );
}
