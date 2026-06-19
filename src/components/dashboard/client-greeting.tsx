"use client";

import { useEffect, useState } from "react";

export function ClientGreeting() {
  // Gunakan fallback "Halo" agar tidak terjadi hydration mismatch sebelum useEffect jalan
  const [greeting, setGreeting] = useState("Halo");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 11) {
      setGreeting("Selamat Pagi");
    } else if (hour < 15) {
      setGreeting("Selamat Siang");
    } else if (hour < 18) {
      setGreeting("Selamat Sore");
    } else {
      setGreeting("Selamat Malam");
    }
  }, []);

  return (
    <p className="text-[11px] text-primary font-semibold tracking-wider uppercase mb-1">
      {greeting} 👋
    </p>
  );
}
