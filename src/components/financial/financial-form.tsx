"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FinancialFormValues, financialFormSchema } from "@/lib/validations/financial";
import { addFinancialRecord, classifyFinancialWithAI } from "@/app/(dashboard)/financial/actions";
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
  const [isAILoading, setIsAILoading] = useState(false);
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

  const selectedType = form.watch("type");
  const isIncome = selectedType === "income";

  // Auto-fill and manage category when income is selected
  // because user requested to not have category for income
  useEffect(() => {
    if (isIncome) {
      form.setValue("category", "Pemasukan");
      form.clearErrors("category");
    } else if (form.getValues("category") === "Pemasukan") {
      form.setValue("category", "");
    }
  }, [isIncome, form]);

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
      console.error("Gagal menambahkan catatan keuangan:", error);
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
        <Button className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white" onClick={() => setIsOpen(true)}>
          <Plus className="h-4 w-4" />
          Tambah Pemasukan
        </Button>
      );
    }
    return (
      <Button className="w-full gap-2" onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4" />
        Tambah Pengeluaran
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end xl:items-center justify-center bg-black/60 backdrop-blur-sm p-0 xl:p-4 animate-in fade-in duration-200">
      <div 
        className="fixed inset-0 -z-10" 
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      <div className="bg-background border-t border-white/10 xl:border border-white/5 rounded-t-3xl xl:rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom xl:slide-in-from-bottom-0 xl:zoom-in-95 duration-300 pb-10 xl:pb-0">
        {/* Handle bar on mobile */}
        <div className="mx-auto my-3 h-1.5 w-12 rounded-full bg-white/10 xl:hidden" />
        
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div>
            <h2 className="text-lg font-bold">Tambah Catatan Keuangan</h2>
            <p className="text-xs text-muted-foreground">Masukkan rincian pengeluaran atau pemasukan Anda di sini.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-5 max-h-[80vh] overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="h-11 bg-white/[0.02] border-white/10 focus:border-primary/50 text-sm rounded-xl" />
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
                    <FormLabel className="flex items-center gap-2">
                      Tipe
                      {isAILoading && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
                    </FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-11 w-full rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="" className="bg-card">Pilih tipe...</option>
                        <option value="income" className="text-green-600 font-medium bg-card">Income (Pemasukan)</option>
                        <option value="need" className="bg-card">Need (Kebutuhan)</option>
                        <option value="want" className="bg-card">Want (Keinginan)</option>
                        <option value="investment" className="bg-card">Investment (Investasi)</option>
                        <option value="receivable" className="text-amber-500 font-medium bg-card">Receivable (Piutang/Bayarin Teman)</option>
                        <option value="debt" className="text-rose-500 font-medium bg-card">Debt (Utang/Pinjam Uang)</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className={isIncome ? "hidden" : "block"}>
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Kategori (Misal: Makanan, Bayarin Ipan)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ketik pengeluaran / piutang..." 
                          className="h-11 bg-white/[0.02] border-white/10 focus:border-primary/50 text-sm rounded-xl"
                          {...field} 
                          onBlur={async (e) => {
                            field.onBlur();
                            const val = e.target.value;
                            if (val.trim().length > 2) {
                              setIsAILoading(true);
                              try {
                                const result = await classifyFinancialWithAI(val);
                                if (result && result.type) {
                                  form.setValue("type", result.type as any);
                                }
                              } catch (err) {
                                console.error(err);
                              } finally {
                                setIsAILoading(false);
                              }
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah (Rp)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="0" {...field} className="h-11 bg-white/[0.02] border-white/10 focus:border-primary/50 text-sm rounded-xl" />
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
                        className="resize-none bg-white/[0.02] border-white/10 focus:border-primary/50 text-sm rounded-xl min-h-[80px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end pt-4 gap-3">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="rounded-xl border-white/10 hover:bg-white/5">Batal</Button>
                <Button type="submit" disabled={isLoading} className="rounded-xl glow-primary-hover px-6">
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
