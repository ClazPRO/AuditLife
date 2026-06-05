import * as z from "zod";

export const financialFormSchema = z.object({
  date: z.string().min(1, { message: "Tanggal harus diisi" }),
  category: z.string().min(2, {
    message: "Kategori harus diisi minimal 2 karakter.",
  }),
  amount: z.coerce.number().min(1, {
    message: "Jumlah harus lebih dari 0",
  }),
  type: z.enum(["income", "need", "want", "investment"], {
    message: "Tipe pengeluaran/pemasukan harus dipilih.",
  }),
  description: z.string().optional(),
});

export type FinancialFormValues = z.infer<typeof financialFormSchema>;
