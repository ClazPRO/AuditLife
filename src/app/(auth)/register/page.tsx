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
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px] sm:w-[450px]">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Buat Akun AuditLife</CardTitle>
          <CardDescription>
            Isi form di bawah ini untuk mendaftar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" name="name" type="text" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required />
            </div>
            
            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
            
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Mendaftar..." : "Daftar Akun"}
            </Button>
          </form>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Atau masuk sebagai tamu
              </span>
            </div>
          </div>
          
          <form action={handleGuestSubmit} className="space-y-2">
            <div className="flex gap-2">
              <Input id="nickname" name="nickname" type="text" placeholder="Masukkan Nama Panggilan" required />
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
  )
}
