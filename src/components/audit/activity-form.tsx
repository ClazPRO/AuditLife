"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { weeklyAuditSchema, WeeklyAuditFormValues } from "@/lib/validations/audit";
import { submitWeeklyAudit, classifyCategoryWithAI } from "@/app/(dashboard)/audit/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";

// Tipe untuk kategori dari DB
type Category = {
  category_id: string;
  category_name: string;
  type: string;
};

export function ActivityForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fallback categories if db is empty
  const defaultCategories = [
    { category_id: "1", category_name: "Pekerjaan Utama", type: "produktif" },
    { category_id: "2", category_name: "Belajar/Kursus", type: "produktif" },
    { category_id: "3", category_name: "Hiburan/Medsos", type: "non-produktif" },
    { category_id: "4", category_name: "Olahraga", type: "produktif" },
  ];

  const activeCategories = categories.length > 0 ? categories : defaultCategories;

  const form = useForm<WeeklyAuditFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(weeklyAuditSchema) as any,
    defaultValues: {
      week_start_date: "",
      week_end_date: "",
      summary: "",
      activities: [
        { category_id: "", custom_category: "", duration: 0, productivity_type: "produktif", description: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "activities",
  });

  async function onSubmit(data: WeeklyAuditFormValues) {
    setIsSubmitting(true);
    setError(null);

    const result = await submitWeeklyAudit(data);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      setIsOpen(false);
      form.reset({
        week_start_date: "",
        week_end_date: "",
        summary: "",
        activities: [
          { category_id: "", custom_category: "", duration: 0, productivity_type: "produktif", description: "" },
        ],
      });
      router.push("/dashboard");
    }
  }

  if (!isOpen) {
    return (
      <Button className="gap-2 glow-primary-hover h-11 rounded-xl px-6" onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4" />
        Tambah Audit Mingguan
      </Button>
    );
  }

  return (
    <>
      <Button className="gap-2 glow-primary-hover h-11 rounded-xl px-6" onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4" />
        Tambah Audit Mingguan
      </Button>

      <div className="fixed inset-0 z-50 flex items-end xl:items-center justify-center bg-black/60 backdrop-blur-sm p-0 xl:p-4 animate-in fade-in duration-200">
        <div 
          className="fixed inset-0 -z-10" 
          onClick={() => setIsOpen(false)}
        />
        <div className="bg-background border-t border-white/10 xl:border border-white/5 rounded-t-3xl xl:rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom xl:slide-in-from-bottom-0 xl:zoom-in-95 duration-300 pb-10 xl:pb-0">
          {/* Handle bar on mobile */}
          <div className="mx-auto my-3 h-1.5 w-12 rounded-full bg-white/10 xl:hidden" />
          
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <div>
              <h2 className="text-lg font-bold">Log Weekly Audit</h2>
              <p className="text-xs text-muted-foreground">Catat aktivitas mingguan Anda di sini.</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-5 max-h-[75vh] overflow-y-auto">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tanggal Mulai Minggu Ini</Label>
                  <Input type="date" {...form.register("week_start_date")} className="h-11 rounded-xl bg-white/[0.02] border-white/10 focus:border-primary/50 text-sm" />
                  {form.formState.errors.week_start_date && (
                    <p className="text-sm text-destructive">{form.formState.errors.week_start_date.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tanggal Akhir Minggu Ini</Label>
                  <Input type="date" {...form.register("week_end_date")} className="h-11 rounded-xl bg-white/[0.02] border-white/10 focus:border-primary/50 text-sm" />
                  {form.formState.errors.week_end_date && (
                    <p className="text-sm text-destructive">{form.formState.errors.week_end_date.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold">Daftar Aktivitas</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ category_id: "", custom_category: "", duration: 0, productivity_type: "produktif", description: "" })}
                    className="rounded-xl border-white/10 hover:bg-white/5 h-9 text-xs"
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Tambah Aktivitas
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className="p-5 border border-white/5 rounded-2xl space-y-4 bg-white/[0.02] relative hover:bg-white/[0.03] transition-colors">
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-3 text-muted-foreground hover:text-destructive h-8 w-8 rounded-full hover:bg-white/5"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground font-medium">Kategori</Label>
                        <select
                          className="flex h-11 w-full rounded-xl border border-white/10 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50"
                          {...form.register(`activities.${index}.category_id` as const)}
                          onChange={(e) => {
                            form.register(`activities.${index}.category_id`).onChange(e);
                            const val = e.target.value;
                            if (val && val !== "lain-lain") {
                              const cat = activeCategories.find(c => c.category_id === val);
                              if (cat) {
                                form.setValue(`activities.${index}.productivity_type`, cat.type as any);
                              }
                            }
                          }}
                        >
                          <option value="" className="bg-card">Pilih Kategori...</option>
                          {activeCategories.map((c) => (
                            <option key={c.category_id} value={c.category_id} className="bg-card">{c.category_name}</option>
                          ))}
                          <option value="lain-lain" className="bg-card italic">Lain-lain (Isi Sendiri)</option>
                        </select>
                        {form.formState.errors.activities?.[index]?.category_id && (
                          <p className="text-xs text-destructive">{form.formState.errors.activities[index]?.category_id?.message}</p>
                        )}
                      </div>

                      {form.watch(`activities.${index}.category_id`) === "lain-lain" && (
                        <div className="space-y-2 col-span-1 md:col-span-3">
                          <Label className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                            Kategori Custom
                            {isSubmitting && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
                          </Label>
                          <Input 
                            placeholder="Ketik kategori Anda..." 
                            {...form.register(`activities.${index}.custom_category` as const)}
                            className="h-11 rounded-xl bg-white/[0.01] border-primary/30 focus:border-primary text-sm"
                            onBlur={async (e) => {
                              form.register(`activities.${index}.custom_category`).onBlur(e);
                              const val = e.target.value;
                              if (val.trim().length > 2) {
                                const result = await classifyCategoryWithAI(val);
                                form.setValue(`activities.${index}.productivity_type`, result.type as any);
                              }
                            }}
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground font-medium">Durasi (Menit)</Label>
                        <Input type="number" min="1" {...form.register(`activities.${index}.duration` as const)} className="h-11 rounded-xl bg-white/[0.01] border-white/10 focus:border-primary/50 text-sm" />
                        {form.formState.errors.activities?.[index]?.duration && (
                          <p className="text-xs text-destructive">{form.formState.errors.activities[index]?.duration?.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground font-medium">Sifat Aktivitas</Label>
                        <select
                          className="flex h-11 w-full rounded-xl border border-white/10 bg-background/50 px-3 py-2 text-sm text-muted-foreground pointer-events-none opacity-80"
                          {...form.register(`activities.${index}.productivity_type` as const)}
                          tabIndex={-1}
                        >
                          <option value="produktif" className="bg-card">Produktif (Otomatis)</option>
                          <option value="non-produktif" className="bg-card">Non-Produktif (Otomatis)</option>
                        </select>
                        {form.formState.errors.activities?.[index]?.productivity_type && (
                          <p className="text-xs text-destructive">{form.formState.errors.activities[index]?.productivity_type?.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground font-medium">Deskripsi Singkat</Label>
                      <Input placeholder="Apa yang Anda kerjakan?" {...form.register(`activities.${index}.description` as const)} className="h-11 rounded-xl bg-white/[0.01] border-white/10 focus:border-primary/50 text-sm" />
                      {form.formState.errors.activities?.[index]?.description && (
                        <p className="text-xs text-destructive">{form.formState.errors.activities[index]?.description?.message}</p>
                      )}
                    </div>
                  </div>
                ))}
                {form.formState.errors.activities?.root && (
                    <p className="text-sm text-destructive">{form.formState.errors.activities.root.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Ringkasan Mingguan (Opsional)</Label>
                <Textarea 
                  placeholder="Bagaimana perasaan Anda minggu ini secara umum?" 
                  className="min-h-[100px] rounded-xl bg-white/[0.02] border-white/10 focus:border-primary/50 text-sm"
                  {...form.register("summary")} 
                />
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-xl text-sm border border-destructive/20">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="rounded-xl border-white/10 hover:bg-white/5">Batal</Button>
                <Button type="submit" className="rounded-xl glow-primary-hover px-6" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Menyimpan..." : "Simpan Audit Mingguan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
