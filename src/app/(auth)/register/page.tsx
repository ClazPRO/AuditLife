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
import { register, loginAsGuest } from "../actions"
import { useState } from "react"
import { Loader2, Sparkles } from "lucide-react"

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    
    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      setIsLoading(false);
      return;
    }

    const result = await register(formData);
    
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

      <div className="w-full max-w-[450px] mx-4 fade-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold text-2xl tracking-tight">AuditLife</span>
        </div>

        <Card className="border-white/10 bg-card/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Buat Akun Baru</CardTitle>
            <CardDescription>
              Isi form di bawah ini untuk mulai Audit Aktivitasmu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" name="name" type="text" placeholder="John Doe" required className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required className="bg-background/50" />
              </div>
              
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm font-medium text-destructive">{error}</p>
                </div>
              )}
              
              <Button className="w-full glow-primary-hover" type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Mendaftar..." : "Daftar Akun"}
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
              Sudah punya akun?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Masuk di sini
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
