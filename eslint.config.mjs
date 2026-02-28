// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    prettier,
    globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
    {
        rules: {
            curly: ['error', 'all'],
            'brace-style': ['error', '1tbs', { allowSingleLine: false }],
            'nonblock-statement-body-position': ['error', 'below'],
        },
    },
    ...storybook.configs["flat/recommended"]
]);

export default eslintConfig;
