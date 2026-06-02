import * as z from "zod";

export const activitySchema = z.object({
  category_id: z.string().min(1, { message: "Kategori wajib dipilih" }),
  duration: z.coerce.number().min(1, { message: "Durasi minimal 1 menit" }).max(10080, { message: "Durasi tidak valid (maks 1 minggu)" }),
  productivity_type: z.enum(["produktif", "non-produktif"], {
    errorMap: () => ({ message: "Pilih jenis produktivitas" }),
  }),
  description: z.string().min(3, { message: "Deskripsi minimal 3 karakter" }).max(500, { message: "Deskripsi maksimal 500 karakter" }),
});

export const weeklyAuditSchema = z.object({
  week_start_date: z.string().min(1, { message: "Tanggal mulai wajib diisi" }),
  week_end_date: z.string().min(1, { message: "Tanggal akhir wajib diisi" }),
  summary: z.string().optional(),
  activities: z.array(activitySchema).min(1, { message: "Minimal harus ada 1 aktivitas" }),
});

export type ActivityFormValues = z.infer<typeof activitySchema>;
export type WeeklyAuditFormValues = z.infer<typeof weeklyAuditSchema>;
