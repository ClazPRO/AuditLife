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
  const [locationName, setLocationName] = useState("Jakarta, Indonesia");
  const [coords, setCoords] = useState<{lat: number, lon: number} | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lon: longitude });
          
          try {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const geoData = await geoRes.json();
            const city = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.county || "Lokasi Anda";
            setLocationName(`${city}, ${geoData.address.country || "Indonesia"}`);
          } catch (e) {
            setLocationName("Lokasi Anda");
          }
        },
        (error) => {
          console.warn("Geolocation denied or error:", error);
          // Tetap gunakan default Jakarta
          setCoords({ lat: -6.2088, lon: 106.8456 }); // Jakarta coords
        }
      );
    } else {
      setCoords({ lat: -6.2088, lon: 106.8456 });
    }
  }, []);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      if (!coords) return; // Wait for coords to be set

      try {
        setLoading(true);
        const url = `https://api.aladhan.com/v1/timings?latitude=${coords.lat}&longitude=${coords.lon}&method=11`;
        
        const response = await fetch(url);
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
  }, [coords]);

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
              <MapPin className="h-3 w-3" /> {locationName}
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
