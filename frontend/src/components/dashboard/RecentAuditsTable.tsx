"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  type ColumnDef,
} from "@tanstack/react-table";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, Download, AlertCircle } from "lucide-react";
import type { ReconciliationResult } from "@/lib/types";
import { RISK_COLORS } from "@/lib/constants";

interface RecentAuditsTableProps {
  data: ReconciliationResult[];
}

export default function RecentAuditsTable({ data }: RecentAuditsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<ReconciliationResult>[] = [
    {
      accessorKey: "session_id",
      header: "Session ID",
      cell: (info) => (
        <span className="font-mono text-xs text-slate-600">
          {(info.getValue() as string).slice(0, 8)}...
        </span>
      ),
    },
    {
      accessorKey: "lorry_receipt.vendor_name",
      header: "Vendor",
      cell: (info) => {
        const row = info.row.original;
        return <span className="font-medium">{row.lorry_receipt.vendor_name || "—"}</span>;
      },
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: (info) => {
        const date = new Date(info.getValue() as string);
        return (
          <span className="text-sm text-muted-foreground">
            {date.toLocaleDateString("en-IN")}
          </span>
        );
      },
    },
    {
      accessorKey: "overall_match_score",
      header: "Match Rate",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-blue-600">{String(info.getValue())}%</span>
          <div className="h-1 w-12 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full bg-linear-to-r from-blue-400 to-blue-600"
              style={{ width: `${(info.getValue() as number) / 100}` }}
            />
          </div>
        </div>
      ),
    },
    {
      accessorKey: "risk_level",
      header: "Risk",
      cell: (info) => {
        const level = info.getValue() as string;
        const colors = RISK_COLORS[level] || RISK_COLORS.low;
        return (
          <Badge variant="secondary" className={`${colors.bg} ${colors.text} border-0`}>
            {(level || "").toUpperCase()}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const status = info.getValue() as string;
        const statusColors: Record<string, string> = {
          completed: "bg-emerald-100 text-emerald-900",
          flagged: "bg-red-100 text-red-900",
          processing: "bg-blue-100 text-blue-900",
          pending: "bg-slate-100 text-slate-900",
        };
        return (
          <Badge variant="outline" className={statusColors[status] || statusColors.pending}>
            {(status || "").charAt(0).toUpperCase() + (status || "").slice(1)}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const row = info.row.original;
        const hasHighRisk = row.risk_level === "high" || row.risk_level === "critical";
        return (
          <div className="flex items-center gap-2">
            {hasHighRisk && (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            <Link
              href={`/reconciliation/${row.session_id}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Eye className="h-4 w-4" />
            </Link>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <Card className="border-0 bg-linear-to-br from-slate-50 to-white shadow-xl">
      <CardHeader className="border-b border-slate-200/50 pb-4">
        <CardTitle className="text-lg">Recent Audits</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50/50">
                {table.getHeaderGroups().map((headerGroup) =>
                  headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="cursor-pointer select-none px-6 py-4 text-left font-medium text-slate-700 hover:bg-slate-100/50"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span className="text-xs text-slate-400">
                            {{
                              asc: "↑",
                              desc: "↓",
                            }[header.column.getIsSorted() as string] ?? "⇅"}
                          </span>
                        )}
                      </div>
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, idx) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group border-b border-slate-100 transition-colors hover:bg-slate-50/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length} audits
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
