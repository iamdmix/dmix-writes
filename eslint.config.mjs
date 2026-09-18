import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "out/**", "next-env.d.ts", "*.tsbuildinfo"],
  },
  ...compat.extends("next", "next/core-web-vitals"),
  {
    rules: {
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
