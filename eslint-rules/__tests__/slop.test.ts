import { type JSRuleDefinition } from "eslint";
import slopPlugin from "../slop.js";
import { ruleTester } from "./ruleTester";

ruleTester.run(
  "no-slop-characters",
  slopPlugin.rules["no-slop-characters"] as JSRuleDefinition,
  {
    valid: [
      // En dash for ranges stays
      { code: `const a = <p>£30k–£50k in 2012–2022</p>;` },
      // Multiplication sign as a numeric suffix stays
      { code: `const a = <p>0.8× the balance</p>;` },
      // Copyright, registered and trademark signs are not emoji
      { code: `const a = <p>© 2026 Urchin™ ®</p>;` },
      // Module source strings are skipped
      { code: `import { a } from "./em—dash";` },
      // Regex literals are skipped
      { code: `const a = /—/;` },
      // className, href, src, id and key attributes are skipped
      { code: `const a = <div className="grid—cols" />;` },
      { code: `const a = <a href="/plan-2?from=—">Plan 2</a>;` },
      { code: `const a = <img src="/a—b.png" id="x—y" key="k—1" />;` },
    ],
    invalid: [
      // JSX text
      {
        code: `const a = <p>Plan 2 — the standard plan</p>;`,
        errors: [{ messageId: "emDash" }],
      },
      // HTML entity: the decoded value is checked, the raw offset is reported
      {
        code: `const a = <p>Plan 2 &mdash; standard</p>;`,
        errors: [{ messageId: "emDash", line: 1, column: 21, endColumn: 28 }],
      },
      {
        code: `const a = <p>Plan 2 &#8212; standard</p>;`,
        errors: [{ messageId: "emDash" }],
      },
      {
        code: `const a = <p>Plan 2 &#x2014; standard</p>;`,
        errors: [{ messageId: "emDash" }],
      },
      // String literal
      {
        code: `const a = "Not a bug — interest compounds";`,
        errors: [{ messageId: "emDash", line: 1, column: 22, endColumn: 23 }],
      },
      // Template literal
      {
        code: "const a = `Total ${x} — plus interest`;",
        errors: [{ messageId: "emDash" }],
      },
      // JSX attribute that is not in the skip list
      {
        code: `const a = <div title="A — B" aria-label="C — D" data-x="E — F" />;`,
        errors: [
          { messageId: "emDash" },
          { messageId: "emDash" },
          { messageId: "emDash" },
        ],
      },
      // Arrows
      {
        code: `const a = <p>Read the guide →</p>;`,
        errors: [{ messageId: "arrow" }],
      },
      {
        code: `const a = <p>Income ⇒ repayment ➡ write-off ⬀</p>;`,
        errors: [
          { messageId: "arrow" },
          { messageId: "arrow" },
          { messageId: "arrow" },
        ],
      },
      {
        code: `const a = <p>Next &rarr; here</p>;`,
        errors: [{ messageId: "arrow" }],
      },
      // Tick and cross marks, including the emoji-shaped ones
      {
        code: `const a = <p>✓ Independent ✗ Sponsored ✅ ❌ ☑</p>;`,
        errors: [
          { messageId: "tickCross" },
          { messageId: "tickCross" },
          { messageId: "tickCross" },
          { messageId: "tickCross" },
          { messageId: "tickCross" },
        ],
      },
      // Unicode bold letters
      {
        code: `const a = <p>𝗕𝗼𝗹𝗱</p>;`,
        errors: [
          { messageId: "mathAlphanumeric" },
          { messageId: "mathAlphanumeric" },
          { messageId: "mathAlphanumeric" },
          { messageId: "mathAlphanumeric" },
        ],
      },
      // Emoji
      {
        code: `const a = <p>Nice 🎉</p>;`,
        errors: [{ messageId: "emoji" }],
      },
      {
        code: `const a = "Made in 🇬🇧";`,
        errors: [{ messageId: "emoji" }, { messageId: "emoji" }],
      },
      // Several categories in one node
      {
        code: `const a = <p>✓ Done — next →</p>;`,
        errors: [
          { messageId: "tickCross" },
          { messageId: "emDash" },
          { messageId: "arrow" },
        ],
      },
    ],
  },
);

ruleTester.run(
  "no-slop-phrases",
  slopPlugin.rules["no-slop-phrases"] as JSRuleDefinition,
  {
    valid: [
      // "in today's money" is the present-value phrase, not a vapid opener
      { code: `const a = <p>That is £1,000 in today's money.</p>;` },
      { code: `const a = <p>Repayments start above the threshold.</p>;` },
      // Module source strings are skipped
      { code: `import { navigate } from "./navigate";` },
      // className is skipped
      { code: `const a = <div className="journey-step robust" />;` },
    ],
    invalid: [
      // Parallelism, in JSX text
      {
        code: `const a = <p>This is more than just a calculator.</p>;`,
        errors: [
          {
            messageId: "slopPhrase",
            data: { text: "more than just", label: "parallelism" },
          },
        ],
      },
      // Two-clause parallelism, in a string literal
      {
        code: `const a = "That's not a bug, it's how interest works.";`,
        errors: [{ messageId: "slopPhrase" }],
      },
      {
        code: `const a = <p>That's not a bug — it's how interest works.</p>;`,
        errors: [{ messageId: "slopPhrase" }],
      },
      {
        code: `const a = <p>It isn't about the balance.</p>;`,
        errors: [{ messageId: "slopPhrase" }],
      },
      // Curly apostrophe
      {
        code: `const a = <p>Whether you’re on Plan 1 or Plan 2.</p>;`,
        errors: [{ messageId: "slopPhrase" }],
      },
      {
        code: `const a = <p>Here’s the thing about interest.</p>;`,
        errors: [{ messageId: "slopPhrase" }],
      },
      // Vapid opener
      {
        code: `const a = <p>In today's fast-paced world, loans matter.</p>;`,
        errors: [{ messageId: "slopPhrase" }, { messageId: "slopPhrase" }],
      },
      {
        code: `const a = <p>At the end of the day, you repay 9%.</p>;`,
        errors: [{ messageId: "slopPhrase" }],
      },
      // Unearned profundity
      {
        code: `const a = <p>Make no mistake, the bottom line is simple.</p>;`,
        errors: [{ messageId: "slopPhrase" }, { messageId: "slopPhrase" }],
      },
      // Slop vocabulary, ordered by position
      {
        code: `const a = <p>Let's delve into the landscape.</p>;`,
        errors: [
          {
            messageId: "slopPhrase",
            data: { text: "delve", label: "slop vocabulary" },
          },
          {
            messageId: "slopPhrase",
            data: { text: "landscape", label: "slop vocabulary" },
          },
        ],
      },
      // Template literal
      {
        code: "const a = `Ready to ${x} your journey`;",
        errors: [{ messageId: "slopPhrase" }, { messageId: "slopPhrase" }],
      },
      // JSX attribute
      {
        code: `const a = <div title="Unlock a seamless experience" />;`,
        errors: [{ messageId: "slopPhrase" }, { messageId: "slopPhrase" }],
      },
    ],
  },
);

ruleTester.run(
  "no-fragment-questions",
  slopPlugin.rules["no-fragment-questions"] as JSRuleDefinition,
  {
    valid: [
      // A question standing alone
      { code: `const a = <h2>Which plan am I on?</h2>;` },
      // The clause before the question mark is longer than three words
      {
        code: `const a = <p>Does a student loan affect your mortgage? Affordability, income and your credit file.</p>;`,
      },
      // A run of genuine questions
      {
        code: `const a = <p>Will my loan affect my mortgage? Should I overpay? What if I move abroad?</p>;`,
      },
      // A question mark with nothing after it
      { code: `const a = "Not sure?";` },
      // Nothing follows in the JSX text and no sibling follows the node
      { code: `const a = <p>Not sure? </p>;` },
      // Query strings are not sentences
      { code: `const a = <a href="/x?a=b">Plan 2</a>;` },
      // Ternaries are code, not hooks: the clause is not prose-shaped
      {
        code: "const a = `resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';`;",
      },
      { code: "const a = `var t = cond ? dark : light;`;" },
    ],
    invalid: [
      // The hook continues in the next JSX child
      {
        code: `const a = <p>Not sure? <a href="/x">Take the quiz</a></p>;`,
        errors: [{ messageId: "fragmentQuestion" }],
      },
      {
        code: `const a = "Not sure? £30,000 is the threshold";`,
        errors: [{ messageId: "fragmentQuestion" }],
      },
      {
        code: `const a = "Not sure? Take the quiz";`,
        errors: [{ messageId: "fragmentQuestion" }],
      },
      {
        code: `const a = "Self-Employed? Your repayments work differently";`,
        errors: [{ messageId: "fragmentQuestion" }],
      },
      {
        code: `const a = "The solution? It's simpler than you think";`,
        errors: [{ messageId: "fragmentQuestion" }],
      },
      {
        code: "const a = `Don't have access? Check your payslip`;",
        errors: [{ messageId: "fragmentQuestion" }],
      },
      // JSX attribute
      {
        code: `const a = <div title="Not sure? Take the quiz" />;`,
        errors: [{ messageId: "fragmentQuestion" }],
      },
      // Multi-line JSX text
      {
        code: `const a = (\n  <p>\n    Not sure? Take the quiz\n  </p>\n);`,
        errors: [{ messageId: "fragmentQuestion", line: 3 }],
      },
    ],
  },
);
