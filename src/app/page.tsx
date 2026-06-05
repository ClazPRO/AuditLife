import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Activity, PieChart, Shield, Sparkles, Wallet } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-bg -z-10" />
      <div className="absolute inset-0 grid-pattern -z-10" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Header */}
      <header className="w-full border-b border-white/5 bg-background/80 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center">
          <Link className="flex items-center justify-center gap-1.5" href="/">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <span className="font-bold text-base md:text-lg tracking-tight bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">AuditLife</span>
          </Link>
          <nav className="ml-auto flex gap-4 md:gap-6 items-center">
            <Link className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors" href="#features">
              Fitur
            </Link>
            <div className="flex gap-2">
              <Button variant="ghost" asChild size="sm" className="h-9 border border-white/10 hover:bg-white/5 text-xs px-3 md:px-4 rounded-xl">
                <Link href="/login">Masuk</Link>
              </Button>
              <Button asChild size="sm" className="h-9 glow-primary-hover text-xs px-3 md:px-4 rounded-xl">
                <Link href="/register">Daftar</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 md:py-28 flex items-center justify-center relative">
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-6 fade-up">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs text-primary backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  Platform Self-Audit Berbasis AI
                </div>
                
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.15] md:leading-[1.1]">
                  Evaluasi Hidupmu. <br />
                  <span className="shimmer-text">Tingkatkan Potensimu.</span>
                </h1>
                <p className="mx-auto max-w-md sm:max-w-xl text-xs sm:text-sm md:text-lg text-muted-foreground leading-relaxed">
                  AuditLife adalah platform self-audit berbasis data yang membantu Anda memahami, mengevaluasi, dan meningkatkan kualitas hidup secara berkelanjutan.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3.5 w-full max-w-[400px] pt-4 justify-center">
                <Button asChild size="lg" className="h-12 glow-primary-hover text-xs md:text-sm px-6 rounded-xl flex-1">
                  <Link href="/register">
                    Mulai Audit Pertamamu
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="h-12 border-white/10 hover:bg-white/5 text-xs md:text-sm px-6 rounded-xl flex-1">
                  <Link href="/login">Masuk Akun</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-16 md:py-24 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <div className="flex flex-col items-center justify-center space-y-3 text-center mb-12">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs text-primary">
                  Fitur Utama
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Lebih dari sekadar pencatatan waktu
                </h2>
                <p className="max-w-md text-xs sm:text-sm text-muted-foreground mx-auto leading-relaxed">
                  Sistem kami menganalisis pola Anda dan memberikan wawasan untuk pertumbuhan berkelanjutan.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className="group relative flex flex-col items-center space-y-3 text-center p-6 md:p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 transition-all duration-300">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-base font-bold">Weekly Audit</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Catat aktivitas mingguanmu dengan mudah. Ketahui berapa banyak waktu yang kamu investasikan.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="group relative flex flex-col items-center space-y-3 text-center p-6 md:p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 transition-all duration-300">
                  <PieChart className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-base font-bold">AI Insight</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Dapatkan rekomendasi spesifik berbasis data mengenai pola kebiasaan dan cara memperbaikinya.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="group relative flex flex-col items-center space-y-3 text-center p-6 md:p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 transition-all duration-300">
                  <Wallet className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-base font-bold">Financial Audit</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Pantau arus kas dan kelola pengeluaran dengan sistem Need/Want/Investment.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group relative flex flex-col items-center space-y-3 text-center p-6 md:p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 transition-all duration-300">
                  <Shield className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="text-base font-bold">Privasi Terjaga</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Data Anda adalah milik Anda. Dengan sistem Row Level Security, privasi Anda selalu aman.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-white/5 bg-black/20 py-8">
        <div className="max-w-6xl mx-auto px-6 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} AuditLife. All rights reserved.
          </p>
          <nav className="flex gap-6">
            <Link className="text-xs text-muted-foreground hover:text-foreground transition-colors" href="#">
              Syarat Ketentuan
            </Link>
            <Link className="text-xs text-muted-foreground hover:text-foreground transition-colors" href="#">
              Kebijakan Privasi
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
