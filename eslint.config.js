import eslintReact from "@eslint-react/eslint-plugin";
import eslintJs from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import { defineConfig } from "eslint/config";
import tailwindcss from "eslint-plugin-better-tailwindcss";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import importOrderPlugin from "./eslint-rules/import-order.js";

export default defineConfig(
  reactHooks.configs.flat["recommended-latest"],
  tailwindcss.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
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
      custom: importOrderPlugin,
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
      "custom/import-order": "error",
      "better-tailwindcss/enforce-consistent-line-wrapping": "off",
      "better-tailwindcss/no-unknown-classes": [
        "error",
        { ignore: ["dark", "light"] },
      ],
    },
  },
  {
    // shadcn calendar uses inline component definitions for react-day-picker's components prop
    files: ["src/components/ui/calendar.tsx"],
    rules: {
      "@eslint-react/no-nested-component-definitions": "off",
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
