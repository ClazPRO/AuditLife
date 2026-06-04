"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type AuditRecord = {
  audit_id: string;
  week_start_date: string;
  week_end_date: string;
  total_time: number;
  summary: string | null;
  created_at: string;
};

export function AuditTable({ records }: { records: AuditRecord[] }) {
  if (records.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground border rounded-lg bg-muted/20">
        Belum ada riwayat audit mingguan. Catat aktivitas Anda di atas!
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Periode</TableHead>
            <TableHead>Total Durasi</TableHead>
            <TableHead>Ringkasan</TableHead>
            <TableHead className="text-right">Dibuat Pada</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.audit_id}>
              <TableCell className="font-medium">
                {new Date(record.week_start_date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })} 
                {" - "} 
                {new Date(record.week_end_date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {Math.floor(record.total_time / 60)}j {record.total_time % 60}m
                </Badge>
              </TableCell>
              <TableCell className="max-w-[200px] truncate" title={record.summary || ""}>
                {record.summary || "-"}
              </TableCell>
              <TableCell className="text-right text-muted-foreground text-sm">
                {new Date(record.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
