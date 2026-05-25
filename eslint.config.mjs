import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/_generated/**",
      "**/dist/**",
      "**/build/**",
      "**/.worktrees/**",
      "**/scripts/**",
    ],
  },
  // Base JS rules
  js.configs.recommended,
  // TypeScript rules
  ...tseslint.configs.recommended,
  // React Hooks rules
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  // Next.js rules
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      // Warn on <img> — marketing site uses it intentionally in some places
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "error",
    },
  },
  // Project-specific overrides
  {
    rules: {
      // Allow unused vars with underscore prefix
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Allow explicit any (too many to fix at once)
      "@typescript-eslint/no-explicit-any": "off",
      // Allow empty interfaces (common in Convex types)
      "@typescript-eslint/no-empty-object-type": "off",
      // Allow empty functions (common in Convex handlers)
      "@typescript-eslint/no-empty-function": "off",
      // Allow require() in config files
      "@typescript-eslint/no-require-imports": "warn",
      // Downgrade no-undef to warn (Convex globals, SSR edge cases)
      "no-undef": "warn",
      // Useless escape is minor
      "no-useless-escape": "warn",
    },
  }
);
