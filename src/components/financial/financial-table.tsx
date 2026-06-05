"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteFinancialRecord } from "@/app/(dashboard)/financial/actions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type RecordType = {
  record_id: string;
  date: string;
  category: string;
  amount: number;
  type: string;
  description: string | null;
};

export function FinancialTable({ records }: { records: RecordType[] }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async (recordId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    
    setIsDeleting(recordId);
    try {
      const result = await deleteFinancialRecord(recordId);
      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sukses",
          description: "Data berhasil dihapus.",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Terjadi kesalahan sistem.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "income": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200";
      case "need": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "want": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "investment": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-semibold">Belum Ada Data</h3>
        <p className="text-muted-foreground mt-2">
          Anda belum menambahkan catatan keuangan apapun. Mulai kelola keuangan Anda sekarang!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Cards View */}
      <div className="grid gap-3">
        {records.map((record) => {
          const dateObj = new Date(record.date);
          const dateStr = new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(dateObj);

          return (
            <div 
              key={record.record_id} 
              className="flex flex-col p-4 rounded-xl border border-white/5 bg-card/30 backdrop-blur-md relative hover:bg-card/45 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground">{dateStr}</span>
                  <span className="font-semibold text-foreground text-sm">{record.category}</span>
                </div>
                <Badge variant="outline" className={getTypeColor(record.type)}>
                  {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                </Badge>
              </div>

              {record.description && (
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2 italic">
                  &ldquo;{record.description}&rdquo;
                </p>
              )}

              <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1">
                <span className="text-sm font-semibold text-foreground">
                  Rp {Number(record.amount).toLocaleString("id-ID")}
                </span>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 text-red-500 hover:text-red-400 hover:bg-red-500/10 gap-1.5 px-3 rounded-lg text-xs"
                  onClick={() => handleDelete(record.record_id)}
                  disabled={isDeleting === record.record_id}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Hapus
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  );
}
