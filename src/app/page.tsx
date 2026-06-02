import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Activity, PieChart, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-xl text-primary tracking-tight">AuditLife</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/#features">
            Fitur
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/#about">
            Tentang
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" asChild className="hidden sm:inline-flex">
              <Link href="/login">Masuk</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Daftar</Link>
            </Button>
          </div>
        </nav>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-48 flex items-center justify-center border-b">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Evaluasi Hidupmu. <br />
                  <span className="text-primary">Tingkatkan Potensimu.</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  AuditLife adalah platform self-audit berbasis data yang membantu Anda memahami, mengevaluasi, dan meningkatkan kualitas hidup secara berkelanjutan.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg" className="h-12 px-8">
                  <Link href="/register">
                    Mulai Audit Pertamamu
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="h-12 px-8">
                  <Link href="/login">Masuk</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-32 flex justify-center bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Fitur Utama
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Lebih dari sekadar pencatatan waktu
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Sistem kami menganalisis pola Anda dan memberikan wawasan untuk pertumbuhan berkelanjutan.
                </p>
              </div>
            </div>
            
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Activity className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Weekly Audit</h3>
                <p className="text-muted-foreground">
                  Catat aktivitas mingguanmu dengan mudah. Ketahui berapa banyak waktu yang kamu investasikan untuk hal-hal produktif.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <PieChart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">AI Insight</h3>
                <p className="text-muted-foreground">
                  Dapatkan rekomendasi spesifik berbasis data (rule-based) mengenai pola kebiasaan dan cara memperbaikinya.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Privasi Terjaga</h3>
                <p className="text-muted-foreground">
                  Data Anda adalah milik Anda. Dengan sistem Row Level Security, privasi jurnal spiritual dan refleksi Anda aman.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} AuditLife. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Syarat Ketentuan
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Kebijakan Privasi
          </Link>
        </nav>
      </footer>
    </div>
  );
}
