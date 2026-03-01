import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import nextPlugin from "@next/eslint-plugin-next";
import importPlugin from "eslint-plugin-import";
import tailwindcss from "eslint-plugin-better-tailwindcss";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  reactHooks.configs.flat["recommended-latest"],
  tailwindcss.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react,
      "jsx-a11y": jsxA11y,
      "@next/next": nextPlugin,
      import: importPlugin,
    },
    settings: {
      react: { version: "detect" },
      "better-tailwindcss": {
        entryPoint: "src/app/globals.css",
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...jsxA11y.configs.recommended.rules,
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
      "react/prop-types": "off",
      // Label component receives htmlFor via props spread - valid pattern
      "jsx-a11y/label-has-associated-control": [
        "error",
        { assert: "either", depth: 3 },
      ],
      // Import ordering
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling"],
            "index",
            "type",
          ],
          "newlines-between": "never",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      // Disable line wrapping - causes React hydration mismatches with SSR
      "better-tailwindcss/enforce-consistent-line-wrapping": "off",
      // Allow theme-scoping class names used in brand demos
      "better-tailwindcss/no-unknown-classes": [
        "error",
        { ignore: ["dark", "light"] },
      ],
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
      "scripts",
      "**/*.{js,mjs}",
    ],
  },
);
