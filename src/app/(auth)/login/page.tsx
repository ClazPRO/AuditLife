"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { login, loginAsGuest } from "../actions"
import { useState } from "react"
import { Loader2, Sparkles } from "lucide-react"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    const result = await login(formData);
    
    if (result?.error) {
      setError(result.error);
    }
    setIsLoading(false);
  }

  async function handleGuestSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    const result = await loginAsGuest(formData);
    
    if (result?.error) {
      setError(result.error);
    }
    setIsLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-full flex-1 relative py-8 px-4">
      {/* Background */}
      <div className="fixed inset-0 gradient-bg -z-10" />
      <div className="fixed inset-0 grid-pattern -z-10" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="w-full max-w-[400px] mx-4 fade-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold text-2xl tracking-tight">AuditLife</span>
        </div>

        <Card className="border-white/10 bg-card/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Selamat Datang Kembali</CardTitle>
            <CardDescription>
              Masukkan email dan password Anda untuk melanjutkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Lupa password?</Link>
                </div>
                <Input id="password" name="password" type="password" required className="bg-background/50" />
              </div>
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm font-medium text-destructive">{error}</p>
                </div>
              )}
              <Button className="w-full glow-primary-hover" type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Memproses..." : "Masuk"}
              </Button>
            </form>
            
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground">
                  Atau masuk sebagai tamu
                </span>
              </div>
            </div>
            
            <form action={handleGuestSubmit} className="space-y-2">
              <div className="flex gap-2">
                <Input id="nickname" name="nickname" type="text" placeholder="Masukkan Nama Panggilan" required className="bg-background/50" />
                <Button variant="secondary" type="submit" disabled={isLoading}>
                  Masuk
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center justify-center space-y-2">
            <div className="text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <Link href="/register" className="font-semibold text-primary hover:underline">
                Daftar sekarang
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
