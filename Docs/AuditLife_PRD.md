# Product Requirements Document (PRD)
## AuditLife — Platform Self-Audit & Life Insight

**Versi Dokumen:** 1.0  
**Tanggal:** 2026  
**Status:** Draft  
**Klasifikasi:** Rahasia dan Terbatas  
**Tech Stack:** Next.js 14 · Supabase PostgreSQL · Vercel  

---

## Daftar Isi

1. [Ringkasan Produk](#1-ringkasan-produk)
2. [Latar Belakang & Problem Statement](#2-latar-belakang--problem-statement)
3. [Tujuan Produk](#3-tujuan-produk)
4. [Target Pengguna](#4-target-pengguna)
5. [Scope & Ruang Lingkup](#5-scope--ruang-lingkup)
6. [Fitur & Kebutuhan Fungsional](#6-fitur--kebutuhan-fungsional)
   - 6.1 [Weekly Audit Module](#61-weekly-audit-module)
   - 6.2 [Analytics Dashboard Module](#62-analytics-dashboard-module)
   - 6.3 [AI Insight Module](#63-ai-insight-module)
   - 6.4 [Reflection Module](#64-reflection-module)
   - 6.5 [Scoring System Module](#65-scoring-system-module)
   - 6.6 [Spiritual Reflection Module](#66-spiritual-reflection-module)
   - 6.7 [Financial Audit Module](#67-financial-audit-module)
7. [Kebutuhan Non-Fungsional](#7-kebutuhan-non-fungsional)
8. [Arsitektur Sistem](#8-arsitektur-sistem)
9. [Skema Database](#9-skema-database)
10. [Manajemen Pengguna & Role-Based Access Control](#10-manajemen-pengguna--role-based-access-control)
11. [Alur Kerja Pengguna (User Flow)](#11-alur-kerja-pengguna-user-flow)
12. [Antarmuka Pengguna (UI Requirements)](#12-antarmuka-pengguna-ui-requirements)
13. [Roadmap Pengembangan](#13-roadmap-pengembangan)
14. [Asumsi & Keterbatasan](#14-asumsi--keterbatasan)
15. [Risiko & Mitigasi](#15-risiko--mitigasi)
16. [Kriteria Keberhasilan (Success Metrics)](#16-kriteria-keberhasilan-success-metrics)
17. [Langkah Selanjutnya](#17-langkah-selanjutnya)

---

## 1. Ringkasan Produk

**AuditLife** adalah aplikasi berbasis digital yang dirancang untuk membantu pengguna melakukan *self-audit* kehidupan secara berkala melalui pencatatan aktivitas, penggunaan waktu, dan pencapaian. Sistem ini mengintegrasikan proses pencatatan aktivitas, analisis pola perilaku, serta penyajian insight yang bertujuan meningkatkan kesadaran diri pengguna.

AuditLife tidak hanya berfungsi sebagai alat pencatatan, tetapi juga sebagai sistem analisis dan pendukung pengambilan keputusan yang membantu pengguna memahami, mengevaluasi, dan meningkatkan kualitas hidupnya secara berkelanjutan melalui pendekatan berbasis data dan refleksi diri.

### Proposisi Nilai Utama

| Fitur Unggulan | Deskripsi |
|---|---|
| **Smart Life Audit Engine** | Sistem yang mengubah input aktivitas user menjadi audit hidup terstruktur otomatis |
| **AI Behavioral Insight** | AI membaca pola hidup user, bukan sekadar data mentah |
| **Multi-Dimensional Life Score** | Penilaian dari berbagai dimensi: Productivity, Time Management, Consistency, Growth |
| **Pattern Detection System** | Mendeteksi pola berulang dalam kehidupan user |
| **Guided Reflection System** | Memandu refleksi: apa yang berhasil, gagal, dan mengapa |
| **Actionable Recommendation Engine** | Memberikan saran konkret dan langkah kecil yang dapat dilakukan |
| **Weekly Life Report** | Ringkasan mingguan berisi insight utama, skor, dan rekomendasi |
| **Private Reflection Mode** | Fitur opsional: jurnal syukur, niat mingguan, refleksi diri |
| **Financial Behavior Audit** | Analisis dan pencatatan pola perilaku keuangan pengguna |

---

## 2. Latar Belakang & Problem Statement

### Konteks

Banyak individu menjalani aktivitas sehari-hari tanpa evaluasi yang jelas, sehingga waktu terbuang tanpa disadari dan produktivitas menjadi tidak optimal. Tidak adanya sistem audit hidup yang terstruktur membuat proses refleksi diri cenderung subjektif dan tidak berbasis data, sehingga kebiasaan buruk terus berulang tanpa perbaikan yang signifikan.

### Permasalahan yang Dihadapi

1. **Ketidaksadaran penggunaan waktu** — Banyak individu tidak mengetahui ke mana waktu mereka digunakan setiap harinya.
2. **Produktivitas rendah tanpa evaluasi** — Tidak ada tolok ukur yang jelas untuk menilai efektivitas aktivitas sehari-hari.
3. **Tidak ada sistem audit hidup yang terstruktur** — Upaya self-improvement dilakukan secara ad-hoc tanpa kerangka yang konsisten.
4. **Refleksi diri yang subjektif** — Evaluasi diri masih bergantung pada perasaan, bukan data yang terukur.
5. **Kebiasaan buruk berulang tanpa disadari** — Tanpa deteksi pola, individu tidak menyadari kebiasaan negatif yang berulang.
6. **Kurangnya kesadaran pola keuangan** — Perilaku finansial tidak terintegrasi dengan evaluasi produktivitas dan gaya hidup.

> **Dampak:** Kurangnya kesadaran pola hidup menyebabkan rendahnya efektivitas dan perkembangan diri secara keseluruhan.

---

## 3. Tujuan Produk

### Tujuan Utama

- Membantu pengguna melakukan audit hidup secara rutin dan terstruktur
- Menyediakan data penggunaan waktu dan aktivitas yang akurat
- Memberikan analisis dan insight berbasis AI yang dapat ditindaklanjuti
- Mendorong refleksi diri yang objektif dan berbasis data
- Membantu perbaikan kebiasaan secara berkelanjutan (*continuous improvement*)

### Prinsip Desain Sistem

**Fleksibilitas Berbasis Data (Data-Driven Configuration):** Seluruh komponen audit seperti kategori aktivitas, indikator penilaian, dan parameter evaluasi tidak bersifat *hardcoded*. Administrator maupun pengguna dapat menyesuaikan struktur audit secara fleksibel, termasuk menambah, mengubah, atau mengimpor template audit baru melalui antarmuka sistem (format JSON atau Excel) tanpa memerlukan perubahan pada kode program.

**Hierarki Konfigurasi:**
```
Domain Kehidupan
  └── Kategori Aktivitas
        └── Indikator Penilaian
              └── Parameter Evaluasi
                    └── Bobot Penilaian
```

---

## 4. Target Pengguna

### Persona Utama

**Individu Produktif yang Ingin Berkembang**
- Usia: 18–45 tahun
- Karakteristik: Memiliki keinginan kuat untuk meningkatkan kualitas diri, produktivitas, dan pengelolaan waktu
- Pain point: Tidak tahu ke mana waktu dan uang mereka pergi; merasa tidak berkembang meskipun sibuk
- Kebutuhan: Sistem evaluasi diri yang objektif, terstruktur, dan mudah digunakan secara rutin

### Pengguna Sekunder

- Profesional yang ingin memantau work-life balance
- Mahasiswa yang ingin meningkatkan efektivitas belajar
- Individu yang sedang dalam proses pembentukan kebiasaan baik

---

## 5. Scope & Ruang Lingkup

### Dalam Scope (In-Scope)

- Registrasi, autentikasi, dan manajemen akun pengguna
- Pencatatan aktivitas mingguan (Weekly Audit)
- Dashboard visualisasi data aktivitas dan skor
- Sistem scoring multidimensi otomatis
- Analisis pola berbasis AI (rule-based)
- Modul refleksi diri terstruktur
- Modul refleksi spiritual (privat, opsional)
- Pencatatan dan analisis keuangan harian
- Riwayat audit dan perbandingan antar periode
- Role-based access control (User, Admin, Super Admin)
- Konfigurasi dinamis kategori dan indikator audit

### Di Luar Scope (Out-of-Scope) untuk v1.0

- Aplikasi mobile native (iOS/Android)
- Integrasi machine learning tingkat lanjut
- Integrasi dengan kalender digital eksternal
- Fitur sosial/komunitas antar pengguna
- Sinkronisasi otomatis dengan aplikasi pihak ketiga

---

## 6. Fitur & Kebutuhan Fungsional

### 6.1 Weekly Audit Module

**Deskripsi:** Komponen utama sistem sebagai sarana pengumpulan data aktivitas pengguna secara berkala. Menjadi fondasi utama karena seluruh proses analisis dan evaluasi bergantung pada data yang diinput pengguna.

**User Stories:**
- Sebagai pengguna, saya ingin mencatat aktivitas harian/mingguan saya berdasarkan kategori agar saya dapat mengetahui distribusi penggunaan waktu saya.
- Sebagai pengguna, saya ingin mengklasifikasikan aktivitas sebagai produktif atau non-produktif agar saya dapat menilai efektivitas saya.
- Sebagai pengguna, saya ingin menggunakan template audit mingguan yang sama berulang kali agar proses pencatatan menjadi lebih efisien.

**Kebutuhan Fungsional:**

| ID | Kebutuhan | Prioritas |
|---|---|---|
| F1.1 | Input alokasi waktu berdasarkan kategori (belajar, hiburan, pekerjaan, dll.) | Must Have |
| F1.2 | Pencatatan deskripsi aktivitas harian/mingguan | Must Have |
| F1.3 | Input pencapaian (achievement) dalam periode audit | Must Have |
| F1.4 | Klasifikasi aktivitas: produktif / non-produktif | Must Have |
| F1.5 | Template audit mingguan yang dapat digunakan berulang | Should Have |
| F1.6 | Validasi data input sebelum submit | Must Have |

**Output yang Dihasilkan:**
- Data aktivitas terstruktur tersimpan di database
- Ringkasan penggunaan waktu mingguan

---

### 6.2 Analytics Dashboard Module

**Deskripsi:** Menyajikan hasil audit dalam bentuk visualisasi data yang informatif dan mudah dipahami, membantu pengguna melihat pola hidupnya secara cepat dan intuitif.

**User Stories:**
- Sebagai pengguna, saya ingin melihat grafik distribusi waktu saya dalam seminggu agar saya dapat memahami pola aktivitas secara visual.
- Sebagai pengguna, saya ingin melihat tren produktivitas saya dari minggu ke minggu agar saya dapat memantau perkembangan diri saya.

**Kebutuhan Fungsional:**

| ID | Kebutuhan | Prioritas |
|---|---|---|
| F2.1 | Grafik distribusi waktu (pie chart / bar chart) berdasarkan kategori aktivitas | Must Have |
| F2.2 | Tren aktivitas mingguan (line chart / bar chart) | Must Have |
| F2.3 | Perbandingan tingkat produktivitas antar periode | Should Have |
| F2.4 | Highlight aktivitas dominan dalam periode audit | Should Have |
| F2.5 | Ringkasan skor performa mingguan dalam format card | Must Have |
| F2.6 | Filter dan navigasi antar periode audit | Should Have |

**Output yang Dihasilkan:**
- Visualisasi interaktif data aktivitas
- Ringkasan performa mingguan

---

### 6.3 AI Insight Module

**Deskripsi:** Komponen analitik yang memanfaatkan teknologi AI untuk mengolah data menjadi insight yang bermakna. Merupakan salah satu keunggulan utama AuditLife.

**User Stories:**
- Sebagai pengguna, saya ingin mendapatkan insight otomatis tentang pola kebiasaan saya agar saya dapat mengetahui area yang perlu diperbaiki tanpa harus menganalisis data sendiri.
- Sebagai pengguna, saya ingin mendapatkan rekomendasi konkret agar saya tahu langkah nyata yang dapat saya ambil untuk memperbaiki kebiasaan saya.

**Kebutuhan Fungsional:**

| ID | Kebutuhan | Prioritas |
|---|---|---|
| F3.1 | Analisis pola kebiasaan (habit pattern detection) berdasarkan data historis | Must Have |
| F3.2 | Deteksi dan notifikasi aktivitas tidak produktif yang berulang | Must Have |
| F3.3 | Generasi insight otomatis berbasis rule-based system | Must Have |
| F3.4 | Rekomendasi tindakan perbaikan yang spesifik dan dapat ditindaklanjuti | Must Have |
| F3.5 | Analisis pola keuangan dan korelasi dengan produktivitas | Should Have |
| F3.6 | Insight lintas data (cross-dimensional insight) | Should Have |

**Contoh Output Insight:**
- *"Sebagian besar waktumu digunakan untuk aktivitas non-prioritas."*
- *"Produktivitas menurun di akhir minggu."*
- *"Pengeluaran tinggi saat produktivitas rendah."*

---

### 6.4 Reflection Module

**Deskripsi:** Membantu pengguna melakukan refleksi diri secara terstruktur berdasarkan hasil analisis sistem, menghubungkan data dengan kesadaran pengguna.

**User Stories:**
- Sebagai pengguna, saya ingin menjawab pertanyaan refleksi yang terarah agar proses evaluasi diri saya lebih terstruktur dan objektif.
- Sebagai pengguna, saya ingin menetapkan target perbaikan untuk minggu berikutnya agar saya memiliki rencana tindak lanjut yang jelas.

**Kebutuhan Fungsional:**

| ID | Kebutuhan | Prioritas |
|---|---|---|
| F4.1 | Form refleksi mingguan: hal yang berjalan baik | Must Have |
| F4.2 | Form refleksi mingguan: hal yang perlu diperbaiki | Must Have |
| F4.3 | Input target/rencana perbaikan untuk minggu berikutnya | Must Have |
| F4.4 | Guided reflection melalui pertanyaan terarah yang disediakan sistem | Should Have |
| F4.5 | Penyimpanan catatan refleksi pribadi yang aman | Must Have |

**Output yang Dihasilkan:**
- Catatan refleksi pribadi tersimpan
- Rencana perbaikan ke depan

---

### 6.5 Scoring System Module

**Deskripsi:** Mengukur performa pengguna melalui sistem penilaian berbasis indikator secara multidimensi untuk menghindari penyederhanaan berlebihan.

**User Stories:**
- Sebagai pengguna, saya ingin melihat skor saya di berbagai dimensi kehidupan agar saya dapat memahami kekuatan dan kelemahan saya secara objektif.
- Sebagai pengguna, saya ingin membandingkan skor saya antar periode agar saya dapat memantau progres perkembangan diri saya.

**Kebutuhan Fungsional:**

| ID | Kebutuhan | Prioritas |
|---|---|---|
| F5.1 | Kalkulasi Productivity Score berdasarkan rasio aktivitas produktif | Must Have |
| F5.2 | Kalkulasi Time Management Score berdasarkan alokasi dan efisiensi waktu | Must Have |
| F5.3 | Kalkulasi Consistency Score berdasarkan keajegan aktivitas positif | Must Have |
| F5.4 | Kalkulasi Self-Improvement Score berdasarkan tren perkembangan | Must Have |
| F5.5 | Kalkulasi Financial Discipline Score berdasarkan pola pengeluaran | Should Have |
| F5.6 | Kalkulasi Spending Awareness Score | Should Have |
| F5.7 | Sistem pembobotan penilaian yang dapat dikonfigurasi | Should Have |
| F5.8 | Perbandingan skor antar periode (weekly/monthly) | Must Have |

**Output yang Dihasilkan:**
- Skor per kategori dimensi kehidupan
- Ringkasan evaluasi performa pengguna

---

### 6.6 Spiritual Reflection Module

**Deskripsi:** Fitur tambahan yang berfokus pada aspek refleksi nilai dan kesadaran diri yang bersifat personal dan privat. Tidak menggunakan sistem skor dan tidak bersifat kompetitif.

**User Stories:**
- Sebagai pengguna, saya ingin mencatat rasa syukur dan niat mingguan saya di ruang yang privat agar saya dapat menjaga keseimbangan batin di luar aspek produktivitas.

**Kebutuhan Fungsional:**

| ID | Kebutuhan | Prioritas |
|---|---|---|
| F6.1 | Fitur jurnal syukur (gratitude journal) yang bersifat privat | Should Have |
| F6.2 | Penetapan niat mingguan (weekly intention) | Should Have |
| F6.3 | Catatan refleksi personal bebas | Should Have |
| F6.4 | Data modul ini tidak masuk dalam kalkulasi skor apapun | Must Have |
| F6.5 | Akses data hanya oleh pengguna yang bersangkutan (full privacy) | Must Have |

**Output yang Dihasilkan:**
- Catatan refleksi personal
- Peningkatan kesadaran diri (non-kuantitatif)

---

### 6.7 Financial Audit Module

**Deskripsi:** Mencatat dan menganalisis perilaku keuangan pengguna sebagai bagian integral dari self-audit kehidupan, diintegrasikan dengan data aktivitas untuk insight yang lebih komprehensif.

**User Stories:**
- Sebagai pengguna, saya ingin mencatat pengeluaran harian dengan kategori yang jelas agar saya dapat memahami pola keuangan saya.
- Sebagai pengguna, saya ingin melihat korelasi antara aktivitas saya dan pengeluaran saya agar saya dapat membuat keputusan finansial yang lebih bijak.

**Kebutuhan Fungsional:**

| ID | Kebutuhan | Prioritas |
|---|---|---|
| F7.1 | Input pengeluaran harian dengan nominal dan deskripsi | Must Have |
| F7.2 | Kategori keuangan yang dapat dikustomisasi | Must Have |
| F7.3 | Klasifikasi pengeluaran: kebutuhan / keinginan / investasi | Must Have |
| F7.4 | Tracking pola pengeluaran mingguan/bulanan | Must Have |
| F7.5 | Analisis korelasi antara produktivitas dan pengeluaran | Should Have |
| F7.6 | Ringkasan dan laporan pengeluaran periodik | Must Have |
| F7.7 | Insight perilaku keuangan otomatis | Should Have |

**Output yang Dihasilkan:**
- Ringkasan pengeluaran periodik
- Insight perilaku keuangan
- Financial Discipline Score & Spending Awareness Score

---

## 7. Kebutuhan Non-Fungsional

### 7.1 Performa

| Kebutuhan | Target |
|---|---|
| Waktu muat halaman pertama (First Contentful Paint) | < 2 detik |
| Waktu respons API | < 500ms untuk operasi standar |
| Ketersediaan sistem (Uptime) | ≥ 99.5% |
| Kapasitas penyimpanan file per pengguna | Maks. 50MB/file |

### 7.2 Keamanan

- Autentikasi menggunakan **Supabase Auth + JWT**
- Dukungan **SSO OAuth** (Google / Microsoft)
- **Row Level Security (RLS)** pada seluruh tabel database — setiap pengguna hanya dapat mengakses datanya sendiri
- Enkripsi data sensitif saat transit (HTTPS) dan saat tersimpan
- Pengelolaan akses berbasis peran (**RBAC**) yang ketat
- Data Spiritual Reflection Module bersifat sepenuhnya privat

### 7.3 Skalabilitas

- Sistem dapat menangani pertumbuhan pengguna tanpa perubahan arsitektur signifikan
- Deployment pada **Vercel Edge Network** untuk distribusi global
- CI/CD otomatis dari repositori GitHub

### 7.4 Ketersediaan & Pemeliharaan

- Deployment berkelanjutan (Continuous Deployment) via GitHub → Vercel
- Migrasi database terstruktur menggunakan Supabase
- Sistem *data-driven configuration*: perubahan kategori, indikator, dan parameter audit tidak memerlukan perubahan kode

### 7.5 Privasi Data

- Data pengguna tidak dapat diakses oleh pengguna lain
- Admin tidak dapat memanipulasi hasil audit individu pengguna
- Modul spiritual bersifat privat penuh dan tidak masuk dalam sistem pelaporan apapun

---

## 8. Arsitektur Sistem

### Diagram Lapisan Arsitektur

```
┌─────────────────────────────────────────────┐
│              USER (PENGGUNA)                │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         PRESENTATION LAYER (FRONTEND)       │
│   Next.js 14 · React · Tailwind CSS         │
│   shadcn/ui · App Router · Server Components│
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│      APPLICATION LAYER (BACKEND / API)      │
│   Next.js API Routes · Edge Functions       │
│   REST API · Middleware Auth · Scoring Engine│
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│    BUSINESS + AI LAYER (PROCESSING LOGIC)   │
│   Node.js · Rule-Based Insight System       │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│           DATA LAYER (DATABASE & STORAGE)   │
│   Supabase PostgreSQL · Supabase Storage    │
│   Row Level Security · Migrasi Terstruktur  │
└─────────────────────────────────────────────┘
```

### Stack Teknologi

| Layer | Teknologi | Keterangan |
|---|---|---|
| **Frontend** | Next.js 14, React, Tailwind CSS, shadcn/ui | App Router, Server Components, komponen UI siap pakai |
| **Backend/API** | Next.js API Routes, Edge Functions | REST API, middleware auth, file processing, scoring engine |
| **Business Logic & AI** | Node.js, Rule-based System | Logika bisnis, kalkulasi skor, insight engine |
| **Database** | PostgreSQL via Supabase | Relasional, Row Level Security (RLS), migrasi terstruktur |
| **Storage** | Supabase Storage | Bucket per instrumen, maks 50MB/file, akses RLS |
| **Auth** | Supabase Auth + JWT | SSO OAuth (Google/Microsoft), role-based, session management |
| **Analytics/Chart** | Recharts, React Query | Radar chart, bar chart, trend timeline |
| **Deployment** | Vercel | Edge network global, CI/CD dari GitHub |

---

## 9. Skema Database

### Entity Relationship Overview

```
Users ──────────── Weekly_Audit ──────── Activities
  │                     │                    │
  │                     │                    └── Categories
  │                     ├──────────── Scores
  │                     └──────────── Reflections
  │
  └──────────────── Financial_Records
```

### Tabel 1: Users

Menyimpan data pengguna sistem.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `user_id` | UUID (PK) | Identifikasi unik pengguna |
| `name` | VARCHAR | Nama lengkap pengguna |
| `email` | VARCHAR (UNIQUE) | Email pengguna, digunakan untuk login |
| `password` | VARCHAR | Password terenkripsi |
| `role` | ENUM | `user` / `admin` / `super_admin` |
| `created_at` | TIMESTAMP | Waktu registrasi akun |

### Tabel 2: Weekly_Audit

Menyimpan data audit mingguan setiap pengguna.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `audit_id` | UUID (PK) | Identifikasi unik audit |
| `user_id` | UUID (FK → Users) | Pengguna pemilik audit |
| `week_start_date` | DATE | Tanggal mulai periode audit |
| `week_end_date` | DATE | Tanggal akhir periode audit |
| `total_time` | INTEGER | Total jam yang dicatat (dalam menit) |
| `summary` | TEXT | Ringkasan singkat audit |
| `created_at` | TIMESTAMP | Waktu pembuatan audit |

### Tabel 3: Activities

Menyimpan detail aktivitas dalam satu periode audit.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `activity_id` | UUID (PK) | Identifikasi unik aktivitas |
| `audit_id` | UUID (FK → Weekly_Audit) | Audit yang memuat aktivitas ini |
| `category` | VARCHAR (FK → Categories) | Kategori aktivitas |
| `duration` | INTEGER | Durasi dalam menit |
| `productivity_type` | ENUM | `produktif` / `non-produktif` |
| `description` | TEXT | Deskripsi aktivitas |

### Tabel 4: Scores

Menyimpan hasil evaluasi skor dari audit.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `score_id` | UUID (PK) | Identifikasi unik skor |
| `audit_id` | UUID (FK → Weekly_Audit) | Audit yang dievaluasi |
| `productivity_score` | DECIMAL | Skor produktivitas (0–100) |
| `time_management_score` | DECIMAL | Skor manajemen waktu (0–100) |
| `consistency_score` | DECIMAL | Skor konsistensi (0–100) |
| `self_improvement_score` | DECIMAL | Skor pengembangan diri (0–100) |
| `financial_discipline_score` | DECIMAL | Skor disiplin keuangan (0–100) |
| `spending_awareness_score` | DECIMAL | Skor kesadaran pengeluaran (0–100) |
| `total_score` | DECIMAL | Total skor agregat |

### Tabel 5: Reflections

Menyimpan hasil refleksi pengguna.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `reflection_id` | UUID (PK) | Identifikasi unik refleksi |
| `audit_id` | UUID (FK → Weekly_Audit) | Audit yang direfleksikan |
| `positive_notes` | TEXT | Hal yang berjalan baik |
| `improvement_notes` | TEXT | Hal yang perlu diperbaiki |
| `next_plan` | TEXT | Rencana perbaikan minggu berikutnya |

### Tabel 6: Categories

Untuk standarisasi jenis aktivitas.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `category_id` | UUID (PK) | Identifikasi unik kategori |
| `category_name` | VARCHAR | Nama kategori (misal: Belajar, Hiburan, Olahraga) |
| `type` | ENUM | `produktif` / `non-produktif` |

### Tabel 7: Financial_Records

Menyimpan data keuangan harian pengguna.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `record_id` | UUID (PK) | Identifikasi unik catatan keuangan |
| `user_id` | UUID (FK → Users) | Pengguna pemilik catatan |
| `date` | DATE | Tanggal transaksi |
| `category` | VARCHAR | Kategori pengeluaran |
| `amount` | DECIMAL | Nominal pengeluaran |
| `type` | ENUM | `need` / `want` / `investment` |
| `description` | TEXT | Keterangan pengeluaran |

### Relasi Antar Tabel

```
Users        (1) → (N) Weekly_Audit
Users        (1) → (N) Financial_Records
Weekly_Audit (1) → (N) Activities
Weekly_Audit (1) → (1) Scores
Weekly_Audit (1) → (1) Reflections
Categories   (1) → (N) Activities
```

---

## 10. Manajemen Pengguna & Role-Based Access Control

### Definisi Peran (Roles)

| Peran | Hak Akses | Keterbatasan |
|---|---|---|
| **User** | Registrasi dan login · Mengisi weekly audit · Melihat dashboard dan skor · Mengakses insight dan rekomendasi · Mengisi refleksi diri · Mencatat keuangan harian | Tidak dapat mengakses data pengguna lain · Tidak dapat mengubah sistem atau indikator penilaian |
| **Admin** | Mengelola data pengguna · Mengatur kategori aktivitas · Mengelola domain dan indikator audit · Mengelola konfigurasi sistem | Tidak terlibat dalam proses audit personal pengguna · Tidak dapat memanipulasi hasil audit individu |
| **Super Admin** | Mengelola Admin · Mengatur konfigurasi sistem secara global · Mengelola integrasi teknologi | Akses terbatas pada pengaturan sistem, bukan penggunaan harian |

### Alur Autentikasi

```
User Input Kredensial
       ↓
Supabase Auth Validasi
       ↓
JWT Token Diterbitkan
       ↓
Role Check (RBAC)
       ↓
Akses Fitur Sesuai Role
```

---

## 11. Alur Kerja Pengguna (User Flow)

### Siklus Utama AuditLife

```
[Registrasi / Login]
        ↓
[Dashboard Utama]
   (jika belum ada data → arahkan ke Weekly Audit pertama)
        ↓
[Pengisian Weekly Audit]
   • Input kategori aktivitas
   • Input durasi waktu
   • Input deskripsi
   • Input keuangan harian
   • Submit
        ↓
[Pemrosesan Data oleh Sistem]
   • Klasifikasi aktivitas
   • Kalkulasi skor multidimensi
   • Analisis pola aktivitas
   • Analisis pola pengeluaran
        ↓
[Dashboard & Insight]
   • Tampilkan skor evaluasi
   • Tampilkan grafik aktivitas
   • Tampilkan insight utama
        ↓
[Refleksi Pengguna]
   • Isi hal yang berjalan baik
   • Isi hal yang perlu diperbaiki
   • Tetapkan rencana perbaikan
        ↓
[Simpan & Riwayat]
   • Data tersimpan
   • Dapat dilihat kembali di Riwayat Audit
        ↓
[Siklus Berulang Minggu Berikutnya]
   • Bandingkan performa antar periode
   • Lakukan perbaikan berdasarkan insight
```

---

## 12. Antarmuka Pengguna (UI Requirements)

### Halaman 1: Login / Register

**Tujuan:** Pintu masuk utama untuk mengakses sistem.

**Elemen UI:**
- Logo aplikasi (AuditLife)
- Input field: Email
- Input field: Password
- Tombol aksi: "Login"
- Link navigasi: "Register" (untuk pengguna baru)
- Notifikasi error (jika login gagal)

**Alur:** User memasukkan kredensial → sistem validasi → redirect ke Dashboard

---

### Halaman 2: Dashboard Utama

**Tujuan:** Menampilkan ringkasan hasil audit pengguna secara cepat dan intuitif.

**Elemen UI:**
- Header: nama user + navigasi global
- Card skor ringkasan: Productivity Score · Time Management Score · Consistency Score
- Grafik distribusi waktu (pie chart)
- Tren aktivitas mingguan (line/bar chart)
- Highlight insight singkat

**Alur:** User melihat performa → klik detail untuk analisis lebih lanjut

---

### Halaman 3: Weekly Audit (Input Data)

**Tujuan:** Input data aktivitas dan keuangan mingguan.

**Elemen UI:**
- Form input aktivitas:
  - Dropdown kategori aktivitas
  - Input durasi waktu
  - Textarea deskripsi aktivitas
- Tombol: "Tambah Aktivitas"
- List aktivitas yang sudah diinput (dengan opsi hapus/edit)
- Form input keuangan harian
- Tombol: "Submit Audit"

**Alur:** User input aktivitas → simpan → submit → data diproses sistem

---

### Halaman 4: Insight & Analisis

**Tujuan:** Menampilkan hasil analisis pola dan rekomendasi dari sistem.

**Elemen UI:**
- Ringkasan insight utama (headline)
- List insight (bullet/card):
  - Pola aktivitas yang terdeteksi
  - Aktivitas tidak produktif
- Rekomendasi perbaikan konkret
- Highlight area yang perlu ditingkatkan

**Alur:** User membaca insight → memahami pola → lanjut ke Refleksi

---

### Halaman 5: Refleksi

**Tujuan:** Evaluasi diri secara manual yang terarah.

**Elemen UI:**
- Pertanyaan refleksi terarah:
  - *"Apa yang berjalan baik minggu ini?"*
  - *"Apa yang perlu diperbaiki?"*
- Textarea input jawaban refleksi
- Input rencana perbaikan (next plan)
- Tombol: "Simpan Refleksi"

**Alur:** User isi refleksi → simpan → tersimpan dalam sistem

---

### Halaman 6: Riwayat Audit

**Tujuan:** Melihat dan membandingkan hasil audit dari periode sebelumnya.

**Elemen UI:**
- List audit per minggu (dengan tanggal)
- Ringkasan skor tiap audit
- Tombol: "Lihat Detail" per audit

**Alur:** User pilih audit → lihat detail → bandingkan performa antar periode

---

### Navigasi Global (Sidebar / Bottom Nav)

Tersedia di seluruh halaman aplikasi:
- Dashboard
- Weekly Audit
- Insight
- Refleksi
- Riwayat
- Logout

---

## 13. Roadmap Pengembangan

| Fase | Durasi | Fitur yang Dikembangkan | Status |
|---|---|---|---|
| **Fase 1: MVP** | 1–2 bulan | Setup proyek Next.js 14 + Supabase · Autentikasi & RBAC · Skema database inti · CRUD instrumen dasar · Import instrumen via JSON/Excel | Perencanaan |
| **Fase 2: Analisis & Scoring** | 2–3 bulan | Implementasi sistem scoring · Pengembangan indikator dan domain penilaian · Visualisasi data (grafik & statistik) · Penyempurnaan dashboard | Perencanaan |
| **Fase 3: Integrasi Insight & AI** | 1–2 bulan | Implementasi AI Insight (rule-based) · Deteksi pola aktivitas pengguna · Rekomendasi perbaikan · Pengembangan halaman insight | Perencanaan |
| **Fase 4: Fitur Lanjutan** | 1 bulan | Fitur refleksi pengguna · Riwayat audit dan perbandingan data · Notifikasi / reminder audit · Kustomisasi kategori aktivitas | Perencanaan |
| **Fase 5: Optimasi & Scale** | Berkelanjutan | Pengembangan mobile application · Integrasi machine learning lanjutan · Peningkatan performa dan keamanan · Skalabilitas sistem | Roadmap Jangka Panjang |

---

## 14. Asumsi & Keterbatasan

### Asumsi

- Pengguna memiliki akses internet yang stabil untuk mengakses aplikasi berbasis web
- Pengguna bersedia mencatat aktivitas secara mandiri (tidak ada tracking otomatis)
- Data yang diinput pengguna bersifat jujur dan akurat
- Sistem AI pada v1.0 menggunakan pendekatan rule-based, bukan machine learning
- Konfigurasi awal kategori dan indikator disediakan oleh admin sistem

### Keterbatasan v1.0

- Tidak ada pelacakan aktivitas otomatis (misal: dari kalender atau wearable)
- AI Insight berbasis rule-based, belum menggunakan machine learning adaptif
- Tidak tersedia aplikasi mobile native pada versi pertama
- Tidak ada fitur sosial atau perbandingan dengan pengguna lain

---

## 15. Risiko & Mitigasi

| Risiko | Dampak | Probabilitas | Mitigasi |
|---|---|---|---|
| Pengguna malas mengisi audit secara rutin | Tinggi | Tinggi | Sistem notifikasi/reminder · Desain UX yang frictionless · Template yang mudah digunakan |
| Data pengguna bocor atau diakses pihak tidak berwenang | Sangat Tinggi | Rendah | RLS Supabase · Enkripsi JWT · Audit keamanan berkala |
| Insight AI tidak akurat atau tidak relevan | Sedang | Sedang | Validasi rule-based dengan feedback pengguna · Iterasi cepat pada fase pengembangan |
| Pengguna salah mengklasifikasikan aktivitas | Sedang | Sedang | Panduan dan contoh klasifikasi · Kategori default yang informatif |
| Ketergantungan pada layanan pihak ketiga (Supabase/Vercel) | Tinggi | Rendah | Monitoring SLA · Strategi backup dan failover |

---

## 16. Kriteria Keberhasilan (Success Metrics)

### Metrik Produk

| Metrik | Target (3 bulan pasca-launch) |
|---|---|
| Jumlah pengguna terdaftar | ≥ 500 pengguna |
| Retention rate mingguan | ≥ 40% (pengguna aktif mengisi audit 3+ minggu berturut-turut) |
| Completion rate weekly audit | ≥ 60% dari pengguna aktif per minggu |
| User satisfaction score (CSAT) | ≥ 4.0 / 5.0 |
| Bounce rate halaman utama | < 40% |

### Metrik Teknis

| Metrik | Target |
|---|---|
| Uptime sistem | ≥ 99.5% |
| Waktu muat halaman | < 2 detik |
| Error rate API | < 1% |
| Waktu respons API | < 500ms |

---

## 17. Langkah Selanjutnya

### Immediate Next Steps (Fase 1)

1. **Validasi dan Uji Coba Sistem**
   - Uji coba kepada pengguna terbatas (beta users)
   - Pengumpulan feedback terkait usability dan fitur
   - Evaluasi efektivitas sistem audit

2. **Penyempurnaan Model Scoring**
   - Penyesuaian indikator dan bobot penilaian berdasarkan feedback
   - Peningkatan akurasi evaluasi
   - Pengurangan bias dalam penilaian

### Future Development

3. **Pengembangan AI yang Lebih Lanjut**
   - Transisi dari rule-based ke machine learning
   - Personalisasi insight berdasarkan pola perilaku individu
   - Peningkatan kualitas dan relevansi rekomendasi

4. **Pengembangan Aplikasi Mobile**
   - Meningkatkan aksesibilitas pengguna
   - Mempermudah input data secara real-time
   - Integrasi notifikasi dan reminder

5. **Integrasi dengan Sistem Eksternal (Opsional)**
   - Integrasi dengan kalender digital (Google Calendar, Outlook)
   - Sinkronisasi aktivitas otomatis
   - Pengayaan data untuk analisis lebih akurat

6. **Peningkatan Keamanan dan Privasi**
   - Penguatan sistem autentikasi (MFA)
   - Perlindungan data pengguna yang lebih ketat
   - Pengelolaan akses berbasis peran yang lebih granular

---

## Penutup

> AuditLife tidak hanya dirancang sebagai alat pencatatan aktivitas, tetapi sebagai sistem yang membantu pengguna memahami, mengevaluasi, dan meningkatkan kualitas hidupnya secara berkelanjutan melalui pendekatan berbasis data dan refleksi diri.

Dokumen PRD ini merupakan panduan hidup produk yang akan terus diperbarui seiring perkembangan sistem dan feedback dari pengguna. Semua perubahan signifikan terhadap scope, fitur, atau arsitektur harus didokumentasikan sebagai revisi PRD.

---

*Dokumen ini bersifat rahasia dan terbatas. Dilarang mendistribusikan tanpa izin.*  
*AuditLife v1.0 · 2026*
