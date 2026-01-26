import { lazy, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "../store";

const CurrencyInput = lazy(() => import("./CurrencyInput"));
const PercentageInput = lazy(() => import("./PercentageInput"));
const DateInput = lazy(() => import("./DateInput"));

export function ConfigPanel() {
  const store = useStore();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Student Loan Balance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Suspense fallback={<Skeleton className="h-14 w-full" />}>
            <CurrencyInput
              id="undergrad-balance"
              label="Undergraduate Loan Balance (plan 2 or plan 5)"
              value={store.underGradBalance}
              onChange={(value) => store.updateField("underGradBalance", value)}
            />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-14 w-full" />}>
            <CurrencyInput
              id="postgrad-balance"
              label="Postgraduate Loan Balance"
              value={store.postGradBalance}
              onChange={(value) => store.updateField("postGradBalance", value)}
            />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-14 w-full" />}>
            <DateInput
              id="repayment-date"
              label="Date Repayment Started"
              helperText="This determines when your loan is written off."
              value={store.repaymentDate}
              onChange={(value) => store.updateField("repaymentDate", value)}
            />
          </Suspense>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="post-2023">Post 2023</Label>
              <p className="text-sm text-muted-foreground">
                For students who started an undergraduate course on or after
                August 2023.
              </p>
            </div>
            <Switch
              id="post-2023"
              checked={store.isPost2023}
              onCheckedChange={(checked) =>
                store.updateField("isPost2023", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card className="py-0">
        <CardContent>
          <Accordion>
            <AccordionItem value={0}>
              <AccordionTrigger>Rates</AccordionTrigger>
              <AccordionContent className="space-y-4">
                {!store.isPost2023 && (
                  <>
                    <Suspense fallback={<Skeleton className="h-14 w-full" />}>
                      <PercentageInput
                        id="plan2-lt-rate"
                        label="Plan 2 Lower Threshold Rate"
                        value={store.plan2LTRate}
                        onChange={(value) =>
                          store.updateField("plan2LTRate", value)
                        }
                      />
                    </Suspense>
                    <Suspense fallback={<Skeleton className="h-14 w-full" />}>
                      <PercentageInput
                        id="plan2-ut-rate"
                        label="Plan 2 Upper Threshold Rate"
                        value={store.plan2UTRate}
                        onChange={(value) =>
                          store.updateField("plan2UTRate", value)
                        }
                      />
                    </Suspense>
                  </>
                )}
                {store.isPost2023 && (
                  <Suspense fallback={<Skeleton className="h-14 w-full" />}>
                    <PercentageInput
                      id="plan5-rate"
                      label="Plan 5 Interest Rate (RPI)"
                      value={store.plan5Rate}
                      onChange={(value) =>
                        store.updateField("plan5Rate", value)
                      }
                    />
                  </Suspense>
                )}
                <Suspense fallback={<Skeleton className="h-14 w-full" />}>
                  <PercentageInput
                    id="postgrad-rate"
                    label="Postgraduate Rate"
                    value={store.postGradRate}
                    onChange={(value) =>
                      store.updateField("postGradRate", value)
                    }
                  />
                </Suspense>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value={1}>
              <AccordionTrigger>Earnings</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <Suspense fallback={<Skeleton className="h-14 w-full" />}>
                  <CurrencyInput
                    id="earning"
                    label="Your current Pre-Tax Salary"
                    value={store.salary}
                    onChange={(value) => store.updateField("salary", value)}
                  />
                </Suspense>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
