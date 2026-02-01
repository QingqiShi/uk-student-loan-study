import { describe, it, expect, vi } from "vitest";
import {
  encodeStateToParams,
  decodeParamsToState,
  generateShareUrl,
  generateShareText,
} from "./shareUrl";
import type { LoanState } from "@/types/store";
import { MIN_SALARY, MAX_SALARY } from "@/constants";

const mockState: LoanState = {
  underGradPlanType: "PLAN_2",
  underGradBalance: 45000,
  postGradBalance: 12000,
  salary: 65000,
  monthlyOverpayment: 200,
  salaryGrowthRate: "moderate",
  lumpSumPayment: 10000,
};

describe("encodeStateToParams", () => {
  it("encodes all shareable fields", () => {
    const params = encodeStateToParams(mockState);

    expect(params.get("plan")).toBe("PLAN_2");
    expect(params.get("ug")).toBe("45000");
    expect(params.get("pg")).toBe("12000");
    expect(params.get("sal")).toBe("65000");
  });

  it("handles zero balances", () => {
    const state: LoanState = {
      ...mockState,
      underGradBalance: 0,
      postGradBalance: 0,
    };
    const params = encodeStateToParams(state);

    expect(params.get("ug")).toBe("0");
    expect(params.get("pg")).toBe("0");
  });

  it("handles all plan types", () => {
    const plans = ["PLAN_1", "PLAN_2", "PLAN_4", "PLAN_5"] as const;
    for (const plan of plans) {
      const state: LoanState = { ...mockState, underGradPlanType: plan };
      const params = encodeStateToParams(state);
      expect(params.get("plan")).toBe(plan);
    }
  });

  it("excludes overpay fields by default", () => {
    const params = encodeStateToParams(mockState);

    expect(params.get("ovp")).toBeNull();
    expect(params.get("sgr")).toBeNull();
    expect(params.get("lsp")).toBeNull();
    expect(params.get("repy")).toBeNull();
  });

  it("includes overpay fields when includeOverpayFields is true", () => {
    const params = encodeStateToParams(mockState, {
      includeOverpayFields: true,
      repaymentYear: 2018,
    });

    expect(params.get("ovp")).toBe("200");
    expect(params.get("sgr")).toBe("moderate");
    expect(params.get("lsp")).toBe("10000");
    expect(params.get("repy")).toBe("2018");
  });

  it("omits repaymentYear if not provided", () => {
    const params = encodeStateToParams(mockState, {
      includeOverpayFields: true,
    });

    expect(params.get("ovp")).toBe("200");
    expect(params.get("sgr")).toBe("moderate");
    expect(params.get("lsp")).toBe("10000");
    expect(params.get("repy")).toBeNull();
  });
});

describe("decodeParamsToState", () => {
  it("decodes all valid params", () => {
    const params = new URLSearchParams(
      "plan=PLAN_2&ug=45000&pg=12000&sal=65000",
    );
    const state = decodeParamsToState(params);

    expect(state.underGradPlanType).toBe("PLAN_2");
    expect(state.underGradBalance).toBe(45000);
    expect(state.postGradBalance).toBe(12000);
    expect(state.salary).toBe(65000);
  });

  it("ignores invalid plan types", () => {
    const params = new URLSearchParams("plan=INVALID_PLAN");
    const state = decodeParamsToState(params);

    expect(state.underGradPlanType).toBeUndefined();
  });

  it("ignores non-numeric balance values", () => {
    const params = new URLSearchParams("ug=abc&pg=xyz");
    const state = decodeParamsToState(params);

    expect(state.underGradBalance).toBeUndefined();
    expect(state.postGradBalance).toBeUndefined();
  });

  it("ignores non-numeric salary values", () => {
    const params = new URLSearchParams("sal=not-a-number");
    const state = decodeParamsToState(params);

    expect(state.salary).toBeUndefined();
  });

  it("clamps negative balances to 0", () => {
    const params = new URLSearchParams("ug=-5000&pg=-1000");
    const state = decodeParamsToState(params);

    expect(state.underGradBalance).toBe(0);
    expect(state.postGradBalance).toBe(0);
  });

  it("clamps excessively high balances", () => {
    const params = new URLSearchParams("ug=500000&pg=300000");
    const state = decodeParamsToState(params);

    expect(state.underGradBalance).toBe(200000);
    expect(state.postGradBalance).toBe(200000);
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
    const params = new URLSearchParams("plan=PLAN_5&sal=80000");
    const state = decodeParamsToState(params);

    expect(state.underGradPlanType).toBe("PLAN_5");
    expect(state.salary).toBe(80000);
    expect(state.underGradBalance).toBeUndefined();
    expect(state.postGradBalance).toBeUndefined();
  });

  it("decodes overpay fields", () => {
    const params = new URLSearchParams(
      "ovp=300&sgr=aggressive&lsp=15000&repy=2020",
    );
    const state = decodeParamsToState(params);

    expect(state.monthlyOverpayment).toBe(300);
    expect(state.salaryGrowthRate).toBe("aggressive");
    expect(state.lumpSumPayment).toBe(15000);
    expect(state.repaymentYear).toBe(2020);
  });

  it("ignores invalid salaryGrowthRate values", () => {
    const params = new URLSearchParams("sgr=invalid");
    const state = decodeParamsToState(params);

    expect(state.salaryGrowthRate).toBeUndefined();
  });

  it("validates salaryGrowthRate values", () => {
    const validRates = [
      "none",
      "conservative",
      "moderate",
      "aggressive",
    ] as const;
    for (const rate of validRates) {
      const params = new URLSearchParams(`sgr=${rate}`);
      const state = decodeParamsToState(params);
      expect(state.salaryGrowthRate).toBe(rate);
    }
  });

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

describe("round-trip encoding/decoding", () => {
  it("preserves all values through encode/decode", () => {
    const params = encodeStateToParams(mockState);
    const decoded = decodeParamsToState(params);

    expect(decoded.underGradPlanType).toBe(mockState.underGradPlanType);
    expect(decoded.underGradBalance).toBe(mockState.underGradBalance);
    expect(decoded.postGradBalance).toBe(mockState.postGradBalance);
    expect(decoded.salary).toBe(mockState.salary);
  });

  it("round-trips for all plan types", () => {
    const plans = ["PLAN_1", "PLAN_2", "PLAN_4", "PLAN_5"] as const;
    for (const plan of plans) {
      const state: LoanState = { ...mockState, underGradPlanType: plan };
      const params = encodeStateToParams(state);
      const decoded = decodeParamsToState(params);
      expect(decoded.underGradPlanType).toBe(plan);
    }
  });

  it("round-trips edge case values", () => {
    const state: LoanState = {
      ...mockState,
      underGradBalance: 0,
      postGradBalance: 200000,
      salary: MIN_SALARY,
    };
    const params = encodeStateToParams(state);
    const decoded = decodeParamsToState(params);

    expect(decoded.underGradBalance).toBe(0);
    expect(decoded.postGradBalance).toBe(200000);
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
    const rates = ["none", "conservative", "moderate", "aggressive"] as const;
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
    expect(url).toContain("plan=PLAN_2");
    expect(url).toContain("ug=45000");
    expect(url).toContain("pg=12000");
    expect(url).toContain("sal=65000");
  });

  it("generates valid URL without explicit base", () => {
    const url = generateShareUrl(mockState);
    // Should use window.location.origin in browser or fallback
    expect(url).toMatch(/^https?:\/\//);
    expect(url).toContain("plan=PLAN_2");
    expect(url).toContain("ug=45000");
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
    expect(url).toContain("sgr=moderate");
    expect(url).toContain("lsp=10000");
    expect(url).toContain("repy=2018");

    vi.unstubAllGlobals();
  });

  it("excludes overpay fields when on root path", () => {
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

    expect(url).not.toContain("ovp=");
    expect(url).not.toContain("sgr=");
    expect(url).not.toContain("lsp=");
    expect(url).not.toContain("repy=");

    vi.unstubAllGlobals();
  });
});

describe("generateShareText", () => {
  it("generates share text with URL", () => {
    const text = generateShareText(mockState);

    expect(text).toContain("Check out my UK student loan projection:");
    expect(text).toContain("plan=PLAN_2");
    expect(text).toContain("ug=45000");
  });
});
