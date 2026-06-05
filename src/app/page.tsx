import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Activity, PieChart, Shield, Sparkles, Wallet } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 h-full overflow-y-auto no-scrollbar relative">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-bg -z-10" />
      <div className="absolute inset-0 grid-pattern -z-10" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Header */}
      <header className="px-4 h-14 flex items-center border-b border-white/5 bg-background/80 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <Link className="flex items-center justify-center gap-1.5" href="/">
          <div className="h-7 w-7 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="font-bold text-sm tracking-tight">AuditLife</span>
        </Link>
        <nav className="ml-auto flex gap-2 sm:gap-3 items-center">
          <Link className="text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors" href="#features">
            Fitur
          </Link>
          <div className="flex gap-1.5">
            <Button variant="ghost" asChild size="sm" className="h-8 border border-white/10 hover:bg-white/5 text-[10px] px-2.5">
              <Link href="/login">Masuk</Link>
            </Button>
            <Button asChild size="sm" className="h-8 glow-primary-hover text-[10px] px-2.5">
              <Link href="/register">Daftar</Link>
            </Button>
          </div>
        </nav>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-10 flex items-center justify-center relative">
          <div className="px-4">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="space-y-4 fade-up">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] text-primary backdrop-blur-sm">
                  <Sparkles className="h-3 w-3" />
                  Platform Self-Audit Berbasis AI
                </div>
                
                <h1 className="text-2xl font-bold tracking-tighter leading-tight">
                  Evaluasi Hidupmu. <br />
                  <span className="shimmer-text">Tingkatkan Potensimu.</span>
                </h1>
                <p className="mx-auto max-w-[280px] text-[11px] text-muted-foreground leading-relaxed">
                  AuditLife adalah platform self-audit berbasis data yang membantu Anda memahami, mengevaluasi, dan meningkatkan kualitas hidup secara berkelanjutan.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 w-full max-w-[240px] pt-2">
                <Button asChild size="default" className="h-10 glow-primary-hover text-xs w-full">
                  <Link href="/register">
                    Mulai Audit Pertamamu
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button variant="outline" size="default" asChild className="h-10 border-white/10 hover:bg-white/5 text-xs w-full">
                  <Link href="/login">Masuk Akun</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-10 px-4 border-t border-white/5">
          <div className="flex flex-col items-center justify-center space-y-3 text-center mb-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] text-primary">
                Fitur Utama
              </div>
              <h2 className="text-lg font-bold tracking-tighter">
                Lebih dari sekadar pencatatan waktu
              </h2>
              <p className="max-w-[260px] text-[11px] text-muted-foreground mx-auto">
                Sistem kami menganalisis pola Anda dan memberikan wawasan untuk pertumbuhan berkelanjutan.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Feature 1 */}
            <div className="group relative flex flex-col items-center space-y-2 text-center p-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-300">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 transition-all duration-300">
                <Activity className="h-5.5 w-5.5 text-primary" />
              </div>
              <h3 className="text-sm font-bold">Weekly Audit</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Catat aktivitas mingguanmu dengan mudah. Ketahui berapa banyak waktu yang kamu investasikan.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="group relative flex flex-col items-center space-y-2 text-center p-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-300">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 transition-all duration-300">
                <PieChart className="h-5.5 w-5.5 text-blue-400" />
              </div>
              <h3 className="text-sm font-bold">AI Insight</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Dapatkan rekomendasi spesifik berbasis data mengenai pola kebiasaan dan cara memperbaikinya.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="group relative flex flex-col items-center space-y-2 text-center p-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-300">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 transition-all duration-300">
                <Wallet className="h-5.5 w-5.5 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold">Financial Audit</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Pantau arus kas dan kelola pengeluaran dengan sistem Need/Want/Investment.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group relative flex flex-col items-center space-y-2 text-center p-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-300">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 transition-all duration-300">
                <Shield className="h-5.5 w-5.5 text-amber-400" />
              </div>
              <h3 className="text-sm font-bold">Privasi Terjaga</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Data Anda adalah milik Anda. Dengan sistem Row Level Security, privasi Anda selalu aman.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="flex flex-col gap-2 py-6 w-full shrink-0 items-center px-4 border-t border-white/5 bg-black/20">
        <p className="text-[10px] text-muted-foreground">
          &copy; {new Date().getFullYear()} AuditLife. All rights reserved.
        </p>
        <nav className="flex gap-4">
          <Link className="text-[10px] text-muted-foreground hover:text-foreground transition-colors" href="#">
            Syarat Ketentuan
          </Link>
          <Link className="text-[10px] text-muted-foreground hover:text-foreground transition-colors" href="#">
            Kebijakan Privasi
          </Link>
        </nav>
      </footer>
    </div>
  );
}
