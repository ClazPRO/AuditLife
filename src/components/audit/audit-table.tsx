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
    <div className="space-y-4">
      {/* Mobile view (cards) */}
      <div className="grid gap-3 sm:hidden">
        {records.map((record) => (
          <div 
            key={record.audit_id}
            className="flex flex-col p-4 rounded-xl border border-white/5 bg-card/30 backdrop-blur-md hover:bg-card/45 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-muted-foreground">Periode Audit</span>
                <span className="font-semibold text-foreground text-xs">
                  {new Date(record.week_start_date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })} 
                  {" - "} 
                  {new Date(record.week_end_date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                {Math.floor(record.total_time / 60)}j {record.total_time % 60}m
              </Badge>
            </div>

            {record.summary && (
              <p className="text-xs text-muted-foreground mb-3 line-clamp-3 bg-white/[0.01] p-2 rounded-lg border border-white/5">
                {record.summary}
              </p>
            )}

            <div className="flex items-center justify-between border-t border-white/5 pt-2 text-[10px] text-muted-foreground">
              <span>Dibuat Pada</span>
              <span>
                {new Date(record.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop view (table) */}
      <div className="hidden sm:block rounded-md border overflow-hidden">
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
    </div>
  );
}
