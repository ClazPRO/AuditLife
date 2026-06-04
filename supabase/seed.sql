-- Seed initial categories for AuditLife
-- Run this in the Supabase SQL Editor to populate the categories table

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
