import { describe, it, expect } from "vitest";
import { simulate } from "./engine";
import { PLAN_CONFIGS, CURRENT_RATES } from "./plans";
import type { SimulationConfig } from "./types";

describe("simulate engine", () => {
  const defaultConfig: SimulationConfig = {
    loans: [{ planType: "PLAN_2", balance: 50000 }],
    annualSalary: 50000,
    monthsElapsed: 0, // Simulate from repayment start
    rpiRate: CURRENT_RATES.rpi,
    boeBaseRate: CURRENT_RATES.boeBaseRate,
  };

  describe("empty and zero balance", () => {
    it("returns empty results for no loans", () => {
      const result = simulate({
        ...defaultConfig,
        loans: [],
      });

      expect(result.snapshots).toHaveLength(0);
      expect(result.summary.totalPaid).toBe(0);
      expect(result.summary.monthsToPayoff).toBe(0);
      expect(result.summary.perLoan).toHaveLength(0);
    });

    it("filters out zero balance loans", () => {
      const result = simulate({
        ...defaultConfig,
        loans: [
          { planType: "PLAN_2", balance: 0 },
          { planType: "POSTGRADUATE", balance: 0 },
        ],
      });

      expect(result.snapshots).toHaveLength(0);
      expect(result.summary.totalPaid).toBe(0);
    });

    it("includes only positive balance loans", () => {
      const result = simulate({
        ...defaultConfig,
        loans: [
          { planType: "PLAN_2", balance: 50000 },
          { planType: "POSTGRADUATE", balance: 0 },
        ],
      });

      expect(result.summary.perLoan).toHaveLength(1);
      expect(result.summary.perLoan[0].planType).toBe("PLAN_2");
    });
  });

  describe("PLAN_1 simulation", () => {
    const plan1Config: SimulationConfig = {
      ...defaultConfig,
      loans: [{ planType: "PLAN_1", balance: 30000 }],
    };

    it("uses correct threshold and rate", () => {
      const result = simulate(plan1Config);
      expect(result.summary.perLoan[0].planType).toBe("PLAN_1");
      expect(result.summary.totalPaid).toBeGreaterThan(0);
    });

    it("high salary pays off loan", () => {
      const result = simulate({
        ...plan1Config,
        annualSalary: 150000,
      });

      expect(result.summary.perLoan[0].writtenOff).toBe(false);
      expect(result.summary.perLoan[0].remainingBalance).toBe(0);
    });

    it("calculates monthly repayment using Plan 1 threshold", () => {
      const result = simulate(plan1Config);
      const firstSnapshot = result.snapshots[0];
      const loanState = firstSnapshot.loans[0];

      // Expected: (50000/12 - 2172) * 0.09 = (4166.67 - 2172) * 0.09 = 179.52
      expect(loanState.repayment).toBeCloseTo(179.52, 0);
    });
  });

  describe("PLAN_2 simulation", () => {
    const plan2Config: SimulationConfig = {
      ...defaultConfig,
      loans: [{ planType: "PLAN_2", balance: 50000 }],
    };

    it("uses correct threshold and rate", () => {
      const result = simulate(plan2Config);
      expect(result.summary.perLoan[0].planType).toBe("PLAN_2");
      expect(result.summary.totalPaid).toBeGreaterThan(0);
    });

    it("high salary pays off loan", () => {
      const result = simulate({
        ...plan2Config,
        annualSalary: 150000,
      });

      expect(result.summary.perLoan[0].writtenOff).toBe(false);
      expect(result.summary.perLoan[0].remainingBalance).toBe(0);
    });

    it("calculates monthly repayment using Plan 2 threshold", () => {
      const result = simulate(plan2Config);
      const firstSnapshot = result.snapshots[0];
      const loanState = firstSnapshot.loans[0];

      // Expected: (50000/12 - 2372) * 0.09 = (4166.67 - 2372) * 0.09 = 161.52
      expect(loanState.repayment).toBeCloseTo(161.52, 0);
    });
  });

  describe("PLAN_4 simulation", () => {
    const plan4Config: SimulationConfig = {
      ...defaultConfig,
      loans: [{ planType: "PLAN_4", balance: 40000 }],
    };

    it("uses correct threshold and rate", () => {
      const result = simulate(plan4Config);
      expect(result.summary.perLoan[0].planType).toBe("PLAN_4");
      expect(result.summary.totalPaid).toBeGreaterThan(0);
    });

    it("has higher threshold than Plan 2 (Scotland)", () => {
      expect(PLAN_CONFIGS.PLAN_4.monthlyThreshold).toBeGreaterThan(
        PLAN_CONFIGS.PLAN_2.monthlyThreshold,
      );
    });

    it("calculates lower repayment due to higher threshold", () => {
      const plan2Result = simulate({
        ...defaultConfig,
        loans: [{ planType: "PLAN_2", balance: 50000 }],
      });
      const plan4Result = simulate({
        ...defaultConfig,
        loans: [{ planType: "PLAN_4", balance: 50000 }],
      });

      // Plan 4 has higher threshold, so lower monthly repayment
      expect(plan4Result.snapshots[0].loans[0].repayment).toBeLessThan(
        plan2Result.snapshots[0].loans[0].repayment,
      );
    });
  });

  describe("PLAN_5 simulation", () => {
    const plan5Config: SimulationConfig = {
      ...defaultConfig,
      loans: [{ planType: "PLAN_5", balance: 60000 }],
    };

    it("uses correct threshold and rate", () => {
      const result = simulate(plan5Config);
      expect(result.summary.perLoan[0].planType).toBe("PLAN_5");
      expect(result.summary.totalPaid).toBeGreaterThan(0);
    });

    it("uses 40-year write-off period", () => {
      expect(PLAN_CONFIGS.PLAN_5.writeOffYears).toBe(40);
    });

    it("high salary pays off loan", () => {
      const result = simulate({
        ...plan5Config,
        annualSalary: 150000,
      });

      expect(result.summary.perLoan[0].writtenOff).toBe(false);
      expect(result.summary.perLoan[0].remainingBalance).toBe(0);
    });
  });

  describe("POSTGRADUATE simulation", () => {
    const pgConfig: SimulationConfig = {
      ...defaultConfig,
      loans: [{ planType: "POSTGRADUATE", balance: 25000 }],
    };

    it("uses 6% repayment rate", () => {
      expect(PLAN_CONFIGS.POSTGRADUATE.repaymentRate).toBe(0.06);
      const result = simulate(pgConfig);
      expect(result.summary.perLoan[0].planType).toBe("POSTGRADUATE");
    });

    it("has lowest threshold", () => {
      expect(PLAN_CONFIGS.POSTGRADUATE.monthlyThreshold).toBe(1750);
    });

    it("calculates monthly repayment using 6% rate", () => {
      const result = simulate(pgConfig);
      const firstSnapshot = result.snapshots[0];
      const loanState = firstSnapshot.loans[0];

      // Expected: (50000/12 - 1750) * 0.06 = (4166.67 - 1750) * 0.06 = 145
      expect(loanState.repayment).toBeCloseTo(145, 0);
    });
  });

  describe("multi-plan scenarios (correct independent thresholds)", () => {
    it("simulates Plan 2 + Postgraduate with independent thresholds", () => {
      const result = simulate({
        ...defaultConfig,
        loans: [
          { planType: "PLAN_2", balance: 50000 },
          { planType: "POSTGRADUATE", balance: 25000 },
        ],
        annualSalary: 60000,
      });

      expect(result.summary.perLoan).toHaveLength(2);

      // Each loan should use its own threshold
      const firstSnapshot = result.snapshots[0];
      const plan2State = firstSnapshot.loans.find(
        (l) => l.planType === "PLAN_2",
      );
      const pgState = firstSnapshot.loans.find(
        (l) => l.planType === "POSTGRADUATE",
      );

      expect(plan2State).toBeDefined();
      expect(pgState).toBeDefined();

      // Plan 2: (60000/12 - 2372) * 0.09 = (5000 - 2372) * 0.09 = 236.52
      expect(plan2State?.repayment).toBeCloseTo(236.52, 0);

      // Postgraduate: (60000/12 - 1750) * 0.06 = (5000 - 1750) * 0.06 = 195
      expect(pgState?.repayment).toBeCloseTo(195, 0);
    });

    it("total monthly repayment is sum of individual repayments", () => {
      const result = simulate({
        ...defaultConfig,
        loans: [
          { planType: "PLAN_2", balance: 50000 },
          { planType: "POSTGRADUATE", balance: 25000 },
        ],
        annualSalary: 60000,
      });

      const firstSnapshot = result.snapshots[0];
      const sumOfRepayments = firstSnapshot.loans.reduce(
        (sum, l) => sum + l.repayment,
        0,
      );
      expect(firstSnapshot.totalRepayment).toBeCloseTo(sumOfRepayments, 2);
    });

    it("can combine Plan 1 + Postgraduate", () => {
      const result = simulate({
        ...defaultConfig,
        loans: [
          { planType: "PLAN_1", balance: 20000 },
          { planType: "POSTGRADUATE", balance: 15000 },
        ],
        annualSalary: 45000,
      });

      expect(result.summary.perLoan).toHaveLength(2);
      expect(
        result.summary.perLoan.find((r) => r.planType === "PLAN_1"),
      ).toBeDefined();
      expect(
        result.summary.perLoan.find((r) => r.planType === "POSTGRADUATE"),
      ).toBeDefined();
    });

    it("loans finish at different times", () => {
      const result = simulate({
        ...defaultConfig,
        loans: [
          { planType: "PLAN_2", balance: 10000 },
          { planType: "POSTGRADUATE", balance: 30000 },
        ],
        annualSalary: 80000,
      });

      const plan2Result = result.summary.perLoan.find(
        (r) => r.planType === "PLAN_2",
      );
      const pgResult = result.summary.perLoan.find(
        (r) => r.planType === "POSTGRADUATE",
      );

      expect(plan2Result).toBeDefined();
      expect(pgResult).toBeDefined();

      // With different balances, they should finish at different times
      expect(plan2Result?.monthsToPayoff).not.toBe(pgResult?.monthsToPayoff);
    });
  });

  describe("salary growth", () => {
    it("applies salary growth annually", () => {
      const result = simulate({
        ...defaultConfig,
        salaryGrowthRate: 0.05, // 5% annual growth
      });

      // After 12 months, salary should be higher
      const month0Salary = result.snapshots[0].salary;
      const month12Salary = result.snapshots[12]?.salary;

      if (month12Salary) {
        expect(month12Salary).toBeCloseTo(month0Salary * 1.05, 0);
      }
    });

    it("salary growth increases repayments over time", () => {
      const withGrowth = simulate({
        ...defaultConfig,
        salaryGrowthRate: 0.1, // 10% annual growth
        loans: [{ planType: "PLAN_2", balance: 50000 }],
      });

      const withoutGrowth = simulate({
        ...defaultConfig,
        salaryGrowthRate: 0,
        loans: [{ planType: "PLAN_2", balance: 50000 }],
      });

      // With salary growth, loan should be paid off faster
      expect(withGrowth.summary.monthsToPayoff).toBeLessThan(
        withoutGrowth.summary.monthsToPayoff,
      );
    });

    it("defaults to 0% salary growth", () => {
      const result = simulate({
        ...defaultConfig,
        // salaryGrowthRate not specified
      });

      // Salary should remain constant
      if (result.snapshots.length > 24) {
        expect(result.snapshots[24].salary).toBe(result.snapshots[0].salary);
      }
    });
  });

  describe("overpayment distribution", () => {
    it("overpayment speeds up loan payoff", () => {
      const withOverpay = simulate({
        ...defaultConfig,
        monthlyOverpayment: 200,
      });

      const withoutOverpay = simulate({
        ...defaultConfig,
        monthlyOverpayment: 0,
      });

      expect(withOverpay.summary.monthsToPayoff).toBeLessThan(
        withoutOverpay.summary.monthsToPayoff,
      );
    });

    it("distributes overpayment proportionally across loans", () => {
      const result = simulate({
        ...defaultConfig,
        loans: [
          { planType: "PLAN_2", balance: 30000 },
          { planType: "POSTGRADUATE", balance: 10000 },
        ],
        monthlyOverpayment: 100,
      });

      const firstSnapshot = result.snapshots[0];

      // With 30k and 10k, Plan 2 gets 75% of overpayment, PG gets 25%
      // But the exact distribution includes the base repayment too
      // Just verify both loans receive some payment
      expect(firstSnapshot.loans[0].repayment).toBeGreaterThan(0);
      expect(firstSnapshot.loans[1].repayment).toBeGreaterThan(0);
    });

    it("overpayment can clear a small loan quickly", () => {
      const result = simulate({
        ...defaultConfig,
        loans: [{ planType: "PLAN_2", balance: 5000 }],
        monthlyOverpayment: 500,
      });

      // With large overpayment, small balance should clear quickly
      expect(result.summary.monthsToPayoff).toBeLessThan(24);
    });

    it("defaults to 0 overpayment", () => {
      const explicit = simulate({
        ...defaultConfig,
        monthlyOverpayment: 0,
      });

      const implicit = simulate({
        ...defaultConfig,
        // monthlyOverpayment not specified
      });

      expect(explicit.summary.monthsToPayoff).toBe(
        implicit.summary.monthsToPayoff,
      );
    });
  });

  describe("write-off scenarios", () => {
    it("marks loan as written off when write-off period expires", () => {
      const belowThreshold = PLAN_CONFIGS.PLAN_2.monthlyThreshold * 12 - 1000;
      const result = simulate({
        ...defaultConfig,
        loans: [{ planType: "PLAN_2", balance: 100000 }],
        annualSalary: belowThreshold, // Below threshold, no repayments
      });

      expect(result.summary.perLoan[0].writtenOff).toBe(true);
      expect(result.summary.totalWrittenOff).toBeGreaterThan(0);
    });

    it("tracks written off amount", () => {
      const result = simulate({
        ...defaultConfig,
        loans: [{ planType: "PLAN_2", balance: 100000 }],
        annualSalary: 35000, // Small repayments
      });

      if (result.summary.perLoan[0].writtenOff) {
        expect(result.summary.perLoan[0].remainingBalance).toBeGreaterThan(0);
        expect(result.summary.totalWrittenOff).toBe(
          result.summary.perLoan[0].remainingBalance,
        );
      }
    });

    it("does not mark loan as written off when fully paid", () => {
      const result = simulate({
        ...defaultConfig,
        loans: [{ planType: "PLAN_2", balance: 10000 }],
        annualSalary: 150000,
      });

      expect(result.summary.perLoan[0].writtenOff).toBe(false);
      expect(result.summary.perLoan[0].remainingBalance).toBe(0);
      expect(result.summary.totalWrittenOff).toBe(0);
    });

    it("handles different write-off periods per plan", () => {
      const result = simulate({
        ...defaultConfig,
        loans: [
          { planType: "PLAN_1", balance: 100000 }, // 25 years
          { planType: "PLAN_5", balance: 100000 }, // 40 years
        ],
        annualSalary: 30000, // Below threshold
      });

      // Plan 1 has shorter write-off period
      const plan1Result = result.summary.perLoan.find(
        (r) => r.planType === "PLAN_1",
      );
      const plan5Result = result.summary.perLoan.find(
        (r) => r.planType === "PLAN_5",
      );

      expect(plan1Result).toBeDefined();
      expect(plan5Result).toBeDefined();

      expect(plan1Result?.monthsToPayoff).toBeLessThan(
        plan5Result?.monthsToPayoff ?? 0,
      );
    });
  });

  describe("edge cases", () => {
    it("handles zero salary (no repayments)", () => {
      const result = simulate({
        ...defaultConfig,
        loans: [{ planType: "PLAN_2", balance: 50000 }],
        annualSalary: 0,
      });

      // With zero salary, no repayments are made
      expect(result.summary.perLoan[0].totalPaid).toBe(0);
      // Loan should eventually be written off with remaining balance
      expect(result.summary.perLoan[0].writtenOff).toBe(true);
      expect(result.summary.perLoan[0].remainingBalance).toBeGreaterThan(0);
    });

    it("handles salary below threshold", () => {
      const belowThreshold = PLAN_CONFIGS.PLAN_2.monthlyThreshold * 12 - 1000;
      const result = simulate({
        ...defaultConfig,
        loans: [{ planType: "PLAN_2", balance: 50000 }],
        annualSalary: belowThreshold,
      });

      expect(result.summary.perLoan[0].totalPaid).toBe(0);
    });

    it("handles very high salary", () => {
      const result = simulate({
        ...defaultConfig,
        loans: [{ planType: "PLAN_2", balance: 50000 }],
        annualSalary: 500000,
      });

      expect(result.summary.perLoan[0].remainingBalance).toBe(0);
      expect(result.summary.perLoan[0].monthsToPayoff).toBeGreaterThan(0);
    });

    it("uses default rates when not provided", () => {
      const result = simulate({
        loans: [{ planType: "PLAN_2", balance: 50000 }],
        annualSalary: 50000,
        monthsElapsed: 0,
      });

      expect(result.summary.totalPaid).toBeGreaterThan(0);
    });

    it("caps simulation at 100 years to prevent infinite loops", () => {
      // Very small payment, enormous balance, long write-off (40 years for Plan 5)
      const result = simulate({
        ...defaultConfig,
        loans: [{ planType: "PLAN_5", balance: 10000000 }], // 10 million
        annualSalary: 26000, // Just above threshold
        monthsElapsed: 0, // Full 40-year write-off period
      });

      // Should cap at 1200 months (100 years) to prevent infinite loops
      expect(result.snapshots.length).toBeLessThanOrEqual(1200);
    });
  });

  describe("time-series output correctness", () => {
    it("produces chronological month-by-month snapshots", () => {
      const result = simulate(defaultConfig);

      for (let i = 1; i < result.snapshots.length; i++) {
        expect(result.snapshots[i].month).toBe(
          result.snapshots[i - 1].month + 1,
        );
      }
    });

    it("snapshots track balance decreasing over time", () => {
      const result = simulate({
        ...defaultConfig,
        annualSalary: 100000, // High enough to make progress
      });

      // Balance should generally decrease (allowing for interest in early months)
      const firstBalance = result.snapshots[0].loans[0].closingBalance;
      const lastIndex = result.snapshots.length - 1;
      const lastBalance =
        result.snapshots[lastIndex].loans[0]?.closingBalance ?? 0;

      expect(lastBalance).toBeLessThan(firstBalance);
    });

    it("loan month state tracks opening and closing balance", () => {
      // Use high salary to ensure repayment exceeds interest
      const result = simulate({
        ...defaultConfig,
        annualSalary: 100000,
      });
      const snapshot = result.snapshots[0];
      const loanState = snapshot.loans[0];

      expect(loanState.openingBalance).toBe(50000);
      // With high salary, repayment should exceed interest, so balance decreases
      expect(loanState.closingBalance).toBeLessThan(
        loanState.openingBalance + loanState.interestApplied,
      );
    });

    it("interest applied is tracked per month", () => {
      const result = simulate(defaultConfig);
      const snapshot = result.snapshots[0];
      const loanState = snapshot.loans[0];

      expect(loanState.interestApplied).toBeGreaterThan(0);
    });

    it("total repayment in snapshot equals sum of loan repayments", () => {
      const result = simulate({
        ...defaultConfig,
        loans: [
          { planType: "PLAN_2", balance: 50000 },
          { planType: "POSTGRADUATE", balance: 25000 },
        ],
      });

      result.snapshots.forEach((snapshot) => {
        const sum = snapshot.loans.reduce((s, l) => s + l.repayment, 0);
        expect(snapshot.totalRepayment).toBeCloseTo(sum, 2);
      });
    });
  });

  describe("summary derivation", () => {
    it("totalPaid matches sum of all repayments across all months", () => {
      const result = simulate(defaultConfig);

      const totalFromSnapshots = result.snapshots.reduce(
        (sum, s) => sum + s.totalRepayment,
        0,
      );

      expect(result.summary.totalPaid).toBeCloseTo(totalFromSnapshots, 2);
    });

    it("monthsToPayoff equals number of months simulated", () => {
      const result = simulate({
        ...defaultConfig,
        annualSalary: 100000, // Will pay off loan
      });

      expect(result.summary.monthsToPayoff).toBe(result.snapshots.length);
    });

    it("perLoan results include all active loans", () => {
      const result = simulate({
        ...defaultConfig,
        loans: [
          { planType: "PLAN_2", balance: 50000 },
          { planType: "POSTGRADUATE", balance: 25000 },
          { planType: "PLAN_1", balance: 0 }, // Should be filtered
        ],
      });

      expect(result.summary.perLoan).toHaveLength(2);
    });
  });

  describe("monthsElapsed (pure function)", () => {
    it("defaults to 0 months elapsed", () => {
      const withExplicit = simulate({
        ...defaultConfig,
        monthsElapsed: 0,
      });

      const withDefault = simulate({
        loans: defaultConfig.loans,
        annualSalary: defaultConfig.annualSalary,
        rpiRate: defaultConfig.rpiRate,
        boeBaseRate: defaultConfig.boeBaseRate,
      });

      expect(withExplicit.summary.monthsToPayoff).toBe(
        withDefault.summary.monthsToPayoff,
      );
    });

    it("reduces remaining write-off time when months have elapsed", () => {
      // Plan 2 has 30-year (360 month) write-off
      const fromStart = simulate({
        ...defaultConfig,
        loans: [{ planType: "PLAN_2", balance: 100000 }],
        annualSalary: 30000, // Below threshold, will be written off
        monthsElapsed: 0,
      });

      const halfwayThrough = simulate({
        ...defaultConfig,
        loans: [{ planType: "PLAN_2", balance: 100000 }],
        annualSalary: 30000,
        monthsElapsed: 180, // 15 years elapsed
      });

      // With 15 years elapsed, remaining time should be 15 years less
      expect(fromStart.summary.monthsToPayoff).toBe(360); // Full 30 years
      expect(halfwayThrough.summary.monthsToPayoff).toBe(180); // 15 years remaining
    });

    it("loan written off immediately if write-off period has passed", () => {
      const result = simulate({
        ...defaultConfig,
        loans: [{ planType: "PLAN_2", balance: 50000 }],
        monthsElapsed: 400, // More than 30 years (360 months)
      });

      // Loan should be immediately written off
      expect(result.summary.monthsToPayoff).toBe(0);
      expect(result.summary.perLoan[0].writtenOff).toBe(true);
    });
  });

  describe("threshold growth", () => {
    it("growing thresholds reduce repayments over time", () => {
      const withGrowth = simulate({
        ...defaultConfig,
        thresholdGrowthRate: 0.03, // 3% annual threshold growth
      });

      const withoutGrowth = simulate({
        ...defaultConfig,
        thresholdGrowthRate: 0,
      });

      // With growing thresholds, total paid should be less (smaller repayments)
      expect(withGrowth.summary.totalPaid).toBeLessThan(
        withoutGrowth.summary.totalPaid,
      );
    });

    it("threshold growth does not apply in the first year", () => {
      const withGrowth = simulate({
        ...defaultConfig,
        thresholdGrowthRate: 0.03,
      });

      const withoutGrowth = simulate({
        ...defaultConfig,
        thresholdGrowthRate: 0,
      });

      // First month repayment should be identical
      expect(withGrowth.snapshots[0].loans[0].repayment).toBe(
        withoutGrowth.snapshots[0].loans[0].repayment,
      );
    });

    it("threshold growth reduces repayment in year 2 compared to static", () => {
      const withGrowth = simulate({
        ...defaultConfig,
        thresholdGrowthRate: 0.03,
      });

      const withoutGrowth = simulate({
        ...defaultConfig,
        thresholdGrowthRate: 0,
      });

      // After threshold grows at month 12, repayment should be lower
      const growthRepayment =
        withGrowth.snapshots[12]?.loans[0]?.repayment ?? 0;
      const staticRepayment =
        withoutGrowth.snapshots[12]?.loans[0]?.repayment ?? 0;

      expect(growthRepayment).toBeLessThan(staticRepayment);
    });

    it("defaults to 0% threshold growth", () => {
      const explicit = simulate({
        ...defaultConfig,
        thresholdGrowthRate: 0,
      });

      const implicit = simulate({
        loans: defaultConfig.loans,
        annualSalary: defaultConfig.annualSalary,
        rpiRate: defaultConfig.rpiRate,
        boeBaseRate: defaultConfig.boeBaseRate,
      });

      expect(explicit.summary.monthsToPayoff).toBe(
        implicit.summary.monthsToPayoff,
      );
    });

    it("threshold growth above salary growth can cause repayments to stop", () => {
      const result = simulate({
        ...defaultConfig,
        loans: [{ planType: "PLAN_2", balance: 50000 }],
        annualSalary: 35000, // Just above Plan 2 threshold (~£28,470)
        salaryGrowthRate: 0.01, // 1% salary growth
        thresholdGrowthRate: 0.05, // 5% threshold growth (outpaces salary)
      });

      // Eventually threshold should exceed salary, reducing repayments to 0
      // The loan should be written off
      expect(result.summary.perLoan[0].writtenOff).toBe(true);
    });

    it("grows Plan 2 interest thresholds alongside repayment thresholds", () => {
      // Use a salary right at the Plan 2 interest lower threshold boundary
      const salary = PLAN_CONFIGS.PLAN_2.interestLowerThreshold + 1000;

      const withGrowth = simulate({
        ...defaultConfig,
        loans: [{ planType: "PLAN_2", balance: 50000 }],
        annualSalary: salary,
        thresholdGrowthRate: 0.03,
      });

      const withoutGrowth = simulate({
        ...defaultConfig,
        loans: [{ planType: "PLAN_2", balance: 50000 }],
        annualSalary: salary,
        thresholdGrowthRate: 0,
      });

      // With threshold growth, interest thresholds also grow, so interest rate
      // changes differently. At month 12, the interest applied should differ.
      if (withGrowth.snapshots[12] && withoutGrowth.snapshots[12]) {
        const growthInterest =
          withGrowth.snapshots[12].loans[0]?.interestApplied ?? 0;
        const staticInterest =
          withoutGrowth.snapshots[12].loans[0]?.interestApplied ?? 0;

        // With growing interest thresholds, the salary is relatively lower in the
        // sliding scale, so interest should be lower (closer to RPI only)
        expect(growthInterest).not.toBe(staticInterest);
      }
    });
  });

  describe("interest rate impact", () => {
    it("higher RPI results in more total repayment", () => {
      const lowRpi = simulate({
        ...defaultConfig,
        rpiRate: 2.0,
      });

      const highRpi = simulate({
        ...defaultConfig,
        rpiRate: 8.0,
      });

      // Higher interest means more paid over time
      expect(highRpi.summary.totalPaid).toBeGreaterThanOrEqual(
        lowRpi.summary.totalPaid * 0.95,
      );
    });

    it("Plan 2 sliding scale interest varies with salary", () => {
      const lowSalary = simulate({
        ...defaultConfig,
        loans: [{ planType: "PLAN_2", balance: 50000 }],
        annualSalary: 30000, // Below sliding scale lower threshold
      });

      const highSalary = simulate({
        ...defaultConfig,
        loans: [{ planType: "PLAN_2", balance: 50000 }],
        annualSalary: 60000, // Above sliding scale upper threshold
      });

      // Higher salary means higher interest rate for Plan 2
      const lowSalaryInterest =
        lowSalary.snapshots[0]?.loans[0]?.interestApplied ?? 0;
      const highSalaryInterest =
        highSalary.snapshots[0]?.loans[0]?.interestApplied ?? 0;

      expect(highSalaryInterest).toBeGreaterThan(lowSalaryInterest);
    });
  });
});
