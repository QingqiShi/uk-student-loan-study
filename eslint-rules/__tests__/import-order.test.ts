import { type JSRuleDefinition, RuleTester } from "eslint";
import tseslint from "typescript-eslint";
import { describe, it } from "vitest";
import importOrderPlugin from "../import-order.js";

const rule = importOrderPlugin.rules["import-order"] as JSRuleDefinition;

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslint.parser,
    ecmaVersion: "latest",
    sourceType: "module",
  },
});

describe("import-order", () => {
  it("passes RuleTester", () => {
    ruleTester.run("import-order", rule, {
      valid: [
        // builtin → external → internal → relative
        {
          code: `import fs from "node:fs";\nimport react from "react";\nimport { foo } from "@/lib/foo";\nimport { bar } from "./bar";`,
        },
        // Single import
        {
          code: `import react from "react";`,
        },
        // No imports
        {
          code: `const x = 1;`,
        },
        // Alphabetized within group (case-insensitive)
        {
          code: `import a from "alpha";\nimport b from "Beta";\nimport c from "charlie";`,
        },
        // Type imports interleaved by source path
        {
          code: `import type { Metadata } from "next";\nimport react from "react";\nimport { foo } from "@/lib/foo";`,
        },
        // Relative: parent and sibling together, alphabetized
        {
          code: `import { a } from "../a";\nimport { b } from "./b";`,
        },
        // Index import grouped with relative
        {
          code: `import react from "react";\nimport { foo } from ".";`,
        },
        // Internal alphabetized
        {
          code: `import { a } from "@/aaa";\nimport { b } from "@/bbb";`,
        },
      ],
      invalid: [
        // External before builtin
        {
          code: `import react from "react";\nimport fs from "node:fs";`,
          output: `import fs from "node:fs";\nimport react from "react";`,
          errors: [{ messageId: "wrongOrder" }],
        },
        // Internal before external
        {
          code: `import { foo } from "@/lib/foo";\nimport react from "react";`,
          output: `import react from "react";\nimport { foo } from "@/lib/foo";`,
          errors: [{ messageId: "wrongOrder" }],
        },
        // Not alphabetized within group
        {
          code: `import z from "zeta";\nimport a from "alpha";`,
          output: `import a from "alpha";\nimport z from "zeta";`,
          errors: [{ messageId: "wrongOrder" }],
        },
        // Relative before internal
        {
          code: `import { bar } from "./bar";\nimport { foo } from "@/lib/foo";`,
          output: `import { foo } from "@/lib/foo";\nimport { bar } from "./bar";`,
          errors: [{ messageId: "wrongOrder" }],
        },
        // Complex reorder
        {
          code: `import { bar } from "./bar";\nimport react from "react";\nimport { foo } from "@/lib/foo";`,
          output: `import react from "react";\nimport { foo } from "@/lib/foo";\nimport { bar } from "./bar";`,
          errors: [{ messageId: "wrongOrder" }],
        },
      ],
    });
  });
});
