// eslint.config.mjs
import tseslint from 'typescript-eslint';
import playwrightPlugin from 'eslint-plugin-playwright';

export default tseslint.config(
  {
    // Explicitly target your typescript files
    files: ['**/*.ts'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      playwright: playwrightPlugin,
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      'playwright/missing-playwright-await': 'error',
    },
  },
  {
    // Ignore the config file itself from type-aware rules
    ignores: ['eslint.config.mjs'],
  }
);