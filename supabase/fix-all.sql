-- ============================================
-- FIX-ALL SQL untuk AuditLife
-- Jalankan script ini di Supabase SQL Editor
-- untuk memperbaiki semua masalah database
-- ============================================

-- ===== 1. TAMBAH 'income' KE ENUM finance_type =====
-- Enum lama hanya: 'need', 'want', 'investment'
-- Form keuangan butuh 'income' untuk pemasukan
ALTER TYPE finance_type ADD VALUE IF NOT EXISTS 'income';

-- ===== 2. PASTIKAN TRIGGER handle_new_user AKTIF =====
-- Trigger ini otomatis membuat entry di public.users
-- saat ada user baru mendaftar via auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (user_id, name, email, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), 
    new.email, 
    'user'::public.user_role
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Buat ulang trigger (drop dulu kalau ada)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ===== 3. SINKRONISASI USER YANG SUDAH ADA =====
-- Untuk user yang sudah terdaftar di auth.users tapi belum ada di public.users
INSERT INTO public.users (user_id, name, email, role)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)),
  email,
  'user'::public.user_role
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.users)
ON CONFLICT (user_id) DO NOTHING;

-- ===== 4. SEED KATEGORI AUDIT =====
-- Hapus data lama (jika ada) dan insert ulang
DELETE FROM public.categories;

INSERT INTO public.categories (category_name, type) VALUES
  ('Pekerjaan Utama', 'produktif'),
  ('Belajar/Kursus', 'produktif'),
  ('Membaca Buku', 'produktif'),
  ('Olahraga', 'produktif'),
  ('Ibadah', 'produktif'),
  ('Tugas Rumah/Keluarga', 'produktif'),
  ('Hiburan/Medsos', 'non-produktif'),
  ('Menonton Series/Film', 'non-produktif'),
  ('Bermain Game', 'non-produktif'),
  ('Nongkrong/Jalan-jalan', 'non-produktif'),
  ('Tidur Berlebihan', 'non-produktif'),
  ('Prokrastinasi', 'non-produktif');

-- ===== 5. PASTIKAN RLS POLICY UNTUK INSERT SUDAH BENAR =====
-- Policy insert untuk public.users (agar trigger bisa insert)
-- Trigger sudah pakai SECURITY DEFINER jadi seharusnya OK

-- Policy insert untuk financial_records (pastikan user bisa insert)
DROP POLICY IF EXISTS "Users can manage own financial records" ON public.financial_records;
DROP POLICY IF EXISTS "Users can view own financial records" ON public.financial_records;
DROP POLICY IF EXISTS "Users can view own financial records2" ON public.financial_records;
DROP POLICY IF EXISTS "Users can insert own financial records" ON public.financial_records;
DROP POLICY IF EXISTS "Users can update own financial records" ON public.financial_records;
DROP POLICY IF EXISTS "Users can delete own financial records" ON public.financial_records;

CREATE POLICY "Users can insert own financial records" ON public.financial_records 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own financial records" ON public.financial_records 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own financial records" ON public.financial_records 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own financial records" ON public.financial_records 
  FOR DELETE USING (auth.uid() = user_id);

-- Policy insert untuk public.users (agar auto-create dari kode bisa jalan)
DROP POLICY IF EXISTS "Users can insert themselves" ON public.users;
CREATE POLICY "Users can insert themselves" ON public.users 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ===== SELESAI! =====
-- Setelah menjalankan script ini, coba lagi simpan data audit dan keuangan.
