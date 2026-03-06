"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { MATCH_COLORS } from "@/lib/constants";
import type { FieldComparison, LineItemMatch } from "@/lib/types";

interface ThreeWayCompareProps {
  comparisons: FieldComparison[];
  lineItems: LineItemMatch[];
}

export default function ThreeWayCompare({
  comparisons,
  lineItems,
}: ThreeWayCompareProps) {
  return (
    <div className="space-y-6">
      {/* Field Comparison Table */}
      <div className="overflow-hidden rounded-xl border">
        <div className="bg-muted/50 px-4 py-3">
          <h3 className="text-sm font-semibold">Field-by-Field Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Field
                </th>
                <th className="px-4 py-3 text-left font-medium text-blue-600">
                  Lorry Receipt
                </th>
                <th className="px-4 py-3 text-left font-medium text-violet-600">
                  Proof of Delivery
                </th>
                <th className="px-4 py-3 text-left font-medium text-amber-600">
                  Invoice
                </th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((comp, i) => {
                const colors = MATCH_COLORS[comp.match_status];
                return (
                  <motion.tr
                    key={comp.field_name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`border-b transition-colors ${colors.bg}`}
                  >
                    <td className="px-4 py-3 font-medium">
                      {comp.display_name}
                      {comp.deviation_percent != null &&
                        comp.deviation_percent > 0 && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({comp.deviation_percent}% dev)
                          </span>
                        )}
                    </td>
                    <td className="px-4 py-3">{comp.lr_value || "—"}</td>
                    <td className="px-4 py-3">{comp.pod_value || "—"}</td>
                    <td className="px-4 py-3">{comp.invoice_value || "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${colors.badge}`}
                      >
                        {comp.match_status.toUpperCase()}
                      </Badge>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Line Item Comparison */}
      {lineItems.length > 0 && (
        <div className="overflow-hidden rounded-xl border">
          <div className="bg-muted/50 px-4 py-3">
            <h3 className="text-sm font-semibold">Line Item Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Item
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-blue-600">
                    LR Qty
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-violet-600">
                    POD Qty
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-amber-600">
                    Invoice Qty
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                    Qty Match
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                    Amount Match
                  </th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: comparisons.length * 0.05 + i * 0.05 }}
                    className={`border-b ${
                      !item.quantity_match || !item.amount_match
                        ? "bg-red-50"
                        : "bg-green-50"
                    }`}
                  >
                    <td className="px-4 py-3 font-medium">
                      {item.lr_item.description}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.lr_item.quantity ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.pod_item?.quantity ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.invoice_item?.quantity ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          item.quantity_match
                            ? MATCH_COLORS.matched.badge
                            : MATCH_COLORS.mismatched.badge
                        }`}
                      >
                        {item.quantity_match ? "MATCH" : "MISMATCH"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          item.amount_match
                            ? MATCH_COLORS.matched.badge
                            : MATCH_COLORS.mismatched.badge
                        }`}
                      >
                        {item.amount_match ? "MATCH" : "MISMATCH"}
                      </Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
