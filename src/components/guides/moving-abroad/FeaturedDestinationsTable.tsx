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
import { featuredDestinations } from "./overseas-data";

/** The destinations readers ask about most, ordered by band. */
export function FeaturedDestinationsTable() {
  return (
    <ScrollFadeWrapper className={surfaceCard}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className={specHead}>
              Destination
            </TableHead>
            <TableHead scope="col" className={specHeadNum}>
              Band multiplier
            </TableHead>
            <TableHead scope="col" className={specHeadNum}>
              Plan 2 threshold
            </TableHead>
            <TableHead scope="col" className={specHeadNum}>
              Plan 5 threshold
            </TableHead>
            <TableHead scope="col" className={specHeadNum}>
              Fixed monthly (Plan 2)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {featuredDestinations.map((row) => (
            <TableRow key={row.label}>
              <TableHead
                scope="row"
                className="font-semibold whitespace-normal text-foreground"
              >
                {row.label}
              </TableHead>
              <TableCell className={specNum}>
                {formatMultiplier(row.multiplier)}
              </TableCell>
              <TableCell className={specNum}>
                {formatGBP(row.plan2Threshold)}
              </TableCell>
              <TableCell className={specNum}>
                {formatGBP(row.plan5Threshold)}
              </TableCell>
              <TableCell className={specNum}>
                {formatGBPPence(row.plan2FixedMonthly)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollFadeWrapper>
  );
}
