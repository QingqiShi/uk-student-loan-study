import CurrencyInput from "./CurrencyInput";
import DateInput from "./DateInput";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLoanContext } from "@/context";

export function ConfigPanel() {
  const { state, updateField } = useLoanContext();
  const isPost2023 = state.underGradPlanType === "PLAN_5";

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Student Loan Balance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CurrencyInput
            id="undergrad-balance"
            label="Undergraduate Loan Balance (plan 2 or plan 5)"
            value={state.underGradBalance}
            onChange={(value) => {
              updateField("underGradBalance", value);
            }}
          />
          <CurrencyInput
            id="postgrad-balance"
            label="Postgraduate Loan Balance"
            value={state.postGradBalance}
            onChange={(value) => {
              updateField("postGradBalance", value);
            }}
          />
          <DateInput
            id="repayment-date"
            label="Date Repayment Started"
            helperText="This determines when your loan is written off."
            value={state.repaymentDate}
            onChange={(value) => {
              updateField("repaymentDate", value);
            }}
          />
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
              checked={isPost2023}
              onCheckedChange={(checked) => {
                updateField("underGradPlanType", checked ? "PLAN_5" : "PLAN_2");
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="py-0">
        <CardContent>
          <Accordion>
            <AccordionItem value={0}>
              <AccordionTrigger>Earnings</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <CurrencyInput
                  id="earning"
                  label="Your current Pre-Tax Salary"
                  value={state.salary}
                  onChange={(value) => {
                    updateField("salary", value);
                  }}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
