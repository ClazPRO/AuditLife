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
    } catch (error) {
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead className="text-right">Jumlah</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => {
            const dateObj = new Date(record.date);
            const dateStr = new Intl.DateTimeFormat("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).format(dateObj);

            return (
              <TableRow key={record.record_id}>
                <TableCell>{dateStr}</TableCell>
                <TableCell className="font-medium">{record.category}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getTypeColor(record.type)}>
                    {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground max-w-[200px] truncate">
                  {record.description || "-"}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  Rp {Number(record.amount).toLocaleString("id-ID")}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                    onClick={() => handleDelete(record.record_id)}
                    disabled={isDeleting === record.record_id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
