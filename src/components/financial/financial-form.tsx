"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FinancialFormValues, financialFormSchema } from "@/lib/validations/financial";
import { addFinancialRecord } from "@/app/(dashboard)/financial/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, Loader2 } from "lucide-react";

export function FinancialForm({ defaultType }: { defaultType?: "income" | "need" | "want" | "investment" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FinancialFormValues>({
    resolver: zodResolver(financialFormSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      category: "",
      amount: 0,
      type: defaultType || undefined,
      description: "",
    },
  });

  async function onSubmit(data: FinancialFormValues) {
    setIsLoading(true);
    try {
      const result = await addFinancialRecord(data);
      
      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sukses",
          description: "Catatan keuangan berhasil ditambahkan.",
        });
        form.reset({
          date: new Date().toISOString().split("T")[0],
          category: "",
          amount: 0,
          type: undefined,
          description: "",
        });
        setIsOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan yang tidak terduga.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) {
    if (defaultType === "income") {
      return (
        <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white" onClick={() => setIsOpen(true)}>
          <Plus className="h-4 w-4" />
          Tambah Pemasukan
        </Button>
      );
    }
    return (
      <Button className="gap-2" onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4" />
        Tambah Pengeluaran
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">Tambah Catatan Keuangan</h2>
            <p className="text-sm text-muted-foreground">Masukkan rincian pengeluaran atau pemasukan Anda di sini.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipe</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="">Pilih tipe...</option>
                        <option value="income" className="text-green-600 font-medium">Income (Pemasukan)</option>
                        <option value="need">Need (Kebutuhan)</option>
                        <option value="want">Want (Keinginan)</option>
                        <option value="investment">Investment (Investasi)</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori (Misal: Makanan, Transportasi)</FormLabel>
                    <FormControl>
                      <Input placeholder="Kategori pengeluaran" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah (Rp)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catatan Tambahan (Opsional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tambahkan detail jika perlu" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end pt-4 gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
