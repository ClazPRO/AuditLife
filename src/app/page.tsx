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

      {/* ── Background: Floating UI Cards (Glassmorphism Mockups) ── */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        
        {/* Card 1: Left */}
        <div className="absolute top-[20%] left-[-5%] md:left-[5%] lg:left-[10%] w-64 h-40 bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-3xl p-5 shadow-2xl transform -rotate-12 hover:rotate-0 transition-all duration-700 opacity-60">
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
        <div className="absolute top-[30%] right-[-10%] md:right-[5%] lg:right-[15%] w-56 h-48 bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-3xl p-5 shadow-2xl transform rotate-12 hover:rotate-0 transition-all duration-700 opacity-60 flex flex-col items-center justify-center gap-3">
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
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary/30 to-primary/5 flex items-center justify-center border border-primary/30 group-hover:border-primary/60 transition-colors shadow-[0_0_15px_rgba(249,115,22,0.15)]">
            <Sparkles className="h-4 w-4 text-primary" />
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
        <div className="fade-up fade-up-delay-1 text-center space-y-4 max-w-2xl relative">
          {/* Subtle glow behind text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] bg-primary/10 blur-[100px] -z-10 rounded-full" />
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-[1.1]">
            Kendalikan Waktumu.
          </h1>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-[1.1] shimmer-text pb-2">
            Desain Masa Depanmu.
          </h1>
          <p className="mt-6 mx-auto max-w-[400px] text-sm sm:text-base text-muted-foreground/90 leading-relaxed font-medium">
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
