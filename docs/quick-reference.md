> **Note:** This is a developer reference document. The source of truth for thresholds, repayment rates, and write-off periods is `src/lib/loans/plans.ts`, which is automatically updated by the GOV.UK freshness checker.

# UK Student Loans: Quick Reference

Quick reference for thresholds, rates, and key dates. All data from GOV.UK.

For detailed explanations, see [uk-student-loans-research.md](./uk-student-loans-research.md).

## Current Thresholds (2025/26)

| Plan         | Annual  | Monthly | Weekly | Rate |
| ------------ | ------- | ------- | ------ | ---- |
| **Plan 1**   | £26,065 | £2,172  | £501   | 9%   |
| **Plan 2**   | £28,470 | £2,372  | £547   | 9%   |
| **Plan 4**   | £32,745 | £2,728  | £629   | 9%   |
| **Plan 5**   | £25,000 | £2,083  | £480   | 9%   |
| **Postgrad** | £21,000 | £1,750  | £403   | 6%   |

## Thresholds from April 2026

| Plan         | Annual  | Notes                 |
| ------------ | ------- | --------------------- |
| **Plan 1**   | £26,900 | Confirmed             |
| **Plan 2**   | £29,385 | Confirmed             |
| **Plan 4**   | TBC     | Expected RPI increase |
| **Plan 5**   | £25,000 | Confirmed             |
| **Postgrad** | £21,000 | Unchanged             |

## Interest Rates (Sept 2025 - Aug 2026)

| Plan         | Method                       | Current Rate |
| ------------ | ---------------------------- | ------------ |
| **Plan 1**   | Lower of RPI or BoE+1%       | 3.2%         |
| **Plan 2**   | RPI to RPI+3% (income-based) | 3.2% - 6.2%  |
| **Plan 4**   | Lower of RPI or BoE+1%       | 3.2%         |
| **Plan 5**   | RPI only                     | 3.2%         |
| **Postgrad** | RPI + 3%                     | 6.2%         |

## Plan 2 Interest Sliding Scale (2025/26)

| Annual Income      | Interest Rate      |
| ------------------ | ------------------ |
| £28,470 or less    | 3.2%               |
| £28,471 to £51,245 | 3.2% plus up to 3% |
| £51,245 or more    | 6.2%               |

**From April 2026:** Lower: £29,385, Upper: £52,885

## Write-Off Periods

| Plan                       | Period             |
| -------------------------- | ------------------ |
| **Plan 1** (pre-Sept 2006) | Age 65             |
| **Plan 1** (Sept 2006+)    | 25 years           |
| **Plan 2**                 | 30 years           |
| **Plan 4** (pre-Aug 2007)  | Age 65 or 30 years |
| **Plan 4** (Aug 2007+)     | 30 years           |
| **Plan 5**                 | 40 years           |
| **Postgrad**               | 30 years           |

## Who's On Which Plan?

| Plan         | Criteria                                          |
| ------------ | ------------------------------------------------- |
| **Plan 1**   | England/Wales pre-Sept 2012; ALL Northern Ireland |
| **Plan 2**   | England Sept 2012 - July 2023; Wales Sept 2012+   |
| **Plan 4**   | ALL Scotland                                      |
| **Plan 5**   | England Aug 2023+ only                            |
| **Postgrad** | Master's/Doctoral in England/Wales                |

## Key Dates

| Event                   | Date                 |
| ----------------------- | -------------------- |
| Interest rate review    | 1 September annually |
| Threshold changes       | 6 April annually     |
| Plan 5 first repayments | April 2026           |

## Tuition Fee Loan (2025/26)

| Type                    | Maximum |
| ----------------------- | ------- |
| Full-time undergraduate | £9,535  |
| Accelerated degree      | £11,440 |

## Maintenance Loan Maximums (2025/26)

| Living Situation                | Annual Max |
| ------------------------------- | ---------- |
| Living with parents             | £8,877     |
| Away from home (outside London) | £10,544    |
| Away from home (London)         | £13,762    |

## Postgraduate Loan Maximums (2025/26)

| Type                     | Maximum |
| ------------------------ | ------- |
| Master's (from Aug 2025) | £12,858 |
| Doctoral (from Aug 2025) | £30,301 |

## Repayment Examples

Monthly repayment = (Monthly income - Monthly threshold) × Rate

**Example 1: Plan 2, £35,000 salary**

```
Monthly income: £2,917
Monthly threshold: £2,372
Repayment: (£2,917 - £2,372) × 9% = £49.05/month
```

**Example 2: Plan 5, £35,000 salary**

```
Monthly income: £2,917
Monthly threshold: £2,083
Repayment: (£2,917 - £2,083) × 9% = £75.06/month
```

**Example 3: Combined Plan 2 + Postgrad, £40,000 salary**

```
Monthly income: £3,333
Plan 2: (£3,333 - £2,372) × 9% = £86.49
Postgrad: (£3,333 - £1,750) × 6% = £94.98
Total: £181.47/month
```

---

## Official Sources

- [GOV.UK: Repaying your student loan](https://www.gov.uk/repaying-your-student-loan)
- [GOV.UK: Student finance](https://www.gov.uk/student-finance)

---

_Last updated: January 2026_
_All data sourced exclusively from GOV.UK_
