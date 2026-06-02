# AI_SPEC.md — AuditLife

> Spesifikasi teknis AI Insight Engine, prompt registry, integrasi OCR, dan kontrak integrasi.  
> Dibaca oleh: **Developer + AI Engineer**

---

## Daftar Isi

1. [Gambaran AI System](#1-gambaran-ai-system)
2. [Rule-Based Insight Engine](#2-rule-based-insight-engine)
3. [Prompt Registry](#3-prompt-registry)
4. [Scoring Engine Specification](#4-scoring-engine-specification)
5. [Pattern Detection System](#5-pattern-detection-system)
6. [Integration Contracts](#6-integration-contracts)
7. [Roadmap AI (Fase Lanjutan)](#7-roadmap-ai-fase-lanjutan)

---

## 1. Gambaran AI System

Pada **v1.0**, AuditLife menggunakan pendekatan **rule-based AI** — bukan machine learning — untuk menghasilkan insight dan rekomendasi. Pendekatan ini dipilih karena:

- Deterministik dan mudah diaudit (tidak ada black-box)
- Tidak memerlukan data training besar di awal
- Mudah dikembangkan oleh developer tanpa background ML
- Hasil dapat diprediksi dan dijelaskan kepada pengguna

### Arsitektur AI v1.0

```
Input: Aktivitas + Skor + Data Keuangan
        ↓
Rule Engine: evaluasi kondisi terhadap rule set
        ↓
Triggered Rules: kumpulkan rules yang terpenuhi
        ↓
Priority Sort: urutkan berdasarkan severity/relevansi
        ↓
Insight Generator: format pesan insight
        ↓
Recommendation Mapper: petakan ke rekomendasi konkret
        ↓
Output: insights[], recommendations[]
```

---

## 2. Rule-Based Insight Engine

### 2.1 Struktur Rule

Setiap rule didefinisikan dalam format berikut:

```typescript
interface InsightRule {
  id: string;                    // Unique rule ID
  name: string;                  // Nama rule (internal)
  category: InsightCategory;     // 'productivity' | 'time' | 'financial' | 'consistency' | 'cross'
  severity: 'info' | 'warning' | 'critical';
  condition: (data: AuditData) => boolean;  // Fungsi evaluasi kondisi
  insight: string | ((data: AuditData) => string);  // Pesan insight
  recommendation: string[];      // Daftar rekomendasi konkret
  cooldown_days?: number;        // Jeda sebelum rule ini ditampilkan lagi
}
```

### 2.2 Rule Registry — Produktivitas

```typescript
const productivityRules: InsightRule[] = [
  {
    id: "PROD_001",
    name: "Low Productive Time",
    category: "productivity",
    severity: "warning",
    condition: (data) => data.scores.productivity_score < 40,
    insight: (data) =>
      `Hanya ${data.productivePercent}% waktumu minggu ini digunakan untuk aktivitas produktif.`,
    recommendation: [
      "Coba blokir 2 jam di pagi hari khusus untuk aktivitas prioritas.",
      "Identifikasi 1 aktivitas non-produktif yang paling membuang waktu dan kurangi.",
      "Gunakan teknik time-blocking untuk menjaga fokus.",
    ],
  },
  {
    id: "PROD_002",
    name: "No Priority Activity",
    category: "productivity",
    severity: "critical",
    condition: (data) =>
      data.activities.filter((a) => a.productivity_type === "produktif").length === 0,
    insight: "Tidak ada aktivitas produktif yang tercatat minggu ini.",
    recommendation: [
      "Mulai dengan satu aktivitas produktif kecil (15–30 menit) setiap hari.",
      "Tentukan satu tujuan utama untuk minggu depan.",
    ],
  },
  {
    id: "PROD_003",
    name: "High Productivity Week",
    category: "productivity",
    severity: "info",
    condition: (data) => data.scores.productivity_score >= 80,
    insight: "Minggu yang sangat produktif! Produktivitasmu berada di atas rata-rata.",
    recommendation: [
      "Pertahankan pola ini di minggu berikutnya.",
      "Catat kebiasaan apa yang membuat minggu ini berhasil.",
    ],
  },
];
```

### 2.3 Rule Registry — Manajemen Waktu

```typescript
const timeRules: InsightRule[] = [
  {
    id: "TIME_001",
    name: "Weekend Productivity Dip",
    category: "time",
    severity: "warning",
    condition: (data) => data.weekendProductivityDrop > 30,
    insight: (data) =>
      `Produktivitasmu turun ${data.weekendProductivityDrop}% di akhir pekan dibanding hari kerja.`,
    recommendation: [
      "Sisihkan 1–2 jam di akhir pekan untuk aktivitas ringan tapi produktif.",
      "Akhir pekan bisa digunakan untuk refleksi dan perencanaan minggu depan.",
    ],
    cooldown_days: 14,
  },
  {
    id: "TIME_002",
    name: "Entertainment Dominance",
    category: "time",
    severity: "warning",
    condition: (data) => {
      const entertainmentPercent = data.getCategoryPercent("hiburan");
      return entertainmentPercent > 40;
    },
    insight: (data) =>
      `${data.getCategoryPercent("hiburan")}% waktumu digunakan untuk hiburan minggu ini.`,
    recommendation: [
      "Tetapkan batas waktu hiburan harian (misal: maks 2 jam).",
      "Coba ganti 30 menit hiburan pasif dengan aktivitas yang lebih bermakna.",
    ],
  },
  {
    id: "TIME_003",
    name: "No Rest Activity",
    category: "time",
    severity: "info",
    condition: (data) => data.getCategoryPercent("istirahat") < 5,
    insight: "Kamu hampir tidak mencatat waktu istirahat minggu ini.",
    recommendation: [
      "Istirahat yang cukup penting untuk produktivitas jangka panjang.",
      "Jadwalkan minimal 7–8 jam tidur per malam.",
    ],
  },
];
```

### 2.4 Rule Registry — Keuangan

```typescript
const financialRules: InsightRule[] = [
  {
    id: "FIN_001",
    name: "Want Spending Dominance",
    category: "financial",
    severity: "warning",
    condition: (data) => data.financial.wantPercent > 50,
    insight: (data) =>
      `${data.financial.wantPercent}% pengeluaranmu minggu ini adalah keinginan (want), bukan kebutuhan.`,
    recommendation: [
      "Terapkan aturan 50/30/20: 50% kebutuhan, 30% keinginan, 20% investasi.",
      "Sebelum membeli, tanya: apakah ini benar-benar perlu hari ini?",
    ],
  },
  {
    id: "FIN_002",
    name: "Zero Investment",
    category: "financial",
    severity: "warning",
    condition: (data) => data.financial.investmentTotal === 0,
    insight: "Tidak ada pengeluaran untuk investasi minggu ini.",
    recommendation: [
      "Mulai dari yang kecil: sisihkan minimal 5–10% penghasilan untuk investasi.",
      "Investasi tidak harus berupa uang — beli buku, ikuti kursus.",
    ],
    cooldown_days: 7,
  },
];
```

### 2.5 Cross-Dimensional Rules

```typescript
const crossRules: InsightRule[] = [
  {
    id: "CROSS_001",
    name: "High Spending + Low Productivity",
    category: "cross",
    severity: "warning",
    condition: (data) =>
      data.scores.productivity_score < 50 && data.financial.wantPercent > 40,
    insight:
      "Pola menarik: minggu dengan produktivitas rendah cenderung diikuti pengeluaran lebih tinggi.",
    recommendation: [
      "Coba jadwalkan aktivitas produktif di awal hari untuk menjaga mood dan keputusan finansial.",
      "Hindari belanja impulsif saat merasa tidak produktif.",
    ],
    cooldown_days: 14,
  },
];
```

---

## 3. Prompt Registry

Prompt registry digunakan untuk fase Fase 3+ ketika sistem diintegrasikan dengan LLM eksternal untuk insight yang lebih personal dan nuanced.

### 3.1 System Prompt — Insight Generator

```
SYSTEM:
Kamu adalah AuditLife Insight AI — asisten analisis kehidupan yang membantu pengguna memahami pola aktivitas dan kebiasaan mereka.

Tugasmu:
1. Analisis data aktivitas mingguan pengguna
2. Identifikasi pola positif dan negatif
3. Berikan insight yang jujur, empatik, dan dapat ditindaklanjuti
4. Berikan rekomendasi konkret (bukan generik)

Aturan:
- Gunakan bahasa Indonesia yang natural dan hangat
- Jangan menghakimi; fokus pada pola, bukan karakter pengguna
- Setiap insight harus disertai minimal 1 rekomendasi konkret
- Hindari jargon teknis
- Respons maksimal 3 insight utama per audit
- Format respons: JSON (lihat schema di bawah)
```

### 3.2 User Prompt Template — Weekly Analysis

```
USER:
Berikut data audit mingguan pengguna untuk periode {week_start} hingga {week_end}:

DATA AKTIVITAS:
{activities_json}

SKOR MINGGU INI:
- Productivity Score: {productivity_score}/100
- Time Management Score: {time_management_score}/100
- Consistency Score: {consistency_score}/100

DATA KEUANGAN MINGGU INI:
- Total pengeluaran: Rp {total_spending}
- Breakdown: Kebutuhan {need_percent}%, Keinginan {want_percent}%, Investasi {investment_percent}%

KONTEKS HISTORIS (3 minggu terakhir):
{historical_summary}

Hasilkan insight dan rekomendasi berdasarkan data di atas.
```

### 3.3 Response Schema (JSON)

```typescript
interface AIInsightResponse {
  insights: {
    id: string;
    category: "productivity" | "time" | "financial" | "consistency" | "cross";
    severity: "info" | "warning" | "critical";
    message: string;
    data_reference: string;   // Data spesifik yang menjadi dasar insight
  }[];
  recommendations: {
    insight_id: string;       // Referensi ke insight terkait
    actions: string[];        // Daftar langkah konkret (maks 3)
    priority: "high" | "medium" | "low";
  }[];
  summary: string;            // Ringkasan 1-2 kalimat untuk Weekly Report
  highlight: string;          // Satu kalimat highlight utama untuk dashboard
}
```

---

## 4. Scoring Engine Specification

### 4.1 Formula Scoring

#### Productivity Score (0–100)

```typescript
function calculateProductivityScore(activities: Activity[]): number {
  const totalDuration = activities.reduce((sum, a) => sum + a.duration, 0);
  if (totalDuration === 0) return 0;

  const productiveDuration = activities
    .filter((a) => a.productivity_type === "produktif")
    .reduce((sum, a) => sum + a.duration, 0);

  const ratio = productiveDuration / totalDuration;
  
  // Skala: 0–30% = 0–40 poin, 30–60% = 40–70 poin, 60–100% = 70–100 poin
  if (ratio < 0.3) return Math.round((ratio / 0.3) * 40);
  if (ratio < 0.6) return Math.round(40 + ((ratio - 0.3) / 0.3) * 30);
  return Math.round(70 + ((ratio - 0.6) / 0.4) * 30);
}
```

#### Time Management Score (0–100)

```typescript
function calculateTimeManagementScore(audit: WeeklyAudit): number {
  const targetDailyHours = 8;    // Target jam aktivitas terstruktur per hari
  const totalDays = 7;
  const totalTargetMinutes = targetDailyHours * 60 * totalDays;
  
  const totalRecordedMinutes = audit.total_time || 0;
  const completionRatio = Math.min(totalRecordedMinutes / totalTargetMinutes, 1);
  
  // Bonus poin jika input konsisten setiap hari
  const daysWithInput = countDaysWithActivity(audit.activities);
  const consistencyBonus = (daysWithInput / totalDays) * 20;
  
  return Math.round(completionRatio * 80 + consistencyBonus);
}
```

#### Consistency Score (0–100)

```typescript
function calculateConsistencyScore(
  currentAudit: WeeklyAudit,
  previousAudits: WeeklyAudit[]  // 3 minggu terakhir
): number {
  if (previousAudits.length === 0) return 50; // Default untuk audit pertama

  const currentScore = currentAudit.scores?.productivity_score || 0;
  const avgPreviousScore = previousAudits.reduce(
    (sum, a) => sum + (a.scores?.productivity_score || 0), 0
  ) / previousAudits.length;

  const variance = Math.abs(currentScore - avgPreviousScore);
  
  // Semakin kecil variance, semakin tinggi consistency score
  // Variance 0 = 100 poin, variance 50+ = 0 poin
  return Math.max(0, Math.round(100 - (variance * 2)));
}
```

#### Financial Discipline Score (0–100)

```typescript
function calculateFinancialScore(records: FinancialRecord[]): number {
  if (records.length === 0) return 0;

  const total = records.reduce((sum, r) => sum + r.amount, 0);
  if (total === 0) return 0;

  const needTotal = records.filter(r => r.type === 'need').reduce((sum, r) => sum + r.amount, 0);
  const wantTotal = records.filter(r => r.type === 'want').reduce((sum, r) => sum + r.amount, 0);
  const investTotal = records.filter(r => r.type === 'investment').reduce((sum, r) => sum + r.amount, 0);

  const needRatio = needTotal / total;
  const wantRatio = wantTotal / total;
  const investRatio = investTotal / total;

  // Target ideal: 50% need, ≤30% want, ≥20% invest
  let score = 100;
  if (wantRatio > 0.5) score -= 40;
  else if (wantRatio > 0.3) score -= 20;
  if (investRatio === 0) score -= 30;
  else if (investRatio < 0.1) score -= 15;

  return Math.max(0, score);
}
```

#### Total Score (Agregat Berbobot)

```typescript
const SCORE_WEIGHTS = {
  productivity: 0.30,
  time_management: 0.25,
  consistency: 0.20,
  self_improvement: 0.15,
  financial_discipline: 0.10,
};

function calculateTotalScore(scores: Scores): number {
  return Math.round(
    scores.productivity_score * SCORE_WEIGHTS.productivity +
    scores.time_management_score * SCORE_WEIGHTS.time_management +
    scores.consistency_score * SCORE_WEIGHTS.consistency +
    scores.self_improvement_score * SCORE_WEIGHTS.self_improvement +
    scores.financial_discipline_score * SCORE_WEIGHTS.financial_discipline
  );
}
```

---

## 5. Pattern Detection System

### 5.1 Tipe Pola yang Dideteksi

| ID Pola | Nama | Deskripsi | Window Data |
|---|---|---|---|
| PAT_001 | Recurring Low Week | Produktivitas rendah 3 minggu berturut-turut | 3 minggu |
| PAT_002 | Consistent High Performer | Skor tinggi (≥75) selama 4 minggu berturut-turut | 4 minggu |
| PAT_003 | Weekend Warrior | Produktivitas selalu turun di akhir pekan | 4 minggu |
| PAT_004 | Financial Spiral | Pengeluaran meningkat setiap minggu selama 3 minggu | 3 minggu |
| PAT_005 | Improving Trend | Skor naik secara konsisten 4 minggu terakhir | 4 minggu |

### 5.2 Implementasi Pattern Detection

```typescript
async function detectPatterns(
  userId: string,
  recentAudits: WeeklyAudit[]
): Promise<DetectedPattern[]> {
  const patterns: DetectedPattern[] = [];

  // PAT_001: Recurring Low Week
  if (recentAudits.length >= 3) {
    const last3 = recentAudits.slice(0, 3);
    const allLow = last3.every(a => a.scores?.productivity_score < 40);
    if (allLow) {
      patterns.push({
        pattern_id: "PAT_001",
        severity: "critical",
        message: "Produktivitas rendah 3 minggu berturut-turut. Ini bisa jadi tanda burnout atau kurangnya motivasi.",
        recommendation: "Pertimbangkan untuk istirahat sejenak atau konsultasi dengan orang yang kamu percaya.",
      });
    }
  }

  // PAT_005: Improving Trend
  if (recentAudits.length >= 4) {
    const scores = recentAudits.slice(0, 4).map(a => a.scores?.productivity_score || 0);
    const isImproving = scores.every((s, i) => i === 0 || s >= scores[i - 1]);
    if (isImproving) {
      patterns.push({
        pattern_id: "PAT_005",
        severity: "info",
        message: "Tren positif! Skor produktivitasmu terus meningkat 4 minggu berturut-turut.",
        recommendation: "Pertahankan momentum ini. Catat kebiasaan baik yang kamu lakukan.",
      });
    }
  }

  return patterns;
}
```

---

## 6. Integration Contracts

### 6.1 Contract: Scoring Engine

```typescript
// Input
interface ScoringInput {
  audit_id: string;
  user_id: string;
  activities: Activity[];
  financial_records: FinancialRecord[];
  previous_audits: WeeklyAudit[];  // Untuk consistency score
}

// Output
interface ScoringOutput {
  audit_id: string;
  productivity_score: number;        // 0–100
  time_management_score: number;     // 0–100
  consistency_score: number;         // 0–100
  self_improvement_score: number;    // 0–100
  financial_discipline_score: number; // 0–100
  spending_awareness_score: number;  // 0–100
  total_score: number;               // 0–100 (weighted)
  calculated_at: string;             // ISO timestamp
}
```

### 6.2 Contract: Insight Engine

```typescript
// Input
interface InsightInput {
  audit_id: string;
  user_id: string;
  scores: ScoringOutput;
  activities: Activity[];
  financial_records: FinancialRecord[];
  historical_data: {
    audits: WeeklyAudit[];          // 4 minggu terakhir
    financial: FinancialRecord[];   // 30 hari terakhir
  };
}

// Output
interface InsightOutput {
  audit_id: string;
  insights: Insight[];
  recommendations: Recommendation[];
  patterns: DetectedPattern[];
  summary: string;
  highlight: string;
  generated_at: string;
}
```

### 6.3 Contract: Weekly Report Generator

```typescript
// Input
interface ReportInput {
  user_id: string;
  audit: WeeklyAudit;
  scores: ScoringOutput;
  insights: InsightOutput;
}

// Output
interface WeeklyReport {
  user_id: string;
  week_label: string;             // "Minggu 1 Januari 2026"
  summary: string;
  highlight: string;
  scores: { label: string; value: number; change: number }[];
  top_insights: Insight[];
  top_recommendations: string[];
  next_week_goals: string[];
  generated_at: string;
}
```

---

## 7. Roadmap AI (Fase Lanjutan)

| Fase | Target | Fitur AI |
|---|---|---|
| **v1.0 (sekarang)** | Fase 1–2 | Rule-based insight engine, weighted scoring |
| **v1.5** | Fase 3 | Integrasi LLM (OpenAI/Anthropic) untuk insight lebih personal |
| **v2.0** | Fase 5 | Machine learning: personalized scoring weights, anomaly detection |
| **v2.5** | Roadmap | Predictive analytics: forecast skor minggu depan berdasarkan historis |

### Persiapan Integrasi LLM (Fase 3)

Saat integrasi LLM diaktifkan, sistem akan:
1. Tetap menjalankan rule-based engine sebagai fallback
2. LLM dipanggil secara async setelah rule engine selesai
3. Output LLM disimpan di tabel `ai_insights` terpisah
4. A/B testing antara rule-based vs LLM insight untuk mengukur kualitas

---

*AuditLife v1.0 · AI_SPEC.md · Dibaca oleh: Developer + AI Engineer*
# ARCHITECTURE.md — AuditLife

> Dokumen arsitektur sistem, skema database, alur data, dan ringkasan API.  
> Dibaca oleh: **Developer**

---

## Daftar Isi

1. [Gambaran Arsitektur](#1-gambaran-arsitektur)
2. [Layer Sistem](#2-layer-sistem)
3. [Stack Teknologi](#3-stack-teknologi)
4. [Skema Database (ERD)](#4-skema-database-erd)
5. [Alur Data (Data Flow)](#5-alur-data-data-flow)
6. [API Spec — Ringkasan](#6-api-spec--ringkasan)
7. [Konfigurasi Supabase](#7-konfigurasi-supabase)

---

## 1. Gambaran Arsitektur

AuditLife menggunakan pendekatan **client-server architecture** dengan Next.js 14 sebagai fullstack framework (frontend + API routes dalam satu codebase), Supabase sebagai backend-as-a-service (database, auth, storage), dan Vercel sebagai platform deployment.

```
┌──────────────────────────────────────────────────────┐
│                   USER (Browser)                     │
└─────────────────────────┬────────────────────────────┘
                          │ HTTPS
┌─────────────────────────▼────────────────────────────┐
│            PRESENTATION LAYER (Frontend)             │
│  Next.js 14 App Router · React · Tailwind · shadcn   │
│  Server Components · Client Components · RSC         │
└─────────────────────────┬────────────────────────────┘
                          │ API Calls / Server Actions
┌─────────────────────────▼────────────────────────────┐
│           APPLICATION LAYER (Backend / API)          │
│  Next.js API Routes · Edge Functions · Middleware    │
│  Auth validation · Input validation · File handling  │
└──────────────┬──────────────────────────┬────────────┘
               │                          │
┌──────────────▼──────────┐  ┌────────────▼────────────┐
│  BUSINESS + AI LAYER    │  │     SCORING ENGINE      │
│  Rule-based Insight     │  │  Multi-dimensional calc  │
│  Pattern Detection      │  │  Weighted scoring logic  │
│  Recommendation Engine  │  │  Period comparison       │
└──────────────┬──────────┘  └────────────┬────────────┘
               │                          │
┌──────────────▼──────────────────────────▼────────────┐
│                   DATA LAYER                         │
│  Supabase PostgreSQL · Row Level Security (RLS)      │
│  Supabase Storage · Supabase Auth                    │
└──────────────────────────────────────────────────────┘
```

---

## 2. Layer Sistem

### 2.1 Presentation Layer

- **Framework:** Next.js 14 dengan App Router
- **Rendering:** Server Components untuk halaman statis/data fetch; Client Components untuk interaktivitas
- **UI Library:** shadcn/ui + Tailwind CSS
- **Chart:** Recharts (pie chart, bar chart, line chart, radar chart)
- **State Management:** React Query (TanStack Query) untuk server state; React useState/useReducer untuk UI state

### 2.2 Application Layer

- **API Routes:** `app/api/` menggunakan Next.js Route Handlers
- **Edge Functions:** Digunakan untuk middleware autentikasi dan validasi token
- **Middleware:** `middleware.ts` — validasi sesi dan proteksi route
- **Input Validation:** Zod schema validation pada semua endpoint

### 2.3 Business + AI Layer

- **Scoring Engine:** Kalkulasi skor multidimensi berbasis bobot yang dapat dikonfigurasi
- **Insight Engine:** Rule-based system untuk deteksi pola dan generasi rekomendasi
- **Pattern Detection:** Analisis historis data aktivitas per pengguna
- **Financial Analysis:** Korelasi data pengeluaran dengan data aktivitas

### 2.4 Data Layer

- **Database:** Supabase PostgreSQL dengan RLS aktif pada semua tabel
- **Storage:** Supabase Storage untuk upload file (maks 50MB/file)
- **Auth:** Supabase Auth dengan JWT + OAuth Google/Microsoft
- **Realtime:** Supabase Realtime (opsional, untuk notifikasi)

---

## 3. Stack Teknologi

| Layer | Teknologi | Versi | Keterangan |
|---|---|---|---|
| Frontend Framework | Next.js | 14.x | App Router, Server Components |
| UI Library | React | 18.x | Dengan hooks dan concurrent features |
| Styling | Tailwind CSS | 3.x | Utility-first CSS |
| Component Library | shadcn/ui | Latest | Accessible, customizable components |
| Charts | Recharts | 2.x | Radar, bar, pie, line chart |
| Server State | TanStack Query | 5.x | Data fetching, caching, sync |
| Validation | Zod | 3.x | TypeScript-first schema validation |
| Database | PostgreSQL | 15.x | Via Supabase |
| BaaS | Supabase | Latest | DB + Auth + Storage + RLS |
| Auth | Supabase Auth | — | JWT, OAuth Google/Microsoft |
| Deployment | Vercel | — | Edge network global |
| Language | TypeScript | 5.x | Strict mode aktif |
| Package Manager | pnpm | 8.x | Fast, disk-efficient |

---

## 4. Skema Database (ERD)

### Diagram Relasi

```
users
  ├──< weekly_audits
  │         ├──< activities >── categories
  │         ├──  scores
  │         └──  reflections
  └──< financial_records
```

### Tabel: users

```sql
CREATE TABLE users (
  user_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255),               -- null jika OAuth
  role        VARCHAR(20) DEFAULT 'user'  -- 'user' | 'admin' | 'super_admin'
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
```

### Tabel: weekly_audits

```sql
CREATE TABLE weekly_audits (
  audit_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  week_end_date   DATE NOT NULL,
  total_time      INTEGER,                -- dalam menit
  summary         TEXT,
  status          VARCHAR(20) DEFAULT 'draft', -- 'draft' | 'submitted'
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);
```

### Tabel: activities

```sql
CREATE TABLE activities (
  activity_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id          UUID NOT NULL REFERENCES weekly_audits(audit_id) ON DELETE CASCADE,
  category_id       UUID REFERENCES categories(category_id),
  category          VARCHAR(100),
  duration          INTEGER NOT NULL,   -- dalam menit
  productivity_type VARCHAR(20),        -- 'produktif' | 'non-produktif'
  description       TEXT,
  created_at        TIMESTAMPTZ DEFAULT now()
);
```

### Tabel: categories

```sql
CREATE TABLE categories (
  category_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_name VARCHAR(100) NOT NULL,
  type          VARCHAR(20) NOT NULL,   -- 'produktif' | 'non-produktif'
  icon          VARCHAR(50),
  is_default    BOOLEAN DEFAULT false,
  created_by    UUID REFERENCES users(user_id),
  created_at    TIMESTAMPTZ DEFAULT now()
);
```

### Tabel: scores

```sql
CREATE TABLE scores (
  score_id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id                  UUID UNIQUE NOT NULL REFERENCES weekly_audits(audit_id),
  productivity_score        DECIMAL(5,2) DEFAULT 0,
  time_management_score     DECIMAL(5,2) DEFAULT 0,
  consistency_score         DECIMAL(5,2) DEFAULT 0,
  self_improvement_score    DECIMAL(5,2) DEFAULT 0,
  financial_discipline_score DECIMAL(5,2) DEFAULT 0,
  spending_awareness_score  DECIMAL(5,2) DEFAULT 0,
  total_score               DECIMAL(5,2) DEFAULT 0,
  calculated_at             TIMESTAMPTZ DEFAULT now()
);
```

### Tabel: reflections

```sql
CREATE TABLE reflections (
  reflection_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id         UUID UNIQUE NOT NULL REFERENCES weekly_audits(audit_id),
  positive_notes   TEXT,
  improvement_notes TEXT,
  next_plan        TEXT,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);
```

### Tabel: financial_records

```sql
CREATE TABLE financial_records (
  record_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  audit_id    UUID REFERENCES weekly_audits(audit_id),
  date        DATE NOT NULL,
  category    VARCHAR(100),
  amount      DECIMAL(15,2) NOT NULL,
  type        VARCHAR(20) NOT NULL,   -- 'need' | 'want' | 'investment'
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

### Tabel: spiritual_reflections

```sql
CREATE TABLE spiritual_reflections (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  gratitude_notes TEXT,
  weekly_intention TEXT,
  personal_notes  TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);
-- RLS: hanya user yang bersangkutan yang bisa akses
```

### Row Level Security (RLS)

```sql
-- Contoh RLS untuk weekly_audits
ALTER TABLE weekly_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access own audits"
  ON weekly_audits
  FOR ALL
  USING (auth.uid() = user_id);

-- Terapkan pola yang sama untuk: activities, scores,
-- reflections, financial_records, spiritual_reflections
```

---

## 5. Alur Data (Data Flow)

### Alur: Submit Weekly Audit

```
User isi form aktivitas
        ↓
Client validasi input (Zod)
        ↓
POST /api/audit/submit
        ↓
Middleware: validasi JWT token
        ↓
Server: validasi payload (Zod)
        ↓
Supabase: INSERT ke weekly_audits + activities
        ↓
Scoring Engine: kalkulasi skor
        ↓
Supabase: INSERT ke scores
        ↓
Insight Engine: generate insight rules
        ↓
Response: { audit_id, scores, insights }
        ↓
UI: redirect ke Dashboard / Insight page
```

### Alur: Generate AI Insight

```
Trigger: audit di-submit / user buka halaman insight
        ↓
GET /api/insight/:audit_id
        ↓
Fetch data: activities + scores + financial_records (30 hari)
        ↓
Rule Engine: evaluasi kondisi
  - if produktif_time < 30% → trigger insight "non-prioritas"
  - if sabtu/minggu score drop > 20% → trigger "weekend dip"
  - if spending tinggi saat produktivitas rendah → cross insight
        ↓
Generate rekomendasi berdasarkan triggered rules
        ↓
Response: { insights[], recommendations[] }
        ↓
UI: render insight cards
```

---

## 6. API Spec — Ringkasan

Base URL: `/api`  
Autentikasi: Bearer JWT Token (dari Supabase Auth)

### Auth

| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/auth/login` | Login dengan email/password |
| POST | `/api/auth/register` | Registrasi akun baru |
| POST | `/api/auth/logout` | Logout (invalidate session) |
| GET | `/api/auth/me` | Ambil data profil user aktif |

### Audit

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/audit` | List semua audit milik user |
| POST | `/api/audit` | Buat audit baru |
| GET | `/api/audit/:id` | Detail satu audit |
| PUT | `/api/audit/:id` | Update audit (hanya status draft) |
| DELETE | `/api/audit/:id` | Hapus audit |
| POST | `/api/audit/:id/submit` | Submit audit untuk diproses |

### Activities

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/audit/:id/activities` | List aktivitas dalam audit |
| POST | `/api/audit/:id/activities` | Tambah aktivitas |
| PUT | `/api/audit/:id/activities/:actId` | Update aktivitas |
| DELETE | `/api/audit/:id/activities/:actId` | Hapus aktivitas |

### Scoring

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/audit/:id/scores` | Ambil skor audit |
| POST | `/api/audit/:id/scores/recalculate` | Hitung ulang skor |

### Insight

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/insight/:audit_id` | Ambil insight untuk audit |
| GET | `/api/insight/summary` | Insight agregat semua periode |

### Reflection

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/reflection/:audit_id` | Ambil refleksi |
| POST | `/api/reflection/:audit_id` | Simpan refleksi |
| PUT | `/api/reflection/:audit_id` | Update refleksi |

### Financial

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/financial` | List catatan keuangan user |
| POST | `/api/financial` | Tambah catatan keuangan |
| PUT | `/api/financial/:id` | Update catatan |
| DELETE | `/api/financial/:id` | Hapus catatan |
| GET | `/api/financial/summary` | Ringkasan dan insight keuangan |

### Categories

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/categories` | List semua kategori |
| POST | `/api/categories` | Tambah kategori (admin) |
| PUT | `/api/categories/:id` | Update kategori (admin) |
| DELETE | `/api/categories/:id` | Hapus kategori (admin) |

### Response Format Standar

```json
// Success
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Deskripsi error",
    "details": { ... }
  }
}
```

---

## 7. Konfigurasi Supabase

### Storage Buckets

| Bucket | Akses | Max Size | Keterangan |
|---|---|---|---|
| `avatars` | Private (RLS) | 2MB | Foto profil pengguna |
| `audit-exports` | Private (RLS) | 50MB | Export data audit (PDF/Excel) |

### Auth Providers

- Email/Password (default aktif)
- Google OAuth
- Microsoft OAuth (opsional)

### Supabase Edge Functions (Opsional, Fase 3+)

| Function | Trigger | Keterangan |
|---|---|---|
| `on-audit-submit` | Database trigger | Auto-generate insight setelah audit submit |
| `weekly-reminder` | Cron (Senin 08:00) | Kirim notifikasi reminder audit mingguan |

---

*AuditLife v1.0 · ARCHITECTURE.md · Dibaca oleh: Developer*
# BUSINESS_RULES.md — AuditLife

> Semua aturan bisnis: approval workflow, role & hak akses, threshold penilaian, alur program, dan alur verifikasi.  
> Dibaca oleh: **Developer + Product Owner**

---

## Daftar Isi

1. [Aturan Pengguna & Akun](#1-aturan-pengguna--akun)
2. [Role & Hak Akses](#2-role--hak-akses)
3. [Aturan Weekly Audit](#3-aturan-weekly-audit)
4. [Aturan Scoring & Threshold](#4-aturan-scoring--threshold)
5. [Aturan Insight & Rekomendasi](#5-aturan-insight--rekomendasi)
6. [Aturan Keuangan](#6-aturan-keuangan)
7. [Approval Workflow](#7-approval-workflow)
8. [Alur Program Utama](#8-alur-program-utama)
9. [Aturan Notifikasi](#9-aturan-notifikasi)
10. [Aturan Data & Privasi](#10-aturan-data--privasi)

---

## 1. Aturan Pengguna & Akun

### 1.1 Registrasi

| Aturan | Detail |
|---|---|
| BR-USR-001 | Email harus unik di seluruh sistem |
| BR-USR-002 | Email harus diverifikasi sebelum pengguna dapat menggunakan fitur apapun |
| BR-USR-003 | Password minimum 8 karakter, harus mengandung huruf besar, huruf kecil, dan angka |
| BR-USR-004 | Pengguna yang mendaftar via OAuth (Google) tidak memerlukan verifikasi email manual |
| BR-USR-005 | Role default saat registrasi adalah `user` |
| BR-USR-006 | Satu email hanya bisa digunakan untuk satu akun (tidak bisa mendaftar email+password jika email sudah digunakan OAuth) |

### 1.2 Login & Sesi

| Aturan | Detail |
|---|---|
| BR-USR-010 | Setelah 5 kali gagal login, akun dikunci sementara selama 15 menit |
| BR-USR-011 | Sesi aktif selama 7 hari (dengan refresh token) |
| BR-USR-012 | Login dari device baru tidak memerlukan verifikasi tambahan (v1.0) |
| BR-USR-013 | Pengguna dapat memiliki maksimal 5 sesi aktif secara bersamaan |

### 1.3 Penghapusan Akun

| Aturan | Detail |
|---|---|
| BR-USR-020 | Pengguna dapat menghapus akunnya sendiri kapan saja |
| BR-USR-021 | Sebelum penghapusan, pengguna wajib konfirmasi ulang dengan password |
| BR-USR-022 | Grace period 7 hari sebelum data benar-benar dihapus permanen |
| BR-USR-023 | Selama grace period, pengguna dapat membatalkan penghapusan dengan login kembali |
| BR-USR-024 | Setelah grace period: semua data personal dihapus, audit log dianonimkan |

---

## 2. Role & Hak Akses

### 2.1 Definisi Role

#### Role: `user`
Pengguna reguler yang menggunakan aplikasi untuk self-audit.

**Dapat melakukan:**
- Registrasi dan login
- Mengisi, mengedit (draft), dan menghapus audit mingguan milik sendiri
- Melihat dashboard dan skor milik sendiri
- Mengakses insight dan rekomendasi yang dihasilkan dari data sendiri
- Mengisi refleksi diri
- Mencatat keuangan harian
- Mengakses riwayat audit sendiri
- Mengekspor data pribadi sendiri
- Mengisi spiritual reflection (privat)

**Tidak dapat melakukan:**
- Melihat data pengguna lain
- Mengubah kategori sistem atau indikator penilaian
- Mengakses panel admin
- Mengubah role diri sendiri

#### Role: `admin`
Staf internal AuditLife yang mengelola sistem.

**Dapat melakukan (tambahan dari user):**
- Melihat daftar semua pengguna (tanpa melihat konten audit)
- Mengelola kategori aktivitas (tambah, edit, nonaktifkan)
- Mengelola konfigurasi domain dan indikator audit
- Melihat audit logs sistem
- Menonaktifkan akun pengguna (perlu konfirmasi Super Admin)
- Melihat statistik agregat sistem (tanpa data personal)

**Tidak dapat melakukan:**
- Melihat isi audit, refleksi, atau data keuangan pengguna individual
- Menghapus akun pengguna (hanya Super Admin)
- Mengubah konfigurasi sistem global
- Mengelola akun Admin lain

#### Role: `super_admin`
Akses penuh terhadap konfigurasi sistem.

**Dapat melakukan (tambahan dari admin):**
- Mengelola akun Admin (tambah, edit, nonaktifkan)
- Menghapus akun pengguna
- Mengubah konfigurasi sistem global (bobot scoring, dll.)
- Mengelola integrasi teknologi
- Mengakses semua audit logs
- Approve aksi admin yang memerlukan konfirmasi Super Admin

**Batasan:**
- Tetap tidak dapat melihat isi spiritual reflection pengguna

### 2.2 Matrix Akses Lengkap

| Fitur | User | Admin | Super Admin |
|---|---|---|---|
| **Akun** | | | |
| Registrasi & login | ✅ | ✅ | ✅ |
| Edit profil sendiri | ✅ | ✅ | ✅ |
| Hapus akun sendiri | ✅ | ✅ | ✅ |
| Lihat daftar semua user | ❌ | ✅ | ✅ |
| Edit profil user lain | ❌ | ✅ | ✅ |
| Hapus akun user lain | ❌ | ⚠️ Perlu SA | ✅ |
| Kelola Admin | ❌ | ❌ | ✅ |
| **Audit & Data** | | | |
| Lihat audit sendiri | ✅ | — | — |
| Edit/hapus audit sendiri | ✅ | — | — |
| Lihat isi audit user lain | ❌ | ❌ | ❌ |
| Lihat statistik agregat | ❌ | ✅ | ✅ |
| **Konfigurasi** | | | |
| Kelola kategori aktivitas | ❌ | ✅ | ✅ |
| Ubah bobot scoring | ❌ | ❌ | ✅ |
| Konfigurasi sistem global | ❌ | ❌ | ✅ |
| **Privasi** | | | |
| Spiritual reflection | Diri sendiri | ❌ | ❌ |
| Export data sendiri | ✅ | — | — |
| **Log & Monitoring** | | | |
| Lihat audit logs | ❌ | ✅ | ✅ |

---

## 3. Aturan Weekly Audit

### 3.1 Pembuatan Audit

| Aturan | Detail |
|---|---|
| BR-AUD-001 | Pengguna hanya dapat memiliki **satu audit aktif (draft)** per periode minggu |
| BR-AUD-002 | Periode audit adalah Senin s/d Minggu (ISO week) |
| BR-AUD-003 | Pengguna dapat membuat audit untuk minggu yang sudah lewat (backfill), maksimal 4 minggu ke belakang |
| BR-AUD-004 | Tidak dapat membuat audit untuk minggu yang akan datang |
| BR-AUD-005 | Audit yang sudah di-submit tidak dapat diedit (hanya bisa dilihat) |

### 3.2 Input Aktivitas

| Aturan | Detail |
|---|---|
| BR-AUD-010 | Satu aktivitas memiliki durasi minimum **15 menit** |
| BR-AUD-011 | Satu aktivitas memiliki durasi maksimum **720 menit (12 jam)** per entry |
| BR-AUD-012 | Total durasi semua aktivitas dalam satu audit maksimum **10.080 menit (7 hari × 24 jam)** |
| BR-AUD-013 | Pengguna dapat menambahkan maksimum **50 aktivitas** per audit |
| BR-AUD-014 | Kategori aktivitas wajib dipilih (tidak boleh kosong) |
| BR-AUD-015 | Productivity type (produktif/non-produktif) wajib dipilih |
| BR-AUD-016 | Deskripsi aktivitas bersifat opsional, maksimum 500 karakter |

### 3.3 Submit Audit

| Aturan | Detail |
|---|---|
| BR-AUD-020 | Audit hanya bisa di-submit jika memiliki **minimal 1 aktivitas** |
| BR-AUD-021 | Setelah submit, sistem otomatis menghitung skor dalam **maksimal 30 detik** |
| BR-AUD-022 | Setelah submit, sistem otomatis menghasilkan insight dalam **maksimal 60 detik** |
| BR-AUD-023 | Audit yang sudah di-submit tidak dapat diubah kembali ke draft |

---

## 4. Aturan Scoring & Threshold

### 4.1 Skala Skor

Semua skor menggunakan skala **0 hingga 100**.

### 4.2 Klasifikasi Skor

| Range Skor | Label | Warna UI |
|---|---|---|
| 80 – 100 | Luar Biasa | Hijau |
| 60 – 79 | Baik | Biru |
| 40 – 59 | Cukup | Kuning |
| 20 – 39 | Perlu Perhatian | Oranye |
| 0 – 19 | Kritis | Merah |

### 4.3 Bobot Scoring (Default)

| Dimensi | Bobot | Keterangan |
|---|---|---|
| Productivity Score | 30% | Rasio aktivitas produktif vs total |
| Time Management Score | 25% | Kelengkapan pencatatan dan efisiensi waktu |
| Consistency Score | 20% | Stabilitas performa dibanding periode sebelumnya |
| Self-Improvement Score | 15% | Tren perkembangan skor dari waktu ke waktu |
| Financial Discipline Score | 10% | Pola alokasi pengeluaran |

> Bobot dapat dikonfigurasi oleh Super Admin melalui panel admin tanpa mengubah kode.

### 4.4 Threshold Trigger Insight

| Kondisi | Threshold | Aksi |
|---|---|---|
| Productivity Score | < 40 | Trigger insight "Low Productivity" |
| Aktivitas produktif | 0 aktivitas | Trigger insight "No Productive Activity" (Critical) |
| Waktu hiburan | > 40% total | Trigger insight "Entertainment Dominance" |
| Konsistensi turun | > 30% drop dari rata-rata | Trigger insight "Consistency Drop" |
| Produktivitas akhir pekan | < 70% produktivitas hari kerja | Trigger insight "Weekend Dip" |
| Want spending | > 50% total pengeluaran | Trigger insight "Want Dominance" |
| Investment | Rp 0 | Trigger insight "Zero Investment" |

### 4.5 Scoring Audit Pertama

- Consistency Score untuk audit pertama (belum ada historis): **50 (netral)**
- Self-Improvement Score untuk audit pertama: **50 (netral)**

---

## 5. Aturan Insight & Rekomendasi

### 5.1 Generasi Insight

| Aturan | Detail |
|---|---|
| BR-INS-001 | Insight hanya dihasilkan setelah audit di-submit |
| BR-INS-002 | Maksimum **5 insight** ditampilkan per audit (diprioritaskan berdasarkan severity) |
| BR-INS-003 | Insight dengan severity `critical` selalu ditampilkan terlebih dahulu |
| BR-INS-004 | Insight positif (severity `info`) minimal **1** selalu ditampilkan jika ada |
| BR-INS-005 | Setiap insight dilengkapi minimal **1 rekomendasi konkret** |
| BR-INS-006 | Rule dengan `cooldown_days` tidak ditampilkan kembali sebelum masa cooldown habis |

### 5.2 Weekly Report

| Aturan | Detail |
|---|---|
| BR-REP-001 | Weekly Report digenerate otomatis setelah audit di-submit |
| BR-REP-002 | Report berisi: ringkasan skor, top 3 insight, dan top 3 rekomendasi |
| BR-REP-003 | Report dapat diakses dari halaman Riwayat Audit |
| BR-REP-004 | Report dapat di-share atau di-export sebagai PDF (Fase 4+) |

---

## 6. Aturan Keuangan

### 6.1 Pencatatan

| Aturan | Detail |
|---|---|
| BR-FIN-001 | Nominal pengeluaran minimum **Rp 1** |
| BR-FIN-002 | Nominal pengeluaran maksimum **Rp 999.999.999** per satu catatan |
| BR-FIN-003 | Setiap catatan wajib memiliki tanggal, kategori, nominal, dan tipe (need/want/investment) |
| BR-FIN-004 | Pengguna dapat mencatat maksimum **100 transaksi** per minggu |
| BR-FIN-005 | Tanggal transaksi tidak boleh lebih dari **90 hari** ke belakang |
| BR-FIN-006 | Tanggal transaksi tidak boleh di masa depan |

### 6.2 Klasifikasi Pengeluaran

| Tipe | Definisi | Contoh |
|---|---|---|
| **Need** | Kebutuhan dasar yang tidak bisa dihindari | Makanan, transportasi kerja, tagihan listrik |
| **Want** | Keinginan yang bisa ditunda atau dihindari | Makan di restoran mahal, hiburan, fashion |
| **Investment** | Pengeluaran yang menghasilkan nilai jangka panjang | Kursus, buku, saham, tabungan |

### 6.3 Integrasi dengan Audit

| Aturan | Detail |
|---|---|
| BR-FIN-010 | Data keuangan minggu berjalan diintegrasikan ke audit minggu yang sama |
| BR-FIN-011 | Financial Score dihitung bersamaan dengan submit audit |
| BR-FIN-012 | Jika tidak ada data keuangan saat audit di-submit, Financial Score = 0 |
| BR-FIN-013 | Cross-insight antara keuangan dan aktivitas digenerate jika keduanya tersedia |

---

## 7. Approval Workflow

### 7.1 Aksi yang Memerlukan Persetujuan Super Admin

| Aksi | Inisiator | Approver | SLA |
|---|---|---|---|
| Nonaktifkan akun pengguna | Admin | Super Admin | 24 jam |
| Hapus akun pengguna secara paksa | Admin | Super Admin | 24 jam |
| Export data massal (> 100 users) | Admin | Super Admin | 24 jam |
| Ubah bobot scoring global | — | Super Admin langsung | Segera |
| Tambah/hapus kategori sistem (default) | Admin | Super Admin | 12 jam |

### 7.2 Alur Approval

```
Admin inisiasi aksi kritis
        ↓
Sistem kirim notifikasi ke Super Admin
        ↓
Super Admin review dan approve/reject
        ↓
Jika approve → Aksi dieksekusi + dicatat di audit log
Jika reject  → Aksi dibatalkan + Admin diberi notifikasi alasan
        ↓
Kedua aksi (approve/reject) dicatat di audit log
dengan level: Critical
```

---

## 8. Alur Program Utama

### 8.1 Siklus Audit Mingguan

```
[Senin]
  Sistem kirim reminder: "Mulai audit minggu ini"
        ↓
[Senin – Minggu]
  User mencatat aktivitas harian dan pengeluaran
        ↓
[Kapan saja dalam minggu atau setelah minggu berakhir]
  User submit audit
        ↓
[Otomatis — dalam 30 detik setelah submit]
  Sistem hitung: Scoring
        ↓
[Otomatis — dalam 60 detik setelah submit]
  Sistem generate: Insight + Rekomendasi + Weekly Report
        ↓
[User]
  Buka halaman insight → baca insight → lanjut ke refleksi
        ↓
[User]
  Isi refleksi: hal baik, hal perlu diperbaiki, rencana
        ↓
[Sistem]
  Simpan refleksi + tandai audit sebagai "lengkap"
        ↓
[Senin berikutnya]
  Siklus berulang
```

### 8.2 Alur Onboarding User Baru

```
Registrasi berhasil
        ↓
Email verifikasi terkirim
        ↓
User klik link verifikasi
        ↓
Redirect ke halaman onboarding:
  Step 1: Pilih kategori aktivitas yang relevan
  Step 2: Atur target produktivitas minggu ini (opsional)
  Step 3: Perkenalan fitur (tooltip walkthrough)
        ↓
Redirect ke dashboard (kosong, belum ada data)
        ↓
CTA: "Mulai Audit Pertamamu" → arahkan ke halaman Weekly Audit
```

### 8.3 Alur Perbandingan Riwayat

```
User buka halaman Riwayat
        ↓
Sistem tampilkan list audit per minggu (terbaru dulu)
        ↓
User klik "Lihat Detail" pada audit tertentu
        ↓
Tampilkan: aktivitas, skor, insight, refleksi untuk audit tersebut
        ↓
User klik "Bandingkan" (Fase 2+)
        ↓
Pilih periode pembanding
        ↓
Tampilkan side-by-side comparison: skor, distribusi waktu, tren
```

---

## 9. Aturan Notifikasi

### 9.1 Notifikasi In-App

| Trigger | Pesan | Waktu |
|---|---|---|
| Audit minggu sebelumnya belum di-submit | "Kamu belum menyelesaikan audit minggu lalu. Selesaikan sekarang?" | Senin pagi |
| Skor konsistensi turun drastis | "Konsistensimu turun minggu ini. Yuk lihat apa yang bisa diperbaiki." | Setelah submit |
| Berhasil 4 minggu berturut-turut | "Kamu konsisten 4 minggu berturut-turut! Luar biasa!" | Setelah submit |
| Data keuangan belum diisi | "Jangan lupa catat pengeluaranmu hari ini." | Setiap hari pukul 20:00 |

### 9.2 Aturan Notifikasi

| Aturan | Detail |
|---|---|
| BR-NOT-001 | Notifikasi hanya dikirim jika pengguna mengaktifkan notifikasi (opt-in) |
| BR-NOT-002 | Maksimum **2 notifikasi per hari** per pengguna |
| BR-NOT-003 | Pengguna dapat menonaktifkan notifikasi kapan saja dari Settings |
| BR-NOT-004 | Notifikasi reminder audit tidak dikirim jika pengguna sudah submit audit minggu ini |

---

## 10. Aturan Data & Privasi

### 10.1 Kepemilikan Data

| Aturan | Detail |
|---|---|
| BR-DAT-001 | Data pengguna adalah milik pengguna sepenuhnya |
| BR-DAT-002 | AuditLife tidak akan menjual, menyewakan, atau membagikan data personal ke pihak ketiga untuk tujuan komersial |
| BR-DAT-003 | Data agregat anonim (tanpa identifikasi pengguna) dapat digunakan untuk peningkatan sistem |
| BR-DAT-004 | Data spiritual reflection tidak pernah digunakan untuk analisis sistem, insight, atau statistik manapun |

### 10.2 Akses Data

| Aturan | Detail |
|---|---|
| BR-DAT-010 | Pengguna hanya dapat mengakses data milik sendiri |
| BR-DAT-011 | Admin dapat melihat metadata pengguna (email, nama, tanggal registrasi) tetapi tidak isi audit |
| BR-DAT-012 | Tidak ada seorangpun yang dapat mengakses spiritual reflection kecuali pengguna pemiliknya |
| BR-DAT-013 | Permintaan export data diproses dalam maksimal **24 jam** |

### 10.3 Konfigurasi Dinamis

| Aturan | Detail |
|---|---|
| BR-CFG-001 | Kategori aktivitas dapat ditambah/diubah oleh Admin tanpa mengubah kode |
| BR-CFG-002 | Bobot scoring dapat diubah oleh Super Admin; perubahan berlaku untuk audit baru (tidak retroaktif) |
| BR-CFG-003 | Template audit dapat diimpor dalam format JSON atau Excel |
| BR-CFG-004 | Perubahan konfigurasi dicatat di audit log dengan level Critical |

---

*AuditLife v1.0 · BUSINESS_RULES.md · Dibaca oleh: Developer + Product Owner*
# COMPLIANCE.md — AuditLife

> Dokumen kebijakan privasi, keamanan data, audit trail, verifikasi pengguna, dan retensi data.  
> Dibaca oleh: **Developer + Tim Legal**

---

## Daftar Isi

1. [Prinsip Privasi & Keamanan Data](#1-prinsip-privasi--keamanan-data)
2. [Kebijakan Privasi (Privacy Policy)](#2-kebijakan-privasi-privacy-policy)
3. [Verifikasi & Onboarding Pengguna](#3-verifikasi--onboarding-pengguna)
4. [Audit Trail](#4-audit-trail)
5. [Aturan Akses Data (Four-Eyes & RBAC)](#5-aturan-akses-data-four-eyes--rbac)
6. [Retensi & Penghapusan Data](#6-retensi--penghapusan-data)
7. [Penanganan Insiden Privasi](#7-penanganan-insiden-privasi)

---

## 1. Prinsip Privasi & Keamanan Data

AuditLife dibangun dengan pendekatan **Privacy by Design**. Berikut adalah prinsip-prinsip yang wajib diterapkan dalam seluruh proses pengembangan dan operasional sistem:

| Prinsip | Implementasi |
|---|---|
| **Data Minimization** | Hanya kumpulkan data yang benar-benar dibutuhkan untuk fungsi audit |
| **Purpose Limitation** | Data pengguna hanya digunakan untuk fungsi AuditLife, tidak dijual atau dibagikan ke pihak ketiga |
| **User Control** | Pengguna dapat mengekspor, mengedit, dan menghapus datanya sendiri kapan saja |
| **Security by Default** | RLS aktif di semua tabel; enkripsi transit (HTTPS); JWT untuk autentikasi |
| **Transparency** | Pengguna diberi tahu data apa yang dikumpulkan dan bagaimana data digunakan |
| **Private by Design** | Data Spiritual Reflection Module tidak dapat diakses oleh siapapun selain pemiliknya |

---

## 2. Kebijakan Privasi (Privacy Policy)

### 2.1 Data yang Dikumpulkan

| Kategori Data | Contoh | Tujuan |
|---|---|---|
| **Data Identitas** | Nama, email, foto profil | Autentikasi dan personalisasi |
| **Data Aktivitas** | Kategori aktivitas, durasi, deskripsi | Proses audit dan analisis pola |
| **Data Keuangan** | Nominal pengeluaran, kategori, tanggal | Analisis perilaku finansial |
| **Data Refleksi** | Catatan refleksi mingguan, rencana | Evaluasi dan peningkatan diri |
| **Data Spiritual** | Jurnal syukur, niat mingguan | Privat — tidak diproses sistem |
| **Data Teknis** | IP address, user agent, timestamp login | Keamanan dan deteksi anomali |

### 2.2 Data yang TIDAK Dikumpulkan

- Nomor identitas (KTP, SIM, Paspor)
- Data biometrik
- Data lokasi (GPS)
- Kontak atau daftar teman
- Isi percakapan di luar platform

### 2.3 Dasar Hukum Pemrosesan Data

- **Persetujuan pengguna** (consent) saat registrasi
- **Kepentingan sah** (legitimate interest) untuk keamanan sistem
- Referensi: UU PDP Indonesia (UU No. 27 Tahun 2022)

### 2.4 Berbagi Data ke Pihak Ketiga

AuditLife **tidak menjual data pengguna**. Data hanya dibagikan kepada:

| Pihak | Data yang Dibagikan | Tujuan |
|---|---|---|
| **Supabase** | Semua data terenkripsi | Infrastructure database & auth |
| **Vercel** | Log teknis (anonymized) | Hosting & deployment |
| **Google** (jika OAuth) | Email & nama saja | Autentikasi |

### 2.5 Hak Pengguna

Pengguna memiliki hak untuk:
- **Mengakses** data pribadi mereka (export dalam format JSON/CSV)
- **Memperbaiki** data yang tidak akurat
- **Menghapus** akun dan seluruh data terkait (right to be forgotten)
- **Membatasi** pemrosesan data tertentu
- **Portabilitas data** — mendapatkan salinan data dalam format yang dapat dibaca mesin

---

## 3. Verifikasi & Onboarding Pengguna

### 3.1 Alur Registrasi

```
User input: nama, email, password
        ↓
Validasi format email dan kekuatan password
  - Min. 8 karakter
  - Kombinasi huruf besar, kecil, angka
        ↓
Kirim email verifikasi (via Supabase Auth)
        ↓
User klik link verifikasi
        ↓
Akun aktif — role default: 'user'
        ↓
Onboarding: pilih kategori aktivitas awal
```

### 3.2 Registrasi via OAuth (Google/Microsoft)

```
User klik "Login dengan Google"
        ↓
Redirect ke Google OAuth consent
        ↓
Google kembalikan: email + nama + avatar
        ↓
Supabase Auth buat/update record user
        ↓
JWT diterbitkan — sesi aktif
        ↓
Redirect ke dashboard
```

### 3.3 Aturan Password

| Kriteria | Ketentuan |
|---|---|
| Panjang minimum | 8 karakter |
| Kompleksitas | Minimal 1 huruf besar, 1 angka |
| Password lama | Tidak boleh sama dengan 3 password terakhir |
| Reset password | Via email dengan link kedaluwarsa dalam 1 jam |

### 3.4 Verifikasi Email

- Email verifikasi dikirim otomatis saat registrasi
- Link verifikasi valid selama **24 jam**
- Pengguna yang belum verifikasi email hanya bisa akses halaman verifikasi
- Resend email verifikasi tersedia dengan cooldown 60 detik

---

## 4. Audit Trail

Setiap aksi penting dalam sistem dicatat untuk keperluan keamanan dan audit.

### 4.1 Tabel Audit Log

```sql
CREATE TABLE audit_logs (
  log_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(user_id),
  action      VARCHAR(100) NOT NULL,  -- e.g. 'AUDIT_SUBMITTED', 'LOGIN_SUCCESS'
  entity_type VARCHAR(50),            -- e.g. 'weekly_audit', 'user'
  entity_id   UUID,
  ip_address  INET,
  user_agent  TEXT,
  metadata    JSONB,                  -- detail tambahan
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

### 4.2 Daftar Aksi yang Dicatat

| Kode Aksi | Deskripsi | Level |
|---|---|---|
| `LOGIN_SUCCESS` | Login berhasil | Info |
| `LOGIN_FAILED` | Login gagal (salah password) | Warning |
| `LOGOUT` | User logout | Info |
| `REGISTER` | Registrasi akun baru | Info |
| `PASSWORD_RESET` | Reset password | Warning |
| `AUDIT_CREATED` | Audit baru dibuat | Info |
| `AUDIT_SUBMITTED` | Audit di-submit | Info |
| `AUDIT_DELETED` | Audit dihapus | Warning |
| `REFLECTION_SAVED` | Refleksi disimpan | Info |
| `FINANCIAL_ADDED` | Catatan keuangan ditambah | Info |
| `ACCOUNT_DELETED` | Akun dihapus | Critical |
| `ADMIN_ACTION` | Semua aksi oleh Admin/Super Admin | Critical |
| `DATA_EXPORTED` | Export data pengguna | Warning |

### 4.3 Retensi Audit Log

- Log level `Info`: disimpan selama **90 hari**
- Log level `Warning`: disimpan selama **1 tahun**
- Log level `Critical`: disimpan selama **3 tahun**

---

## 5. Aturan Akses Data (Four-Eyes & RBAC)

### 5.1 Prinsip Four-Eyes untuk Aksi Kritis

Aksi berikut memerlukan konfirmasi ganda sebelum dieksekusi:

| Aksi | Konfirmasi Yang Dibutuhkan |
|---|---|
| Penghapusan akun pengguna oleh Admin | Persetujuan Super Admin |
| Export data massal pengguna | Log + persetujuan Super Admin |
| Perubahan konfigurasi scoring global | Review oleh 2 Admin |
| Penghapusan kategori sistem (default) | Konfirmasi eksplisit Admin |

### 5.2 Matrix Akses RBAC

| Fitur / Data | User | Admin | Super Admin |
|---|---|---|---|
| Lihat data audit sendiri | ✅ | ❌ | ❌ |
| Edit data audit sendiri | ✅ | ❌ | ❌ |
| Lihat data audit pengguna lain | ❌ | ❌ | ❌ |
| Lihat daftar semua pengguna | ❌ | ✅ | ✅ |
| Edit profil pengguna lain | ❌ | ✅ | ✅ |
| Hapus pengguna | ❌ | ⚠️ (+ Super Admin) | ✅ |
| Kelola kategori aktivitas | ❌ | ✅ | ✅ |
| Kelola konfigurasi scoring | ❌ | ✅ | ✅ |
| Akses audit logs | ❌ | ✅ | ✅ |
| Kelola Admin | ❌ | ❌ | ✅ |
| Konfigurasi sistem global | ❌ | ❌ | ✅ |
| Data Spiritual Reflection | Diri sendiri | ❌ | ❌ |

### 5.3 Isolasi Data dengan RLS

Seluruh tabel user-data menggunakan Supabase Row Level Security:

```sql
-- Policy template untuk semua tabel personal
CREATE POLICY "personal_data_isolation"
  ON [table_name]
  FOR ALL
  USING (auth.uid() = user_id);

-- Admin policy (read-only untuk support)
CREATE POLICY "admin_read_access"
  ON [table_name]
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );
```

---

## 6. Retensi & Penghapusan Data

### 6.1 Kebijakan Retensi

| Jenis Data | Masa Retensi | Keterangan |
|---|---|---|
| Data akun aktif | Selama akun aktif | Dihapus setelah akun dihapus |
| Data audit & aktivitas | 3 tahun sejak dibuat | Dapat dihapus lebih awal oleh user |
| Data keuangan | 3 tahun sejak dibuat | Dapat dihapus lebih awal oleh user |
| Data refleksi | 3 tahun sejak dibuat | Dapat dihapus lebih awal oleh user |
| Data spiritual | Selama akun aktif | Dihapus otomatis saat akun dihapus |
| Audit logs | 90 hari – 3 tahun | Tergantung level log |
| Backup database | 30 hari rolling | Dihapus otomatis |

### 6.2 Alur Penghapusan Akun (Right to be Forgotten)

```
User minta hapus akun (dari Settings)
        ↓
Konfirmasi password / re-auth
        ↓
Sistem tandai akun: status = 'pending_deletion'
        ↓
Grace period: 7 hari (akun bisa dipulihkan)
        ↓
Jika tidak dipulihkan dalam 7 hari:
  - Hapus semua data personal (cascade delete)
  - Anonymize audit logs (ganti user_id dengan NULL)
  - Hapus file di Supabase Storage
  - Kirim konfirmasi email penghapusan
        ↓
Log aksi: ACCOUNT_DELETED (Critical)
```

### 6.3 Export Data (Portabilitas)

Pengguna dapat mengekspor seluruh datanya dalam format:
- **JSON** — semua data mentah terstruktur
- **CSV** — data aktivitas dan keuangan dalam spreadsheet

Endpoint: `GET /api/user/export`  
Format response: File download dengan nama `auditlife-export-{user_id}-{date}.zip`

---

## 7. Penanganan Insiden Privasi

### 7.1 Klasifikasi Insiden

| Level | Deskripsi | Contoh |
|---|---|---|
| **Low** | Potensi eksposur data minimal | Bug validasi input non-kritis |
| **Medium** | Akses tidak sah ke data non-sensitif | Admin lihat data yang tidak seharusnya |
| **High** | Kebocoran data personal pengguna | Bypass RLS, dump data |
| **Critical** | Kebocoran massal atau data sensitif | Database breach |

### 7.2 Prosedur Respons Insiden

```
1. DETEKSI — Identifikasi insiden via monitoring/laporan
        ↓
2. CONTAINMENT — Isolasi sistem yang terpengaruh
   (jika perlu: nonaktifkan endpoint/fitur terkait)
        ↓
3. ASSESSMENT — Identifikasi scope dan dampak
   - Berapa pengguna terdampak?
   - Data apa yang terekspos?
        ↓
4. NOTIFIKASI
   - Internal: Tim teknis dalam 1 jam
   - Pengguna terdampak: dalam 72 jam (jika High/Critical)
   - Regulator (jika diperlukan UU PDP)
        ↓
5. REMEDIATION — Perbaikan sistem dan patch
        ↓
6. POST-MORTEM — Dokumentasi insiden dan langkah pencegahan
```

### 7.3 Kontak Penanganan Insiden

| Role | Tanggung Jawab |
|---|---|
| Lead Developer | Investigasi teknis dan patch |
| Product Owner | Keputusan eskalasi dan komunikasi pengguna |
| Tim Legal | Kepatuhan regulasi dan notifikasi resmi |

---

*AuditLife v1.0 · COMPLIANCE.md · Dibaca oleh: Developer + Tim Legal*
# DEV_GUIDE.md — AuditLife

> Panduan pengembangan: coding standards, git workflow, testing strategy, dan deployment guide.  
> Dibaca oleh: **Developer**

---

## Daftar Isi

1. [Coding Standards](#1-coding-standards)
2. [Struktur File & Konvensi Penamaan](#2-struktur-file--konvensi-penamaan)
3. [Git Workflow](#3-git-workflow)
4. [Testing Strategy](#4-testing-strategy)
5. [Deployment Guide](#5-deployment-guide)
6. [Tools & Extensions yang Direkomendasikan](#6-tools--extensions-yang-direkomendasikan)

---

## 1. Coding Standards

### 1.1 Bahasa & Konfigurasi

- **TypeScript** wajib di seluruh codebase. `strict: true` diaktifkan.
- Tidak boleh ada penggunaan `any` tanpa komentar justifikasi yang jelas.
- Seluruh fungsi publik wajib memiliki type annotation.

```typescript
// ✅ Benar
function calculateScore(activities: Activity[]): number {
  return activities.reduce((sum, a) => sum + a.duration, 0);
}

// ❌ Salah
function calculateScore(activities: any) {
  return activities.reduce((sum: any, a: any) => sum + a.duration, 0);
}
```

### 1.2 Komponen React

- Gunakan **functional components** dengan hooks. Tidak ada class components.
- Pisahkan **Server Components** dan **Client Components** secara eksplisit.
- File Client Component wajib diawali dengan `"use client"`.
- Props harus selalu diketik dengan `interface`, bukan `type` untuk komponen.

```typescript
// components/ui/ScoreCard.tsx
"use client";

interface ScoreCardProps {
  label: string;
  value: number;
  change?: number;
  variant?: "default" | "highlight";
}

export function ScoreCard({ label, value, change, variant = "default" }: ScoreCardProps) {
  // ...
}
```

### 1.3 API Routes

- Setiap endpoint wajib memiliki validasi input menggunakan **Zod**.
- Gunakan response helper yang konsisten.
- Selalu tangani error dengan try-catch dan kembalikan format error standar.

```typescript
// app/api/audit/route.ts
import { z } from "zod";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

const createAuditSchema = z.object({
  week_start_date: z.string().datetime(),
  week_end_date: z.string().datetime(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createAuditSchema.parse(body);
    // ... logic
    return Response.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { success: false, error: { code: "VALIDATION_ERROR", details: error.errors } },
        { status: 400 }
      );
    }
    return Response.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan" } },
      { status: 500 }
    );
  }
}
```

### 1.4 Formatting & Linting

- **Prettier** untuk auto-formatting (konfigurasi di `.prettierrc`)
- **ESLint** dengan config Next.js + TypeScript strict
- Jalankan lint dan format sebelum commit (dihandle oleh pre-commit hook via Husky)

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### 1.5 Aturan Umum

- Fungsi maksimal **50 baris**. Jika lebih, pecah menjadi sub-fungsi.
- Satu file maksimal **300 baris**. Jika lebih, pisah menjadi modul.
- Tidak ada magic number — gunakan konstanta bernama.
- Komentar dalam **Bahasa Indonesia** untuk logika bisnis; Bahasa Inggris untuk komentar teknis.

```typescript
// ✅ Benar
const MAX_ACTIVITIES_PER_AUDIT = 50;
const PRODUCTIVE_SCORE_THRESHOLD = 0.6; // 60% dari total waktu

// ❌ Salah
if (activities.length > 50) { ... }
if (ratio > 0.6) { ... }
```

---

## 2. Struktur File & Konvensi Penamaan

### 2.1 Penamaan File

| Jenis | Konvensi | Contoh |
|---|---|---|
| Komponen React | PascalCase | `ScoreCard.tsx`, `WeeklyAuditForm.tsx` |
| Pages (App Router) | kebab-case folder | `app/weekly-audit/page.tsx` |
| API Routes | kebab-case folder | `app/api/weekly-audit/route.ts` |
| Hooks | camelCase, prefix `use` | `useAuditData.ts`, `useScoring.ts` |
| Utilities | camelCase | `formatDate.ts`, `calculateScore.ts` |
| Types | PascalCase | `AuditTypes.ts`, `ScoringTypes.ts` |
| Constants | UPPER_SNAKE_CASE | `SCORE_WEIGHTS`, `MAX_DURATION` |

### 2.2 Struktur Komponen

```typescript
// Urutan dalam file komponen:
// 1. Imports
// 2. Types/Interfaces
// 3. Constants (jika ada, scope lokal)
// 4. Komponen utama
// 5. Sub-komponen (jika kecil dan terkait erat)
// 6. Default export

import { useState } from "react";
import type { Activity } from "@/types/AuditTypes";

interface ActivityListProps {
  activities: Activity[];
  onDelete: (id: string) => void;
}

const EMPTY_MESSAGE = "Belum ada aktivitas yang dicatat.";

export function ActivityList({ activities, onDelete }: ActivityListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  // ...
}
```

### 2.3 Alias Path

Gunakan alias `@/` untuk import dari root `src/` atau root project:

```typescript
// ✅ Benar
import { ScoreCard } from "@/components/ui/ScoreCard";
import type { WeeklyAudit } from "@/types/AuditTypes";
import { calculateScore } from "@/lib/scoring/engine";

// ❌ Salah
import { ScoreCard } from "../../components/ui/ScoreCard";
```

---

## 3. Git Workflow

### 3.1 Branch Strategy

```
main          → Production (protected, deploy ke Vercel prod)
  └── develop → Staging (protected, deploy ke preview)
        ├── feature/[nama-fitur]
        ├── fix/[nama-bug]
        ├── chore/[nama-task]
        └── hotfix/[nama-fix]   (dari main, merge ke main + develop)
```

### 3.2 Konvensi Commit Message

Format: `type(scope): deskripsi singkat`

| Type | Digunakan untuk |
|---|---|
| `feat` | Fitur baru |
| `fix` | Perbaikan bug |
| `refactor` | Refactoring tanpa perubahan fungsional |
| `style` | Perubahan styling/formatting |
| `test` | Tambah atau update test |
| `docs` | Perubahan dokumentasi |
| `chore` | Setup, konfigurasi, dependency |
| `perf` | Peningkatan performa |

```bash
# ✅ Contoh commit yang benar
git commit -m "feat(audit): tambah validasi durasi aktivitas minimum"
git commit -m "fix(scoring): perbaiki kalkulasi consistency score saat audit pertama"
git commit -m "docs(readme): update instruksi setup environment variables"
git commit -m "chore(deps): upgrade Next.js ke 14.2.0"

# ❌ Contoh commit yang salah
git commit -m "update"
git commit -m "fix bug"
git commit -m "banyak perubahan"
```

### 3.3 Alur Pull Request

```
1. Buat branch dari develop:
   git checkout develop && git pull
   git checkout -b feature/financial-audit-module

2. Kerjakan fitur dengan commit atomik yang jelas

3. Sebelum PR, selalu:
   npm run lint        # Pastikan tidak ada lint error
   npm run type-check  # Pastikan tidak ada type error
   npm run test        # Pastikan semua test pass

4. Push dan buat Pull Request ke develop

5. PR wajib memiliki:
   - Judul yang deskriptif
   - Deskripsi: apa yang berubah, mengapa, cara test
   - Link ke task/issue terkait
   - Screenshot (untuk perubahan UI)

6. Minimal 1 reviewer harus approve sebelum merge

7. Merge menggunakan Squash and Merge (untuk riwayat yang bersih)
```

### 3.4 PR Template

```markdown
## Perubahan yang Dilakukan
- [ ] [Deskripsi perubahan 1]
- [ ] [Deskripsi perubahan 2]

## Cara Test
1. [Langkah 1]
2. [Langkah 2]

## Screenshot (jika ada perubahan UI)
[Tambahkan screenshot di sini]

## Checklist
- [ ] Lint pass (`npm run lint`)
- [ ] Type check pass (`npm run type-check`)
- [ ] Unit test pass (`npm run test`)
- [ ] Tidak ada `console.log` yang tertinggal
- [ ] Tidak ada kode yang dikomentari tanpa penjelasan
```

---

## 4. Testing Strategy

### 4.1 Pyramid Testing

```
        [E2E Tests]           ← Sedikit, slow, high confidence
       /            \         Playwright — alur kritikal user
      /  [Integration]\      ← Sedang — API routes + DB
     /     Tests      \
    /                  \
   /    [Unit Tests]    \     ← Banyak, fast — fungsi bisnis & utils
  /______________________\
```

### 4.2 Unit Tests

Framework: **Jest** + **React Testing Library**

Fokus pengujian:
- Scoring engine functions
- Insight rule conditions
- Utility functions (formatDate, calculatePercent, dll.)
- Form validation (Zod schemas)

```typescript
// lib/scoring/__tests__/productivityScore.test.ts
import { calculateProductivityScore } from "../engine";

describe("calculateProductivityScore", () => {
  it("mengembalikan 0 jika tidak ada aktivitas", () => {
    expect(calculateProductivityScore([])).toBe(0);
  });

  it("mengembalikan skor rendah jika produktivitas < 30%", () => {
    const activities = [
      { duration: 100, productivity_type: "produktif" },
      { duration: 300, productivity_type: "non-produktif" },
    ];
    const score = calculateProductivityScore(activities);
    expect(score).toBeLessThan(40);
  });

  it("mengembalikan skor tinggi jika produktivitas > 80%", () => {
    const activities = [
      { duration: 400, productivity_type: "produktif" },
      { duration: 50, productivity_type: "non-produktif" },
    ];
    const score = calculateProductivityScore(activities);
    expect(score).toBeGreaterThanOrEqual(80);
  });
});
```

### 4.3 Integration Tests

Fokus pengujian:
- API routes (dengan Supabase mock)
- Auth flow (login, logout, register)
- Database operations (CRUD)

```typescript
// app/api/audit/__tests__/route.test.ts
import { POST } from "../route";

describe("POST /api/audit", () => {
  it("menolak request tanpa autentikasi", async () => {
    const request = new Request("http://localhost/api/audit", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const response = await POST(request);
    expect(response.status).toBe(401);
  });

  it("menolak payload yang tidak valid", async () => {
    // ... test dengan auth mock
    const response = await POST(authenticatedRequest({ week_start_date: "invalid" }));
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });
});
```

### 4.4 End-to-End Tests (Playwright)

Fokus pengujian — alur kritikal pengguna:

```typescript
// e2e/weekly-audit.spec.ts
import { test, expect } from "@playwright/test";

test("pengguna dapat mengisi dan submit weekly audit", async ({ page }) => {
  await page.goto("/login");
  await page.fill('[name="email"]', "test@auditlife.app");
  await page.fill('[name="password"]', "Test1234!");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/dashboard");

  await page.click("text=Weekly Audit");
  await page.selectOption('[name="category"]', "Belajar");
  await page.fill('[name="duration"]', "120");
  await page.fill('[name="description"]', "Belajar Next.js");
  await page.click("text=Tambah Aktivitas");

  await expect(page.locator(".activity-list")).toContainText("Belajar");
  await page.click("text=Submit Audit");
  await expect(page).toHaveURL("/dashboard");
  await expect(page.locator(".score-card")).toBeVisible();
});
```

### 4.5 Coverage Target

| Layer | Coverage Target |
|---|---|
| Scoring Engine | ≥ 90% |
| Insight Rules | ≥ 85% |
| API Routes | ≥ 80% |
| UI Components | ≥ 60% |
| Overall | ≥ 75% |

---

## 5. Deployment Guide

### 5.1 Environment

| Environment | Branch | URL | Database |
|---|---|---|---|
| Development | Local | `localhost:3000` | Supabase local / dev project |
| Staging | `develop` | `develop.auditlife.vercel.app` | Supabase staging project |
| Production | `main` | `auditlife.app` | Supabase production project |

### 5.2 Environment Variables per Environment

Setiap environment memiliki set environment variables terpisah di Vercel Dashboard.  
Jangan pernah gunakan kredensial production untuk development.

### 5.3 Deployment Checklist (Pre-Production)

```
[ ] Semua unit test pass
[ ] Semua E2E test kritikal pass
[ ] Tidak ada console.log yang tertinggal di kode
[ ] Environment variables production sudah dikonfigurasi di Vercel
[ ] Migrasi database sudah dijalankan di Supabase production
[ ] Backup database production sudah dilakukan
[ ] Performance audit (Lighthouse score ≥ 85 untuk mobile)
[ ] Tidak ada dependency dengan known security vulnerability (npm audit)
[ ] CHANGELOG.md sudah diupdate
[ ] PR sudah di-review dan diapprove
```

### 5.4 Database Migration Workflow

```bash
# Buat migrasi baru
npx supabase migration new nama_migrasi

# Jalankan migrasi di lokal
npx supabase db push

# Jalankan migrasi di production (via Supabase Dashboard atau CLI)
npx supabase db push --db-url $PRODUCTION_DB_URL
```

### 5.5 Rollback Strategy

```
Jika terjadi masalah setelah deployment:

1. CEPAT: Revert deployment di Vercel Dashboard
   (Vercel menyimpan history deployment untuk instant rollback)

2. DATABASE: Jika ada migrasi yang bermasalah:
   - Jalankan migration down (rollback SQL)
   - Restore dari backup jika diperlukan

3. KOMUNIKASI: Update status di internal channel tim
```

---

## 6. Tools & Extensions yang Direkomendasikan

### VS Code Extensions

```json
// .vscode/extensions.json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "Prisma.prisma",
    "supabase.supabase-vscode",
    "github.copilot",
    "eamodio.gitlens"
  ]
}
```

### VS Code Settings

```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### Useful Scripts

```bash
# Development
npm run dev          # Start dev server
npm run dev:debug    # Dev dengan debug mode

# Quality
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run type-check   # TypeScript check
npm run format       # Prettier format semua file

# Testing
npm run test              # Jest unit test (watch mode)
npm run test:ci           # Jest untuk CI (no watch)
npm run test:coverage     # Test dengan coverage report
npm run test:e2e          # Playwright E2E test
npm run test:e2e:ui       # Playwright dengan UI mode

# Database
npm run db:push      # Push schema ke Supabase
npm run db:seed      # Seed data awal
npm run db:reset     # Reset database lokal

# Build
npm run build        # Production build
npm run analyze      # Bundle analyzer
```

---

*AuditLife v1.0 · DEV_GUIDE.md · Dibaca oleh: Developer*
# AuditLife — Platform Self-Audit & Life Insight

> Sistem self-audit berbasis data yang membantu pengguna memahami, mengevaluasi, dan meningkatkan kualitas hidup secara berkelanjutan.

**Versi:** 1.0  
**Status:** In Development  
**Tech Stack:** Next.js 14 · Supabase PostgreSQL · Vercel  

---

## Daftar Isi

1. [Tentang Proyek](#tentang-proyek)
2. [Fitur Utama](#fitur-utama)
3. [Prasyarat](#prasyarat)
4. [Instalasi & Setup Lokal](#instalasi--setup-lokal)
5. [Struktur Folder](#struktur-folder)
6. [Environment Variables](#environment-variables)
7. [Menjalankan Aplikasi](#menjalankan-aplikasi)
8. [Deployment](#deployment)
9. [Changelog](#changelog)
10. [Kontributor](#kontributor)

---

## Tentang Proyek

AuditLife adalah aplikasi web yang dirancang untuk membantu pengguna melakukan *self-audit* kehidupan secara berkala. Sistem ini mengintegrasikan pencatatan aktivitas, analisis pola perilaku berbasis AI (rule-based), dan refleksi diri terstruktur.

**Pendekatan utama:**
- Data-driven configuration — semua komponen audit dapat dikonfigurasi tanpa mengubah kode
- Multi-dimensional scoring — penilaian dari berbagai aspek kehidupan
- Private by design — data pengguna terlindungi dengan Row Level Security (RLS)

---

## Fitur Utama

| Modul | Deskripsi |
|---|---|
| Weekly Audit | Pencatatan aktivitas dan alokasi waktu mingguan |
| Analytics Dashboard | Visualisasi distribusi waktu dan tren produktivitas |
| AI Insight | Analisis pola kebiasaan dan rekomendasi berbasis rule-based AI |
| Reflection | Refleksi diri terstruktur dengan guided questions |
| Scoring System | Skor multidimensi: Productivity, Time Management, Consistency, dll |
| Spiritual Reflection | Jurnal syukur dan niat mingguan (privat, tanpa skor) |
| Financial Audit | Pencatatan dan analisis pola keuangan harian |

---

## Prasyarat

Pastikan sudah terinstall di mesin lokal Anda:

- **Node.js** >= 18.17.0
- **npm** >= 9.x atau **pnpm** >= 8.x
- **Git**
- Akun **Supabase** (untuk database dan auth)
- Akun **Vercel** (untuk deployment, opsional di lokal)

---

## Instalasi & Setup Lokal

### 1. Clone Repository

```bash
git clone https://github.com/your-org/auditlife.git
cd auditlife
```

### 2. Install Dependencies

```bash
npm install
# atau
pnpm install
```

### 3. Setup Environment Variables

Salin file `.env.example` menjadi `.env.local`:

```bash
cp .env.example .env.local
```

Isi nilai yang dibutuhkan (lihat bagian [Environment Variables](#environment-variables)).

### 4. Setup Database Supabase

Jalankan migrasi database:

```bash
npx supabase db push
```

Atau jalankan file SQL migrasi secara manual melalui Supabase Dashboard di folder:

```
/supabase/migrations/
```

### 5. Seed Data Awal (Opsional)

```bash
npm run db:seed
```

---

## Struktur Folder

```
auditlife/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Route group: Login & Register
│   ├── (dashboard)/            # Route group: Halaman utama app
│   │   ├── dashboard/          # Dashboard utama
│   │   ├── audit/              # Weekly Audit input
│   │   ├── insight/            # AI Insight & Analisis
│   │   ├── reflection/         # Modul Refleksi
│   │   ├── history/            # Riwayat Audit
│   │   ├── financial/          # Financial Audit
│   │   └── spiritual/          # Spiritual Reflection (privat)
│   ├── admin/                  # Halaman Admin
│   └── api/                    # API Routes
│       ├── audit/
│       ├── insight/
│       ├── scoring/
│       ├── financial/
│       └── reflection/
├── components/                 # Komponen React
│   ├── ui/                     # shadcn/ui base components
│   ├── charts/                 # Recharts wrappers
│   ├── forms/                  # Form components
│   └── layout/                 # Layout components (Sidebar, Header)
├── lib/                        # Utilities & helpers
│   ├── supabase/               # Supabase client & server
│   ├── scoring/                # Scoring engine logic
│   ├── insight/                # Rule-based AI insight engine
│   └── utils/                  # General utilities
├── supabase/
│   ├── migrations/             # Database migration files
│   └── seed.sql                # Seed data
├── types/                      # TypeScript type definitions
├── hooks/                      # Custom React hooks
├── .env.example
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## Environment Variables

Buat file `.env.local` di root project dengan variabel berikut:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AuditLife

# Auth (OAuth)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI / Insight Engine (jika menggunakan external LLM di masa depan)
# OPENAI_API_KEY=your-openai-key  # Fase 5+
```

> **Catatan:** Jangan pernah commit file `.env.local` ke repository. File ini sudah ada di `.gitignore`.

---

## Menjalankan Aplikasi

### Development

```bash
npm run dev
```

Aplikasi berjalan di: `http://localhost:3000`

### Build Production

```bash
npm run build
npm run start
```

### Linting & Type Check

```bash
npm run lint
npm run type-check
```

### Testing

```bash
npm run test           # Unit test (Jest)
npm run test:e2e       # End-to-end test (Playwright)
npm run test:coverage  # Coverage report
```

---

## Deployment

Aplikasi ini di-deploy ke **Vercel** secara otomatis melalui CI/CD dari branch `main`.

### Manual Deploy

```bash
vercel deploy --prod
```

### Branch Strategy

| Branch | Environment | Keterangan |
|---|---|---|
| `main` | Production | Auto-deploy ke Vercel |
| `develop` | Staging | Preview deployment |
| `feature/*` | Preview | Per-PR preview URL |

Detail lengkap ada di `DEV_GUIDE.md`.

---

## Changelog

### v1.0.0 — 2026
- Initial release
- Weekly Audit Module (CRUD aktivitas)
- Analytics Dashboard (pie chart, bar chart, trend)
- Scoring System (Productivity, Time Management, Consistency)
- Reflection Module
- Financial Audit Module
- Role-based access: User, Admin, Super Admin
- Supabase Auth dengan Google OAuth

---

## Kontributor

| Nama | Role |
|---|---|
| — | Product Owner |
| — | Lead Developer |
| — | AI Engineer |
| — | UI/UX Designer |

---

*AuditLife v1.0 · 2026 · Dokumen Rahasia dan Terbatas*
# SECURITY.md — AuditLife

> Kebijakan keamanan, incident response, backup & recovery, monitoring, dan runbook operasional.  
> Dibaca oleh: **Developer + DevOps**

---

## Daftar Isi

1. [Kebijakan Keamanan](#1-kebijakan-keamanan)
2. [Autentikasi & Otorisasi](#2-autentikasi--otorisasi)
3. [Keamanan Data](#3-keamanan-data)
4. [Monitoring & Alerting](#4-monitoring--alerting)
5. [Backup & Recovery](#5-backup--recovery)
6. [Incident Response](#6-incident-response)
7. [Runbook Operasional](#7-runbook-operasional)

---

## 1. Kebijakan Keamanan

### 1.1 Prinsip Keamanan

| Prinsip | Implementasi |
|---|---|
| **Least Privilege** | Setiap komponen hanya memiliki akses minimum yang dibutuhkan |
| **Defense in Depth** | Keamanan berlapis: auth → RLS → validasi input → rate limiting |
| **Secure by Default** | Konfigurasi default selalu aman; fitur harus di-opt-in, bukan di-opt-out |
| **Zero Trust** | Setiap request divalidasi ulang, tidak ada kepercayaan implisit |
| **Fail Secure** | Jika terjadi error, sistem menolak akses (bukan membuka akses) |

### 1.2 Dependency Security

```bash
# Jalankan setiap minggu dan sebelum setiap release
npm audit

# Auto-fix dependency yang aman
npm audit fix

# Cek dependency yang outdated
npm outdated
```

- Dependency dengan **high/critical vulnerability** wajib diupdate dalam **48 jam**.
- Dependency dengan **moderate vulnerability** wajib diupdate dalam **7 hari**.
- Gunakan **Dependabot** (GitHub) untuk auto-PR update dependency.

### 1.3 Secret Management

- **Tidak boleh ada** secret, API key, atau password dalam kode atau git history.
- Semua secret disimpan di **Vercel Environment Variables** (production) dan file `.env.local` (lokal, sudah di `.gitignore`).
- Rotasi API key secara berkala: setiap **90 hari** untuk key produksi.

```bash
# Cek apakah ada secret yang tidak sengaja di-commit
git log --all --full-history -- '*.env'
npx detect-secrets scan
```

---

## 2. Autentikasi & Otorisasi

### 2.1 JWT Token

- Token diterbitkan oleh **Supabase Auth** menggunakan RS256
- **Access token** kedaluwarsa dalam **1 jam**
- **Refresh token** kedaluwarsa dalam **7 hari**
- Token di-store di **httpOnly cookie** (bukan localStorage) untuk mencegah XSS

### 2.2 Middleware Proteksi Route

```typescript
// middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();

  // Halaman yang membutuhkan autentikasi
  const protectedPaths = ["/dashboard", "/audit", "/insight", "/reflection", "/financial"];
  const isProtectedPath = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path));

  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Halaman Admin
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!session || !["admin", "super_admin"].includes(session.user.user_metadata.role)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return res;
}
```

### 2.3 Rate Limiting

| Endpoint | Limit | Window |
|---|---|---|
| `POST /api/auth/login` | 5 request | Per 15 menit per IP |
| `POST /api/auth/register` | 3 request | Per jam per IP |
| `POST /api/auth/reset-password` | 3 request | Per jam per email |
| API umum (authenticated) | 100 request | Per menit per user |
| API admin | 200 request | Per menit per admin |

```typescript
// lib/rateLimit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const loginRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  prefix: "rl:login",
});
```

### 2.4 Input Validation & Sanitization

- Semua input divalidasi dengan **Zod** sebelum diproses
- Output ke HTML menggunakan React (otomatis XSS-safe)
- Query ke database menggunakan **parameterized queries** via Supabase client (mencegah SQL injection)
- File upload divalidasi: tipe file, ukuran, dan konten

---

## 3. Keamanan Data

### 3.1 Enkripsi

| Data | Enkripsi | Keterangan |
|---|---|---|
| Transit (client ↔ server) | TLS 1.3 | Enforced oleh Vercel |
| Database at rest | AES-256 | Dihandle Supabase |
| Password pengguna | bcrypt (cost factor 12) | Dihandle Supabase Auth |
| Data spiritual | RLS + no admin access | Privat penuh |

### 3.2 Row Level Security (RLS) — Implementasi Lengkap

```sql
-- === USERS TABLE ===
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = user_id);

-- Admin bisa lihat semua user (read-only)
CREATE POLICY "admin_select_all_users" ON users
  FOR SELECT USING (
    (SELECT role FROM users WHERE user_id = auth.uid()) IN ('admin', 'super_admin')
  );

-- === WEEKLY_AUDITS TABLE ===
ALTER TABLE weekly_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audits_own_access" ON weekly_audits
  FOR ALL USING (auth.uid() = user_id);

-- === SPIRITUAL_REFLECTIONS TABLE ===
ALTER TABLE spiritual_reflections ENABLE ROW LEVEL SECURITY;

-- HANYA pemilik yang bisa akses — tidak ada exception untuk admin
CREATE POLICY "spiritual_strictly_private" ON spiritual_reflections
  FOR ALL USING (auth.uid() = user_id);

-- === FINANCIAL_RECORDS TABLE ===
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "financial_own_access" ON financial_records
  FOR ALL USING (auth.uid() = user_id);
```

### 3.3 Security Headers

```typescript
// next.config.js
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",  // unsafe-eval untuk Next.js dev
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://*.supabase.co",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    ].join("; "),
  },
];
```

---

## 4. Monitoring & Alerting

### 4.1 Metrics yang Dipantau

| Metrik | Threshold Alert | Severity |
|---|---|---|
| Uptime | < 99.5% dalam 5 menit | Critical |
| Response time P95 | > 2000ms selama 5 menit | Warning |
| Response time P99 | > 5000ms | Critical |
| Error rate (5xx) | > 1% dalam 5 menit | Warning |
| Error rate (5xx) | > 5% dalam 5 menit | Critical |
| Login failure rate | > 20 gagal/menit per IP | Warning (possible brute force) |
| Database connection | Timeout atau connection refused | Critical |

### 4.2 Logging Strategy

```typescript
// lib/logger.ts
type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  user_id?: string;
  request_id?: string;
  metadata?: Record<string, unknown>;
}

export function log(level: LogLevel, message: string, metadata?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...metadata,
  };
  
  // Di production: kirim ke logging service
  // Di development: console.log
  if (process.env.NODE_ENV === "production") {
    // Kirim ke Vercel Log Drains atau external logging service
    console.log(JSON.stringify(entry));
  } else {
    console.log(`[${level.toUpperCase()}] ${message}`, metadata);
  }
}
```

### 4.3 Alert Channels

| Severity | Channel | Response Time Target |
|---|---|---|
| Critical | WhatsApp + Email | < 15 menit |
| Warning | Email | < 2 jam |
| Info | Dashboard saja | Review harian |

---

## 5. Backup & Recovery

### 5.1 Strategi Backup

| Jenis Backup | Frekuensi | Retensi | Storage |
|---|---|---|---|
| Database full backup | Harian (02:00 WIB) | 30 hari | Supabase (otomatis) |
| Database point-in-time | Continuous (WAL) | 7 hari | Supabase Pro |
| Storage files | Harian | 14 hari | Supabase Storage |
| Environment config | Manual (setelah perubahan) | Permanent | Password manager |

### 5.2 Recovery Time Objective (RTO) & Recovery Point Objective (RPO)

| Skenario | RTO Target | RPO Target |
|---|---|---|
| Server down (Vercel issue) | < 5 menit | 0 (stateless frontend) |
| Database corruption | < 2 jam | < 24 jam (daily backup) |
| Accidental data deletion | < 1 jam | < 1 jam (PITR) |
| Full disaster recovery | < 4 jam | < 24 jam |

### 5.3 Prosedur Restore Database

```bash
# 1. Melalui Supabase Dashboard
# Dashboard → Project Settings → Database → Backups → Restore

# 2. Via CLI (Point-in-Time Recovery)
npx supabase db restore --backup-id [backup-id]

# 3. Manual restore dari dump
pg_restore -h [host] -U [user] -d [database] backup.dump

# Verifikasi setelah restore:
# - Cek jumlah record di tabel utama
# - Test login dengan akun test
# - Test submit audit
# - Verifikasi RLS masih aktif
```

---

## 6. Incident Response

### 6.1 Klasifikasi Insiden

| Level | Kriteria | Contoh |
|---|---|---|
| **P1 — Critical** | Sistem down atau data breach | Database tidak bisa diakses, kebocoran data massal |
| **P2 — High** | Fitur utama tidak berfungsi | Login gagal semua user, audit tidak bisa di-submit |
| **P3 — Medium** | Fitur sebagian tidak berfungsi | Chart tidak tampil, insight tidak muncul |
| **P4 — Low** | Bug minor | Typo UI, format tanggal salah |

### 6.2 Alur Respons Insiden

```
DETEKSI (monitoring alert / laporan user)
        ↓
TRIAGE (5 menit)
  - Tentukan level P1/P2/P3/P4
  - Siapa yang di-assign?
        ↓
CONTAINMENT (P1: 15 menit, P2: 1 jam)
  - Isolasi komponen bermasalah
  - Jika P1: pertimbangkan maintenance mode
        ↓
KOMUNIKASI
  - Internal: update tim di channel khusus
  - Eksternal (P1/P2): update status page
        ↓
INVESTIGASI & REMEDIATION
  - Root cause analysis
  - Deploy fix
  - Verifikasi fix
        ↓
POST-MORTEM (dalam 48 jam)
  - Apa yang terjadi?
  - Apa dampaknya?
  - Kenapa terjadi?
  - Apa yang sudah dilakukan?
  - Apa yang akan dicegah di masa depan?
```

### 6.3 Maintenance Mode

```typescript
// Aktifkan maintenance mode via environment variable
// NEXT_PUBLIC_MAINTENANCE_MODE=true

// middleware.ts
if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true") {
  if (req.nextUrl.pathname !== "/maintenance") {
    return NextResponse.redirect(new URL("/maintenance", req.url));
  }
}
```

---

## 7. Runbook Operasional

### 7.1 Deploy Production

```bash
# 1. Pastikan semua test pass
npm run test:ci && npm run test:e2e

# 2. Update CHANGELOG.md

# 3. Merge PR ke main via GitHub

# 4. Vercel otomatis deploy (pantau di Vercel Dashboard)

# 5. Setelah deploy, lakukan smoke test:
#    - Buka auditlife.app
#    - Coba login
#    - Submit dummy audit
#    - Cek dashboard dan insight
```

### 7.2 Rollback Production

```bash
# Via Vercel Dashboard:
# Deployments → Pilih deployment sebelumnya → Promote to Production

# Atau via CLI:
vercel rollback [deployment-url]
```

### 7.3 Check System Health

```bash
# Cek status Supabase
curl https://your-project.supabase.co/rest/v1/ \
  -H "apikey: $SUPABASE_ANON_KEY"

# Cek jumlah user aktif (query ke database)
SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '7 days';

# Cek audit yang gagal diproses
SELECT * FROM weekly_audits
WHERE status = 'submitted'
AND scores IS NULL
AND created_at < NOW() - INTERVAL '1 hour';
```

### 7.4 Rotasi API Keys

```bash
# 1. Generate key baru di Supabase Dashboard
# 2. Update di Vercel Environment Variables (production)
# 3. Trigger redeploy agar key baru aktif
# 4. Verifikasi sistem masih berfungsi
# 5. Invalidate key lama di Supabase
# 6. Dokumentasikan di log rotasi key (internal)
```

### 7.5 User Support — Reset Password Manual

```sql
-- Jika user tidak menerima email reset password
-- Lakukan via Supabase Dashboard → Authentication → Users → [email user] → Send password reset
-- JANGAN pernah mengubah password user secara langsung di database
```

---

*AuditLife v1.0 · SECURITY.md · Dibaca oleh: Developer + DevOps*
