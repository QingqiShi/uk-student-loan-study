import { ScrollFadeWrapper } from "@/components/shared/ScrollFadeWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatGBP, formatGBPPence, formatMultiplier } from "@/lib/format";
import { surfaceCard } from "@/lib/surfaces";
import { specHead, specHeadNum, specNum } from "../guide-parts";
import { bandLadder } from "./overseas-data";

/** SLC's seven price bands, lowest multiplier first. */
export function BandLadderTable() {
  return (
    <ScrollFadeWrapper className={surfaceCard}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className={specHead}>
              Band
            </TableHead>
            <TableHead scope="col" className={specHeadNum}>
              Multiplier
            </TableHead>
            <TableHead scope="col" className={specHeadNum}>
              Plan 2 threshold
            </TableHead>
            <TableHead scope="col" className={specHeadNum}>
              Fixed monthly (Plan 2)
            </TableHead>
            <TableHead scope="col" className={specHead}>
              Territories
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bandLadder.map((row) => (
            <TableRow key={row.id}>
              <TableHead scope="row" className="font-semibold text-foreground">
                {row.id}
                {row.multiplier === 1 && (
                  <span className="ml-2 font-normal text-muted-foreground">
                    UK band
                  </span>
                )}
              </TableHead>
              <TableCell className={specNum}>
                {formatMultiplier(row.multiplier)}
              </TableCell>
              <TableCell className={specNum}>
                {formatGBP(row.plan2Threshold)}
              </TableCell>
              <TableCell className={specNum}>
                {formatGBPPence(row.plan2FixedMonthly)}
              </TableCell>
              <TableCell className="min-w-48 whitespace-normal text-muted-foreground">
                <span className="font-mono text-foreground tabular-nums">
                  {row.territoryCount}
                </span>{" "}
                &middot; {row.examples}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollFadeWrapper>
  );
}
