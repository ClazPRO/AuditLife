import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Activity, Wallet, Brain } from "lucide-react";

export default function Home() {
  return (
    <div className="relative w-full h-[100dvh] overflow-hidden flex flex-col selection:bg-primary/30 bg-black">

      {/* ── Background: Deep true black with radial glows ── */}
      <div className="absolute inset-0 gradient-bg" style={{ zIndex: 0 }} />
      
      {/* ── Background: Fading Dot Grid ── */}
      <div className="absolute inset-0 grid-pattern opacity-70" style={{ zIndex: 1 }} />

      {/* ── Background: Glowing Ambient Orbs ── */}
      <div className="orb orb-1 opacity-50" style={{ zIndex: 2 }} />
      <div className="orb orb-2 opacity-50" style={{ zIndex: 2 }} />
      <div className="orb orb-3 opacity-40" style={{ zIndex: 2 }} />

      {/* ── Dynamic Floating Particles ── */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div 
          key={`particle-${i}`} 
          className="absolute rounded-full bg-primary/70 blur-[1px]"
          style={{
            width: `${((i * 7) % 8) + 4}px`,
            height: `${((i * 7) % 8) + 4}px`,
            left: `${(i * 13) % 100}%`,
            top: `${(i * 17) % 100}%`,
            zIndex: 3,
            animation: `orbFloat${(i % 3) + 1} ${((i * 5) % 8) + 10}s ease-in-out infinite alternate`,
            animationDelay: `${(i * 3) % 3}s`
          }}
        />
      ))}

      {/* ── Pulsing Neon Dots ── */}
      {[
        { top: '15%', left: '80%' },
        { top: '65%', left: '15%' },
        { top: '35%', left: '90%' },
        { top: '80%', left: '60%' },
        { top: '50%', left: '10%' }
      ].map((pos, i) => (
        <div key={`pulse-${i}`} className="absolute w-2 h-2 rounded-full bg-primary animate-pulse" style={{ ...pos, zIndex: 3 }}>
          <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-100" />
        </div>
      ))}

      {/* ── Decorative concentric rings (Animated) ── */}
      <div className="ornament-ring absolute -top-32 -right-32 w-[420px] h-[420px]" style={{ zIndex: 2, animation: 'spin 40s linear infinite' }} />
      <div className="ornament-ring absolute -top-20 -right-20 w-[280px] h-[280px]" style={{ zIndex: 2, animation: 'spin 30s linear infinite reverse' }} />
      <div className="ornament-ring absolute -top-6 -right-6 w-[160px] h-[160px]" style={{ zIndex: 2, animation: 'spin 20s linear infinite' }} />

      <div className="ornament-ring absolute -bottom-28 -left-28 w-[360px] h-[360px]" style={{ zIndex: 2, animation: 'spin 50s linear infinite reverse' }} />
      <div className="ornament-ring absolute -bottom-14 -left-14 w-[220px] h-[220px]" style={{ zIndex: 2, animation: 'spin 25s linear infinite' }} />

      {/* ── Floating geometric SVG ornaments ── */}
      <svg className="absolute top-16 left-6 opacity-30" style={{ zIndex: 2, animation: 'spin 20s linear infinite' }} width="80" height="80" viewBox="0 0 80 80">
        <polygon points="40,4 76,62 4,62" fill="none" stroke="#f97316" strokeWidth="2" />
        <polygon points="40,14 68,58 12,58" fill="none" stroke="#f97316" strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-24 right-8 opacity-30" style={{ animation: "orbFloat2 12s ease-in-out infinite", zIndex: 2 }} width="60" height="60" viewBox="0 0 60 60">
        <rect x="8" y="8" width="44" height="44" rx="6" fill="none" stroke="#fb923c" strokeWidth="2" transform="rotate(20 30 30)" />
        <rect x="16" y="16" width="28" height="28" rx="4" fill="none" stroke="#fb923c" strokeWidth="1" transform="rotate(20 30 30)" />
      </svg>
      <svg className="absolute top-1/2 right-4 -translate-y-1/2 opacity-25" style={{ animation: "orbFloat1 15s ease-in-out infinite", zIndex: 2 }} width="50" height="50" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="20" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="4 4" style={{ animation: 'spin 8s linear infinite', transformOrigin: 'center' }} />
        <circle cx="25" cy="25" r="10" fill="none" stroke="#f97316" strokeWidth="1" strokeDasharray="3 3" style={{ animation: 'spin 12s linear infinite reverse', transformOrigin: 'center' }} />
      </svg>
      
      {/* Small plus marks */}
      {[[15, 55], [85, 25], [70, 70], [25, 35], [50, 85]].map(([x, y], i) => (
        <svg key={`plus-${i}`} className="absolute opacity-40" style={{ left: `${x}%`, top: `${y}%`, zIndex: 2, animation: `orbFloat${(i % 3) + 1} ${8 + i * 2}s ease-in-out infinite` }} width="20" height="20" viewBox="0 0 16 16">
          <line x1="8" y1="0" x2="8" y2="16" stroke="#f97316" strokeWidth="2" />
          <line x1="0" y1="8" x2="16" y2="8" stroke="#f97316" strokeWidth="2" />
        </svg>
      ))}

      {/* ── MAIN CONTENT (Splash Screen Style) ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-between px-5 pt-8 pb-6 md:py-10">
        
        {/* Massive Logo Center */}
        <div className="fade-up flex-1 flex flex-col items-center justify-center w-full min-h-[300px]">
          {/* Glowing backdrop for logo */}
          <div className="absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-primary/20 blur-[80px] rounded-full pointer-events-none" style={{ zIndex: -1 }} />
          
          <div className="relative w-48 h-48 md:w-64 md:h-64 mb-2 flex items-center justify-center">
            {/* AI Generated Logo with perfect edge blending */}
            <img 
              src="/logo.png" 
              alt="AuditLife Logo" 
              className="object-contain w-full h-full mix-blend-screen"
              style={{
                filter: "contrast(1.2) drop-shadow(0 0 20px rgba(249,115,22,0.4))",
                WebkitMaskImage: "radial-gradient(circle, black 55%, transparent 72%)",
                maskImage: "radial-gradient(circle, black 55%, transparent 72%)"
              }}
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent text-center">
            AuditLife
          </h1>
          <p className="mt-2 text-xs md:text-sm text-primary font-medium tracking-wide text-center uppercase">
            AI-Powered Self Audit
          </p>
        </div>

        {/* Bottom Section: Features & CTAs (naturally sits below without overlapping) */}
        <div className="w-full flex flex-col items-center gap-6 mt-4">
          
          {/* Feature Icons */}
          <div className="fade-up fade-up-delay-1 flex items-center justify-center gap-6 sm:gap-12 w-full max-w-md">
            {[
              { icon: Activity, label: "Weekly Audit", color: "text-orange-400" },
              { icon: Brain, label: "AI Insights", color: "text-amber-400" },
              { icon: Wallet, label: "Finances", color: "text-yellow-400" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex flex-col items-center gap-2 group cursor-default">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-300 group-hover:-translate-y-1 shadow-lg">
                  <Icon className={`h-4 w-4 md:h-5 md:w-5 ${color} group-hover:scale-110 transition-transform`} />
                </div>
                <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">{label}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="fade-up fade-up-delay-2 flex flex-col gap-3 w-full max-w-sm">
            <div className="flex flex-row gap-3 w-full">
              <Button asChild size="lg" className="h-11 md:h-12 flex-1 glow-primary-hover text-sm rounded-xl font-bold shadow-[0_0_30px_rgba(249,115,22,0.25)] whitespace-nowrap">
                <Link href="/register">
                  Daftar Sekarang
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="h-11 md:h-12 flex-1 border-white/10 bg-white/[0.02] hover:bg-white/[0.08] backdrop-blur-sm text-sm rounded-xl font-medium">
                <Link href="/login">
                  Login
                </Link>
              </Button>
            </div>
            <Button variant="ghost" size="lg" asChild className="h-11 md:h-12 w-full text-muted-foreground hover:text-white hover:bg-white/5 text-sm rounded-xl font-medium">
              <Link href="/dashboard">
                Masuk sebagai Tamu
              </Link>
            </Button>
          </div>
          
          {/* Copyright */}
          <p className="text-[9px] md:text-[10px] text-muted-foreground/40 text-center mt-2">
            © {new Date().getFullYear()} AuditLife — All rights reserved.
          </p>

        </div>

      </main>

    </div>
  );
}
