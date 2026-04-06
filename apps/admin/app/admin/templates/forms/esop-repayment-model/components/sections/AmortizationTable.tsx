"use client";

import React from "react";
import { AmortizationRow } from "../../types";
import { fmt, fmtX, getDscrColor } from "../../lib";

interface AmortizationTableProps {
  rows: AmortizationRow[];
}

export function AmortizationTable({ rows }: AmortizationTableProps) {
  // Calculate totals
  const totals = rows.reduce(
    (acc, row) => ({
      ebitda: acc.ebitda + row.ebitda,
      fcf: acc.fcf + row.fcf,
      sbaInterest: acc.sbaInterest + row.sbaInterest,
      sbaPrincipal: acc.sbaPrincipal + row.sbaPrincipal,
      snInterest: acc.snInterest + row.snInterest,
      snPrincipal: acc.snPrincipal + row.snPrincipal,
      totalDS: acc.totalDS + row.totalDebtService,
    }),
    { ebitda: 0, fcf: 0, sbaInterest: 0, sbaPrincipal: 0, snInterest: 0, snPrincipal: 0, totalDS: 0 }
  );

  return (
    <div className="erm-amort-wrap">
      <table className="erm-amort-table">
        <thead>
          <tr>
            <th>Year</th>
            <th>EBITDA</th>
            <th>FCF</th>
            <th>SBA interest</th>
            <th>SBA principal</th>
            <th>SBA balance</th>
            <th>Note interest</th>
            <th>Note principal</th>
            <th>Note balance</th>
            <th>Total DS</th>
            <th>DSCR</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const dscrColor = getDscrColor(row.dscr);
            return (
              <tr key={row.year}>
                <td>Year {row.year}</td>
                <td>{fmt(row.ebitda)}</td>
                <td>{fmt(row.fcf)}</td>
                <td>{fmt(row.sbaInterest)}</td>
                <td>{fmt(row.sbaPrincipal)}</td>
                <td>{fmt(row.sbaBalance)}</td>
                <td>{fmt(row.snInterest)}</td>
                <td>{fmt(row.snPrincipal)}</td>
                <td>{fmt(row.snBalance)}</td>
                <td>{fmt(row.totalDebtService)}</td>
                <td
                  style={{
                    color: dscrColor,
                    fontWeight: 600,
                  }}
                >
                  {row.dscr ? fmtX(row.dscr) : "—"}
                </td>
              </tr>
            );
          })}
          <tr className="erm-total-row">
            <td>Totals</td>
            <td>{fmt(totals.ebitda)}</td>
            <td>{fmt(totals.fcf)}</td>
            <td>{fmt(totals.sbaInterest)}</td>
            <td>{fmt(totals.sbaPrincipal)}</td>
            <td>—</td>
            <td>{fmt(totals.snInterest)}</td>
            <td>{fmt(totals.snPrincipal)}</td>
            <td>—</td>
            <td>{fmt(totals.totalDS)}</td>
            <td>—</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
