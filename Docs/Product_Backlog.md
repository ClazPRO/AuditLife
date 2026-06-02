# Product Backlog — AuditLife

Dokumen ini berisi daftar backlog pengembangan (Product Backlog) berdasarkan [AuditLife PRD](AuditLife_PRD.md), [Developer Reference](Developer_Reference.md), dan rancangan sistem proyek. Backlog disusun berdasarkan fase pengembangan (Roadmap).

---

## Fase 1: MVP (Minimum Viable Product)
**Target Durasi: 1-2 Bulan**

### Epic 1: Setup Proyek & Infrastruktur
- [x] **Task 1.1:** Inisialisasi proyek Next.js 14 dengan App Router.
- [x] **Task 1.2:** Konfigurasi Tailwind CSS dan instalasi shadcn/ui.
- [x] **Task 1.3:** Setup proyek di Supabase (Database, Auth, Storage).
- [x] **Task 1.4:** Implementasi skema database inti berdasarkan PRD (Tabel: `Users`, `Weekly_Audit`, `Activities`, `Categories`, `Financial_Records`).
- [x] **Task 1.5:** Penerapan Row Level Security (RLS) pada tabel Supabase agar data aman dan terisolasi antar pengguna.
- [ ] **Task 1.6:** Setup CI/CD pipeline dari GitHub ke Vercel.

### Epic 2: Autentikasi & Manajemen Akses (RBAC)
- [ ] **Task 2.1:** Pembuatan halaman Login dan Registrasi.
- [ ] **Task 2.2:** Integrasi Supabase Auth untuk pendaftaran menggunakan Email/Password.
- [ ] **Task 2.3:** Integrasi Single Sign-On (SSO) OAuth menggunakan Google/Microsoft.
- [ ] **Task 2.4:** Implementasi Role-Based Access Control (RBAC) untuk peran: `user`, `admin`, dan `super_admin`.
- [ ] **Task 2.5:** Proteksi rute (Route Protection) menggunakan middleware Next.js.

### Epic 3: Weekly Audit & Manajemen Data Dasar
- [ ] **Task 3.1:** Pembuatan halaman "Weekly Audit" (Form input data mingguan).
- [ ] **Task 3.2:** Fitur penambahan aktivitas dengan kolom: kategori, durasi (menit), jenis produktivitas, dan deskripsi.
- [ ] **Task 3.3:** Validasi form input pengguna sebelum data dikirim (submit) ke database.
- [ ] **Task 3.4:** Fitur CRUD (Create, Read, Update, Delete) Kategori Aktivitas untuk standarisasi jenis aktivitas.
- [ ] **Task 3.5:** Fitur penyimpanan (Save Draft) dan Submit Audit mingguan ke tabel `Weekly_Audit`.

---

## Fase 2: Analisis, Scoring & Fitur Keuangan
**Target Durasi: 2-3 Bulan**

### Epic 4: Analytics Dashboard Module
- [ ] **Task 4.1:** Pembuatan UI/UX Dashboard Utama pengguna.
- [ ] **Task 4.2:** Integrasi library chart (misal: Recharts) untuk menampilkan Grafik Distribusi Waktu (Pie Chart/Bar Chart).
- [ ] **Task 4.3:** Pembuatan grafik tren aktivitas mingguan (Line Chart) untuk melihat historis aktivitas.
- [ ] **Task 4.4:** Komponen Card Ringkasan Skor untuk menampilkan nilai produktivitas minggu berjalan.
- [ ] **Task 4.5:** Fitur filter dan navigasi untuk berpindah antar periode audit.

### Epic 5: Scoring System Engine
- [ ] **Task 5.1:** Implementasi fungsi kalkulasi **Productivity Score** (0-100) berdasarkan rasio waktu produktif vs non-produktif.
- [ ] **Task 5.2:** Implementasi fungsi kalkulasi **Time Management Score** (0-100) berdasarkan target jam dan konsistensi harian.
- [ ] **Task 5.3:** Implementasi fungsi kalkulasi **Consistency Score** (0-100) menggunakan data 3 minggu terakhir.
- [ ] **Task 5.4:** Implementasi fungsi kalkulasi agregat **Total Score** dengan sistem pembobotan (weighting) sesuai standar PRD.
- [ ] **Task 5.5:** Integrasi penyimpanan hasil kalkulasi ke dalam tabel `Scores`.

### Epic 6: Financial Audit Module
- [ ] **Task 6.1:** Pembuatan UI form pencatatan keuangan harian (pengeluaran).
- [ ] **Task 6.2:** Integrasi input keuangan dengan klasifikasi: `need`, `want`, `investment`.
- [ ] **Task 6.3:** Implementasi fungsi kalkulasi **Financial Discipline Score** berdasarkan porsi *want* vs *need* vs *investment*.
- [ ] **Task 6.4:** Visualisasi ringkasan dan laporan pengeluaran periodik di dalam dashboard.

---

## Fase 3: Integrasi Insight & AI Rule-Based
**Target Durasi: 1-2 Bulan**

### Epic 7: AI Insight Engine (Rule-Based)
- [ ] **Task 7.1:** Setup struktur `Rule Engine` dasar pada backend/Edge Functions.
- [ ] **Task 7.2:** Implementasi Rule Produktivitas (misal: *Low Productive Time*, *No Priority Activity*, *High Productivity Week*).
- [ ] **Task 7.3:** Implementasi Rule Manajemen Waktu (misal: *Weekend Productivity Dip*, *Entertainment Dominance*).
- [ ] **Task 7.4:** Implementasi Rule Keuangan (misal: *Want Spending Dominance*, *Zero Investment*).
- [ ] **Task 7.5:** Implementasi Cross-Dimensional Rules (misal: *High Spending + Low Productivity*).
- [ ] **Task 7.6:** Pembuatan *Pattern Detection System* (mendeteksi pola seperti *Recurring Low Week* atau *Improving Trend* selama beberapa minggu).
- [ ] **Task 7.7:** Halaman khusus **Insight & Analisis** untuk menampilkan hasil evaluasi beserta rekomendasi tindak lanjut yang dapat dilakukan.

---

## Fase 4: Fitur Lanjutan (Refleksi, Riwayat & Admin)
**Target Durasi: 1 Bulan**

### Epic 8: Reflection & Spiritual Module
- [ ] **Task 8.1:** Pembuatan form Refleksi Mingguan ("Apa yang berjalan baik", "Apa yang perlu diperbaiki").
- [ ] **Task 8.2:** Fitur penetapan *Next Plan* (Target perbaikan minggu depan).
- [ ] **Task 8.3:** Pembuatan fitur *Spiritual Reflection* opsional (Jurnal Syukur & Niat Mingguan) dengan privasi penuh dan tanpa penilaian/scoring.
- [ ] **Task 8.4:** Penyimpanan dan integrasi data refleksi ke dalam tabel `Reflections`.

### Epic 9: Riwayat & Komparasi Audit
- [ ] **Task 9.1:** Halaman **Riwayat Audit** untuk menampilkan list seluruh audit yang pernah dilakukan.
- [ ] **Task 9.2:** Fitur komparasi skor antar periode secara berurutan.
- [ ] **Task 9.3:** Fitur Weekly Report Generator (Ringkasan laporan mingguan).

### Epic 10: Admin Panel & Configuration
- [ ] **Task 10.1:** Dashboard khusus untuk peran Admin/Super Admin.
- [ ] **Task 10.2:** Sistem *Data-Driven Configuration* untuk memungkinkan Admin mengubah kategori, indikator, dan pembobotan parameter evaluasi tanpa merubah kode sistem.
- [ ] **Task 10.3:** Fitur *Import/Export* template instrumen audit format JSON atau Excel.

---

## Fase 5: Optimasi & Skalabilitas (Jangka Panjang)
**Target Durasi: Berkelanjutan**

### Epic 11: Machine Learning & LLM Integration (Roadmap Lanjutan)
- [ ] **Task 11.1:** Integrasi dengan LLM API (seperti OpenAI/Anthropic) untuk memberikan *Personalized Insight* berdasarkan data text refleksi dan aktivitas pengguna (Sesuai *Prompt Registry* di `AI_SPEC.md`).
- [ ] **Task 11.2:** Transisi bertahap beberapa parameter dari rule-based menjadi Machine Learning untuk mendeteksi *anomaly* dan *predictive analytics*.

### Epic 12: Expansion & Mobile
- [ ] **Task 12.1:** Pengembangan versi Mobile App (PWA atau React Native/Flutter).
- [ ] **Task 12.2:** Integrasi dengan sistem kalender (Google Calendar, Outlook) untuk otomatisasi pencatatan waktu aktivitas.
- [ ] **Task 12.3:** Integrasi notifikasi (Email atau Push Notification) untuk *reminder* jadwal *Weekly Audit*.
