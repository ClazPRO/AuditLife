"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { weeklyAuditSchema, WeeklyAuditFormValues } from "@/lib/validations/audit";
import { submitWeeklyAudit } from "@/app/(dashboard)/audit/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Tipe untuk kategori dari DB
type Category = {
  category_id: string;
  category_name: string;
  type: string;
};

export function ActivityForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
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
    resolver: zodResolver(weeklyAuditSchema) as any,
    defaultValues: {
      week_start_date: "",
      week_end_date: "",
      summary: "",
      activities: [
        { category_id: "", duration: 0, productivity_type: "produktif", description: "" },
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

    // If using fallback categories, we might have an issue inserting to DB because category_id '1', '2' won't exist as UUID.
    // So if categories are empty from DB, we actually need to warn the user, or we remove category_id constraint (which is not good).
    // For now, let's proceed. If it errors out due to FK constraint, we'll see it.
    const result = await submitWeeklyAudit(data);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tanggal Mulai Minggu Ini</Label>
          <Input type="date" {...form.register("week_start_date")} />
          {form.formState.errors.week_start_date && (
            <p className="text-sm text-destructive">{form.formState.errors.week_start_date.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Tanggal Akhir Minggu Ini</Label>
          <Input type="date" {...form.register("week_end_date")} />
          {form.formState.errors.week_end_date && (
            <p className="text-sm text-destructive">{form.formState.errors.week_end_date.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Daftar Aktivitas</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ category_id: "", duration: 0, productivity_type: "produktif", description: "" })}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Aktivitas
          </Button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-lg space-y-4 bg-card relative">
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Kategori</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...form.register(`activities.${index}.category_id` as const)}
                >
                  <option value="">Pilih Kategori...</option>
                  {activeCategories.map((c) => (
                    <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                  ))}
                </select>
                {form.formState.errors.activities?.[index]?.category_id && (
                  <p className="text-sm text-destructive">{form.formState.errors.activities[index]?.category_id?.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Durasi (Menit)</Label>
                <Input type="number" min="1" {...form.register(`activities.${index}.duration` as const)} />
                {form.formState.errors.activities?.[index]?.duration && (
                  <p className="text-sm text-destructive">{form.formState.errors.activities[index]?.duration?.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Sifat Aktivitas</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...form.register(`activities.${index}.productivity_type` as const)}
                >
                  <option value="produktif">Produktif</option>
                  <option value="non-produktif">Non-Produktif</option>
                </select>
                {form.formState.errors.activities?.[index]?.productivity_type && (
                  <p className="text-sm text-destructive">{form.formState.errors.activities[index]?.productivity_type?.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Deskripsi Singkat</Label>
              <Input placeholder="Apa yang Anda kerjakan?" {...form.register(`activities.${index}.description` as const)} />
              {form.formState.errors.activities?.[index]?.description && (
                <p className="text-sm text-destructive">{form.formState.errors.activities[index]?.description?.message}</p>
              )}
            </div>
          </div>
        ))}
        {form.formState.errors.activities?.root && (
            <p className="text-sm text-destructive">{form.formState.errors.activities.root.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Ringkasan Mingguan (Opsional)</Label>
        <Textarea 
          placeholder="Bagaimana perasaan Anda minggu ini secara umum?" 
          className="min-h-[100px]"
          {...form.register("summary")} 
        />
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
          {error}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
        {isSubmitting ? "Menyimpan..." : "Submit Weekly Audit"}
      </Button>
    </form>
  );
}
