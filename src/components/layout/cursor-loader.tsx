"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function CursorLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Reset kursor kembali ke normal setelah halaman selesai dimuat (URL berubah)
  useEffect(() => {
    document.body.style.cursor = "default";
  }, [pathname, searchParams]);

  // Tambahkan event listener untuk mendeteksi klik pada semua link (menu samping)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as Element).closest("a");
      if (target && target.href && target.target !== "_blank") {
        const isInternal =
          target.href.startsWith(window.location.origin) ||
          target.href.startsWith("/");
          
        if (isInternal) {
          document.body.style.cursor = "wait";
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
