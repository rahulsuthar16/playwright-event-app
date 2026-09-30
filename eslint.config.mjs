// eslint.config.mjs
import tseslint from 'typescript-eslint';
import playwrightPlugin from 'eslint-plugin-playwright';

export default tseslint.config(
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                project: true, // Points to your tsconfig.json
            },
        },
        plugins: {
            playwright: playwrightPlugin,
        },
        rules: {
            // Flags any unawaited Promise (like missing await on click or fill)
            '@typescript-eslint/no-floating-promises': 'error',

            // Playwright-specific rules for missing awaits on assertions/actions
            'playwright/missing-playwright-await': 'error',
        },
    }
);