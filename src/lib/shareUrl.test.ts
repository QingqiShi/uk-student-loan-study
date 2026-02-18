import { describe, it, expect, vi } from "vitest";
import {
  encodeStateToParams,
  decodeParamsToState,
  generateShareUrl,
  generateShareText,
  ASSUMPTION_PARAMS,
} from "./shareUrl";
import type { LoanState } from "@/types/store";
import { MIN_SALARY, MAX_SALARY } from "@/constants";

const mockState: LoanState = {
  loans: [
    { planType: "PLAN_2", balance: 45000 },
    { planType: "POSTGRADUATE", balance: 12000 },
  ],
  salary: 65000,
  monthlyOverpayment: 200,
  salaryGrowthRate: 0.04,
  thresholdGrowthRate: 0.02,
  rpiRate: 3.2,
  boeBaseRate: 3.75,
  lumpSumPayment: 10000,
  showPresentValue: false,
  discountRate: 0.02,
  pendingQuizPlanTypes: null,
};

describe("encodeStateToParams", () => {
  it("encodes loans and salary", () => {
    const params = encodeStateToParams(mockState);

    expect(params.get("loans")).toBe("PLAN_2:45000,POSTGRADUATE:12000");
    expect(params.get("sal")).toBe("65000");
  });

  it("handles single loan", () => {
    const state: LoanState = {
      ...mockState,
      loans: [{ planType: "PLAN_5", balance: 50000 }],
    };
    const params = encodeStateToParams(state);

    expect(params.get("loans")).toBe("PLAN_5:50000");
  });

  it("handles all plan types", () => {
    const plans = ["PLAN_1", "PLAN_2", "PLAN_4", "PLAN_5"] as const;
    for (const plan of plans) {
      const state: LoanState = {
        ...mockState,
        loans: [{ planType: plan, balance: 30000 }],
      };
      const params = encodeStateToParams(state);
      expect(params.get("loans")).toBe(`${plan}:30000`);
    }
  });

  it.each(ASSUMPTION_PARAMS)(
    "always includes assumption field $urlParam",
    (field) => {
      const params = encodeStateToParams(mockState);
      const expected = mockState[field.stateKey] as number;
      expect(params.get(field.urlParam)).toBe(String(expected));
    },
  );

  it("excludes overpay fields by default", () => {
    const params = encodeStateToParams(mockState);

    expect(params.get("ovp")).toBeNull();
    expect(params.get("lsp")).toBeNull();
    expect(params.get("repy")).toBeNull();
  });

  it("includes overpay fields when includeOverpayFields is true", () => {
    const params = encodeStateToParams(mockState, {
      includeOverpayFields: true,
      repaymentYear: 2018,
    });

    expect(params.get("ovp")).toBe("200");
    expect(params.get("lsp")).toBe("10000");
    expect(params.get("repy")).toBe("2018");
  });

  it("omits repaymentYear if not provided", () => {
    const params = encodeStateToParams(mockState, {
      includeOverpayFields: true,
    });

    expect(params.get("ovp")).toBe("200");
    expect(params.get("lsp")).toBe("10000");
    expect(params.get("repy")).toBeNull();
  });
});

describe("decodeParamsToState", () => {
  it("decodes new loans format", () => {
    const params = new URLSearchParams(
      "loans=PLAN_2:45000,POSTGRADUATE:12000&sal=65000",
    );
    const state = decodeParamsToState(params);

    expect(state.loans).toEqual([
      { planType: "PLAN_2", balance: 45000 },
      { planType: "POSTGRADUATE", balance: 12000 },
    ]);
    expect(state.salary).toBe(65000);
  });

  it("decodes legacy plan/ug/pg format", () => {
    const params = new URLSearchParams(
      "plan=PLAN_2&ug=45000&pg=12000&sal=65000",
    );
    const state = decodeParamsToState(params);

    expect(state.loans).toEqual([
      { planType: "PLAN_2", balance: 45000 },
      { planType: "POSTGRADUATE", balance: 12000 },
    ]);
    expect(state.salary).toBe(65000);
  });

  it("decodes legacy format without postgrad", () => {
    const params = new URLSearchParams("plan=PLAN_5&ug=50000&sal=40000");
    const state = decodeParamsToState(params);

    expect(state.loans).toEqual([{ planType: "PLAN_5", balance: 50000 }]);
    expect(state.salary).toBe(40000);
  });

  it("decodes legacy format with zero postgrad balance", () => {
    const params = new URLSearchParams("plan=PLAN_2&ug=45000&pg=0&sal=40000");
    const state = decodeParamsToState(params);

    expect(state.loans).toEqual([{ planType: "PLAN_2", balance: 45000 }]);
  });

  it("ignores invalid plan types in new format", () => {
    const params = new URLSearchParams("loans=INVALID:45000");
    const state = decodeParamsToState(params);

    expect(state.loans).toBeUndefined();
  });

  it("ignores non-numeric balance in new format", () => {
    const params = new URLSearchParams("loans=PLAN_2:abc");
    const state = decodeParamsToState(params);

    expect(state.loans).toBeUndefined();
  });

  it("clamps negative balances to 0 in new format", () => {
    const params = new URLSearchParams("loans=PLAN_2:-5000");
    const state = decodeParamsToState(params);

    expect(state.loans).toEqual([{ planType: "PLAN_2", balance: 0 }]);
  });

  it("clamps excessively high balances in new format", () => {
    const params = new URLSearchParams("loans=PLAN_2:500000");
    const state = decodeParamsToState(params);

    expect(state.loans).toEqual([{ planType: "PLAN_2", balance: 200000 }]);
  });

  it("clamps salary below minimum", () => {
    const params = new URLSearchParams("sal=10000");
    const state = decodeParamsToState(params);

    expect(state.salary).toBe(MIN_SALARY);
  });

  it("clamps salary above maximum", () => {
    const params = new URLSearchParams("sal=500000");
    const state = decodeParamsToState(params);

    expect(state.salary).toBe(MAX_SALARY);
  });

  it("returns empty object for empty params", () => {
    const params = new URLSearchParams();
    const state = decodeParamsToState(params);

    expect(state).toEqual({});
  });

  it("handles partial params", () => {
    const params = new URLSearchParams("loans=PLAN_5:50000");
    const state = decodeParamsToState(params);

    expect(state.loans).toEqual([{ planType: "PLAN_5", balance: 50000 }]);
    expect(state.salary).toBeUndefined();
  });

  it("decodes overpay fields with numeric salaryGrowthRate", () => {
    const params = new URLSearchParams("ovp=300&sgr=0.06&lsp=15000&repy=2020");
    const state = decodeParamsToState(params);

    expect(state.monthlyOverpayment).toBe(300);
    expect(state.salaryGrowthRate).toBe(0.06);
    expect(state.lumpSumPayment).toBe(15000);
    expect(state.repaymentYear).toBe(2020);
  });

  it("decodes legacy string salaryGrowthRate presets", () => {
    const params = new URLSearchParams("sgr=aggressive");
    const state = decodeParamsToState(params);

    expect(state.salaryGrowthRate).toBe(0.06);
  });

  it("ignores invalid salaryGrowthRate values", () => {
    const params = new URLSearchParams("sgr=invalid");
    const state = decodeParamsToState(params);

    expect(state.salaryGrowthRate).toBeUndefined();
  });

  it("maps legacy salaryGrowthRate string values to numbers", () => {
    const legacyMapping = [
      { legacy: "none", expected: 0 },
      { legacy: "conservative", expected: 0.02 },
      { legacy: "moderate", expected: 0.04 },
      { legacy: "aggressive", expected: 0.06 },
    ];
    for (const { legacy, expected } of legacyMapping) {
      const params = new URLSearchParams(`sgr=${legacy}`);
      const state = decodeParamsToState(params);
      expect(state.salaryGrowthRate).toBe(expected);
    }
  });

  it.each(ASSUMPTION_PARAMS)("decodes $urlParam to $stateKey", (field) => {
    const testValue = field.stateKey === "salaryGrowthRate" ? "0.04" : "3.5";
    const params = new URLSearchParams(`${field.urlParam}=${testValue}`);
    const state = decodeParamsToState(params);

    expect(state[field.stateKey as keyof typeof state]).toBe(
      parseFloat(testValue),
    );
  });

  it.each(ASSUMPTION_PARAMS)(
    "does not clamp $urlParam — accepts negative values",
    (field) => {
      const params = new URLSearchParams(`${field.urlParam}=-5`);
      const state = decodeParamsToState(params);

      expect(state[field.stateKey as keyof typeof state]).toBe(-5);
    },
  );

  it.each(ASSUMPTION_PARAMS)(
    "does not clamp $urlParam — accepts large values",
    (field) => {
      const params = new URLSearchParams(`${field.urlParam}=999`);
      const state = decodeParamsToState(params);

      expect(state[field.stateKey as keyof typeof state]).toBe(999);
    },
  );

  it.each(ASSUMPTION_PARAMS.filter((f) => !f.legacyMapping))(
    "ignores non-numeric value for $urlParam",
    (field) => {
      const params = new URLSearchParams(`${field.urlParam}=abc`);
      const state = decodeParamsToState(params);

      expect(state[field.stateKey as keyof typeof state]).toBeUndefined();
    },
  );

  it("clamps overpayment below minimum to 0", () => {
    const params = new URLSearchParams("ovp=-100");
    const state = decodeParamsToState(params);

    expect(state.monthlyOverpayment).toBe(0);
  });

  it("clamps overpayment above maximum to 500", () => {
    const params = new URLSearchParams("ovp=1000");
    const state = decodeParamsToState(params);

    expect(state.monthlyOverpayment).toBe(500);
  });

  it("clamps lumpSumPayment to valid range", () => {
    // Below minimum
    const paramsLow = new URLSearchParams("lsp=-5000");
    expect(decodeParamsToState(paramsLow).lumpSumPayment).toBe(0);

    // Above maximum
    const paramsHigh = new URLSearchParams("lsp=200000");
    expect(decodeParamsToState(paramsHigh).lumpSumPayment).toBe(100000);
  });

  it("clamps repaymentYear to valid range", () => {
    // Below minimum
    const paramsLow = new URLSearchParams("repy=1990");
    expect(decodeParamsToState(paramsLow).repaymentYear).toBe(2000);

    // Above maximum
    const paramsHigh = new URLSearchParams("repy=2100");
    expect(decodeParamsToState(paramsHigh).repaymentYear).toBe(2050);
  });

  it("ignores non-numeric overpay values", () => {
    const params = new URLSearchParams("ovp=abc&lsp=xyz&repy=foo");
    const state = decodeParamsToState(params);

    expect(state.monthlyOverpayment).toBeUndefined();
    expect(state.lumpSumPayment).toBeUndefined();
    expect(state.repaymentYear).toBeUndefined();
  });
});

describe("present value encoding/decoding", () => {
  it("encoding with showPresentValue true produces pv=1", () => {
    const state: LoanState = { ...mockState, showPresentValue: true };
    const params = encodeStateToParams(state);

    expect(params.get("pv")).toBe("1");
  });

  it("encoding with showPresentValue false does NOT produce pv param", () => {
    const state: LoanState = { ...mockState, showPresentValue: false };
    const params = encodeStateToParams(state);

    expect(params.get("pv")).toBeNull();
  });

  it("decoding pv=1 returns showPresentValue true", () => {
    const params = new URLSearchParams("pv=1");
    const state = decodeParamsToState(params);

    expect(state.showPresentValue).toBe(true);
  });

  it("round-trips PV state", () => {
    const state: LoanState = {
      ...mockState,
      showPresentValue: true,
      discountRate: 0.05,
    };
    const params = encodeStateToParams(state);
    const decoded = decodeParamsToState(params);

    expect(decoded.showPresentValue).toBe(true);
    expect(decoded.discountRate).toBe(0.05);
  });
});

describe("round-trip encoding/decoding", () => {
  it("preserves all values through encode/decode", () => {
    const params = encodeStateToParams(mockState);
    const decoded = decodeParamsToState(params);

    expect(decoded.loans).toEqual(mockState.loans);
    expect(decoded.salary).toBe(mockState.salary);
    for (const field of ASSUMPTION_PARAMS) {
      expect(decoded[field.stateKey as keyof typeof decoded]).toBe(
        mockState[field.stateKey],
      );
    }
  });

  it("round-trips for all plan types", () => {
    const plans = ["PLAN_1", "PLAN_2", "PLAN_4", "PLAN_5"] as const;
    for (const plan of plans) {
      const state: LoanState = {
        ...mockState,
        loans: [{ planType: plan, balance: 30000 }],
      };
      const params = encodeStateToParams(state);
      const decoded = decodeParamsToState(params);
      expect(decoded.loans).toEqual([{ planType: plan, balance: 30000 }]);
    }
  });

  it("round-trips edge case values", () => {
    const state: LoanState = {
      ...mockState,
      loans: [
        { planType: "PLAN_2", balance: 0 },
        { planType: "POSTGRADUATE", balance: 200000 },
      ],
      salary: MIN_SALARY,
    };
    const params = encodeStateToParams(state);
    const decoded = decodeParamsToState(params);

    expect(decoded.loans).toEqual(state.loans);
    expect(decoded.salary).toBe(MIN_SALARY);
  });

  it("round-trips overpay fields with includeOverpayFields", () => {
    const params = encodeStateToParams(mockState, {
      includeOverpayFields: true,
      repaymentYear: 2018,
    });
    const decoded = decodeParamsToState(params);

    expect(decoded.monthlyOverpayment).toBe(mockState.monthlyOverpayment);
    expect(decoded.salaryGrowthRate).toBe(mockState.salaryGrowthRate);
    expect(decoded.lumpSumPayment).toBe(mockState.lumpSumPayment);
    expect(decoded.repaymentYear).toBe(2018);
  });

  it("round-trips for all salary growth rates", () => {
    const rates = [0, 0.02, 0.04, 0.06, 0.1];
    for (const rate of rates) {
      const state: LoanState = { ...mockState, salaryGrowthRate: rate };
      const params = encodeStateToParams(state, { includeOverpayFields: true });
      const decoded = decodeParamsToState(params);
      expect(decoded.salaryGrowthRate).toBe(rate);
    }
  });
});

describe("generateShareUrl", () => {
  it("generates URL with encoded params", () => {
    const url = generateShareUrl(mockState, { baseUrl: "https://example.com" });

    expect(url).toContain("https://example.com/");
    expect(url).toContain("loans=PLAN_2");
    expect(url).toContain("sal=65000");
  });

  it("generates valid URL without explicit base", () => {
    const url = generateShareUrl(mockState);
    // Should use window.location.origin in browser or fallback
    expect(url).toMatch(/^https?:\/\//);
    expect(url).toContain("loans=PLAN_2");
  });

  it("preserves current pathname in generated URL", () => {
    // Mock window.location using vi.stubGlobal
    const mockLocation = {
      pathname: "/overpay",
      origin: "https://example.com",
      href: "https://example.com/overpay",
      search: "",
      hash: "",
      host: "example.com",
      hostname: "example.com",
      port: "",
      protocol: "https:",
    };
    vi.stubGlobal("location", mockLocation);

    const url = generateShareUrl(mockState);
    expect(url).toContain("/overpay?");
    expect(url).not.toContain("/?");

    vi.unstubAllGlobals();
  });

  it("uses root path when on home page", () => {
    const mockLocation = {
      pathname: "/",
      origin: "https://example.com",
      href: "https://example.com/",
      search: "",
      hash: "",
      host: "example.com",
      hostname: "example.com",
      port: "",
      protocol: "https:",
    };
    vi.stubGlobal("location", mockLocation);

    const url = generateShareUrl(mockState);
    expect(url).toContain("/?");

    vi.unstubAllGlobals();
  });

  it("includes overpay fields when on /overpay path", () => {
    const mockLocation = {
      pathname: "/overpay",
      origin: "https://example.com",
      href: "https://example.com/overpay",
      search: "",
      hash: "",
      host: "example.com",
      hostname: "example.com",
      port: "",
      protocol: "https:",
    };
    vi.stubGlobal("location", mockLocation);

    const url = generateShareUrl(mockState, { repaymentYear: 2018 });

    expect(url).toContain("ovp=200");
    expect(url).toContain("sgr=0.04");
    expect(url).toContain("lsp=10000");
    expect(url).toContain("repy=2018");

    vi.unstubAllGlobals();
  });

  it("excludes overpay fields but includes assumption fields when on root path", () => {
    const mockLocation = {
      pathname: "/",
      origin: "https://example.com",
      href: "https://example.com/",
      search: "",
      hash: "",
      host: "example.com",
      hostname: "example.com",
      port: "",
      protocol: "https:",
    };
    vi.stubGlobal("location", mockLocation);

    const url = generateShareUrl(mockState, { repaymentYear: 2018 });

    // Overpay fields excluded
    expect(url).not.toContain("ovp=");
    expect(url).not.toContain("lsp=");
    expect(url).not.toContain("repy=");

    // Assumption fields always included
    expect(url).toContain("sgr=");
    expect(url).toContain("tgr=");
    expect(url).toContain("rpi=");
    expect(url).toContain("boe=");

    vi.unstubAllGlobals();
  });
});

describe("generateShareText", () => {
  it("generates share text with URL", () => {
    const text = generateShareText(mockState);

    expect(text).toContain("Check out my UK student loan projection:");
    expect(text).toContain("loans=PLAN_2");
  });
});
