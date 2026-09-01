import eslintReact from "@eslint-react/eslint-plugin";
import eslintJs from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import { defineConfig } from "eslint/config";
import tailwindcss from "eslint-plugin-better-tailwindcss";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import importOrderPlugin from "./eslint-rules/import-order.js";
import slopPlugin from "./eslint-rules/slop.js";

const custom = {
  rules: { ...importOrderPlugin.rules, ...slopPlugin.rules },
};

const slopRuleNames = Object.keys(slopPlugin.rules).map(
  (name) => `custom/${name}`,
);
const slopRules = Object.fromEntries(
  slopRuleNames.map((name) => [name, "error"]),
);

export default defineConfig(
  reactHooks.configs.flat["recommended-latest"],
  tailwindcss.configs.recommended,
  {
    // The slop rules need no type information, so they run over every TS file
    // from an untyped block — including scripts/, which the type-checked block
    // below cannot take.
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { custom },
    rules: slopRules,
  },
  {
    files: ["**/*.{ts,tsx}"],
    // scripts/ carries ~68 pre-existing strictTypeChecked violations
    // (restrict-template-expressions, no-unnecessary-condition) and was ignored
    // before the slop rules existed, so it stays out of the typed block and
    // takes the slop rules from the untyped block above.
    ignores: ["scripts/**"],
    extends: [
      eslintJs.configs.recommended,
      tseslint.configs.strictTypeChecked,
      eslintReact.configs["recommended-typescript"],
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@next/next": nextPlugin,
      custom,
    },
    settings: {
      "better-tailwindcss": {
        entryPoint: "src/app/globals.css",
      },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@eslint-react/hooks-extra/no-direct-set-state-in-use-effect": "off",
      "custom/import-order": "error",
      "better-tailwindcss/enforce-consistent-line-wrapping": "off",
      "better-tailwindcss/no-unknown-classes": [
        "error",
        // `dark` / `light` scope the theme CSS variables for a subtree; they are
        // plain marker classes, not Tailwind utilities, so the resolver can't
        // see them.
        { ignore: ["dark", "light"] },
      ],
    },
  },
  {
    // The rule fixtures are deliberately full of slop, so the slop rules must
    // not run on them.
    files: ["eslint-rules/__tests__/**"],
    rules: Object.fromEntries(slopRuleNames.map((name) => [name, "off"])),
  },
  {
    // JSON-LD structured data (the shared JsonLd component and layouts), shadcn
    // chart styles, and global-error inline CSS require dangerouslySetInnerHTML
    files: [
      "src/components/seo/JsonLd.tsx",
      "src/app/**/layout.tsx",
      "src/app/global-error.tsx",
      "src/components/ui/chart.tsx",
    ],
    rules: {
      "@eslint-react/dom-no-dangerously-set-innerhtml": "off",
    },
  },
  {
    // global-error.tsx renders a standalone HTML document outside the Next.js
    // router context, so next/link is unavailable — plain <a> is correct here.
    files: ["src/app/global-error.tsx"],
    rules: {
      "@next/next/no-html-link-for-pages": "off",
    },
  },
  {
    // guide-parts.tsx deliberately walks the guide body with Children.map +
    // cloneElement to inject server-rendered section anchor ids (the standard
    // heading-anchor transform, à la rehype-slug), so the "uncommon React API"
    // nudges don't apply here.
    files: ["src/components/guides/guide-parts.tsx"],
    rules: {
      "@eslint-react/no-children-map": "off",
      "@eslint-react/no-clone-element": "off",
    },
  },
  {
    ignores: [
      "node_modules",
      ".next",
      ".claude/worktrees",
      "out",
      "coverage",
      "dist",
      "playwright-report",
      "test-results",
      "next-env.d.ts",
      "**/*.{js,mjs}",
    ],
  },
);
