"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, MapPin, Loader2 } from "lucide-react";

interface PrayerTimesData {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export function PrayerTimes() {
  const [times, setTimes] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("Jakarta");

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        setLoading(true);
        // Using Aladhan API for prayer times
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Indonesia&method=11`);
        const data = await response.json();
        
        if (data && data.data && data.data.timings) {
          const { Fajr, Dhuhr, Asr, Maghrib, Isha } = data.data.timings;
          setTimes({ Fajr, Dhuhr, Asr, Maghrib, Isha });
        }
      } catch (error) {
        console.error("Failed to fetch prayer times:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, [city]);

  return (
    <Card className="border-white/5 bg-gradient-to-br from-emerald-900/20 to-emerald-900/5 relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <CardTitle className="text-lg flex items-center gap-2 text-emerald-400">
              <Clock className="h-5 w-5" /> Jadwal Shalat
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1 text-xs">
              <MapPin className="h-3 w-3" /> {city}, Indonesia
            </CardDescription>
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
          </div>
        ) : times ? (
          <div className="grid grid-cols-5 gap-2 text-center">
            <div className="flex flex-col p-2 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Subuh</span>
              <span className="font-bold text-sm text-foreground">{times.Fajr}</span>
            </div>
            <div className="flex flex-col p-2 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Dzuhur</span>
              <span className="font-bold text-sm text-foreground">{times.Dhuhr}</span>
            </div>
            <div className="flex flex-col p-2 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Ashar</span>
              <span className="font-bold text-sm text-foreground">{times.Asr}</span>
            </div>
            <div className="flex flex-col p-2 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Maghrib</span>
              <span className="font-bold text-sm text-foreground">{times.Maghrib}</span>
            </div>
            <div className="flex flex-col p-2 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Isya</span>
              <span className="font-bold text-sm text-foreground">{times.Isha}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-sm text-muted-foreground">
            Gagal memuat jadwal shalat.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
