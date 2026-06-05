import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Activity, PieChart, Shield, Sparkles, Wallet } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 gradient-bg -z-10" />
      <div className="fixed inset-0 grid-pattern -z-10" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2" href="/">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight">AuditLife</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="/#features">
            Fitur
          </Link>
          <Link className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="/#about">
            Tentang
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" asChild className="hidden sm:inline-flex border border-white/10 hover:bg-white/5">
              <Link href="/login">Masuk</Link>
            </Button>
            <Button asChild className="glow-primary-hover">
              <Link href="/register">Daftar</Link>
            </Button>
          </div>
        </nav>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-36 lg:py-48 flex items-center justify-center relative">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-6 max-w-3xl fade-up">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary backdrop-blur-sm fade-up fade-up-delay-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  Platform Self-Audit Berbasis AI
                </div>
                
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl fade-up fade-up-delay-2">
                  Evaluasi Hidupmu. <br />
                  <span className="shimmer-text">Tingkatkan Potensimu.</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl fade-up fade-up-delay-3">
                  AuditLife adalah platform self-audit berbasis data yang membantu Anda memahami, mengevaluasi, dan meningkatkan kualitas hidup secara berkelanjutan.
                </p>
              </div>
              <div className="space-x-4 fade-up fade-up-delay-4">
                <Button asChild size="lg" className="h-12 px-8 glow-primary-hover">
                  <Link href="/register">
                    Mulai Audit Pertamamu
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="h-12 px-8 border-white/10 hover:bg-white/5">
                  <Link href="/login">Masuk</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-32 flex justify-center relative border-t border-white/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
                  Fitur Utama
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
                  Lebih dari sekadar pencatatan waktu
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-lg mx-auto">
                  Sistem kami menganalisis pola Anda dan memberikan wawasan untuk pertumbuhan berkelanjutan.
                </p>
              </div>
            </div>
            
            <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-4">
              {/* Feature 1 */}
              <div className="group relative flex flex-col items-center space-y-4 text-center p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-300">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300">
                  <Activity className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold">Weekly Audit</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Catat aktivitas mingguanmu dengan mudah. Ketahui berapa banyak waktu yang kamu investasikan.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="group relative flex flex-col items-center space-y-4 text-center p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-300">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 group-hover:from-blue-500/30 group-hover:to-blue-500/10 transition-all duration-300">
                  <PieChart className="h-7 w-7 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold">AI Insight</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Dapatkan rekomendasi spesifik berbasis data mengenai pola kebiasaan dan cara memperbaikinya.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="group relative flex flex-col items-center space-y-4 text-center p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-300">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 group-hover:from-emerald-500/30 group-hover:to-emerald-500/10 transition-all duration-300">
                  <Wallet className="h-7 w-7 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold">Financial Audit</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Pantau arus kas dan kelola pengeluaran dengan sistem Need/Want/Investment.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group relative flex flex-col items-center space-y-4 text-center p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-300">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 group-hover:from-amber-500/30 group-hover:to-amber-500/10 transition-all duration-300">
                  <Shield className="h-7 w-7 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold">Privasi Terjaga</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Data Anda adalah milik Anda. Dengan sistem Row Level Security, privasi Anda selalu aman.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-white/5">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} AuditLife. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs text-muted-foreground hover:text-foreground transition-colors" href="#">
            Syarat Ketentuan
          </Link>
          <Link className="text-xs text-muted-foreground hover:text-foreground transition-colors" href="#">
            Kebijakan Privasi
          </Link>
        </nav>
      </footer>
    </div>
  );
}
