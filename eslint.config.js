import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import pluginQuery from '@tanstack/eslint-plugin-query'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules', 'docs_build'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // правила TanStack Query: exhaustive-deps для queryKey, stable-query-client и т.д.
  ...pluginQuery.configs['flat/recommended'],

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Fast Refresh ломается, если из файла компонента торчит что-то кроме компонентов
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // Файлы маршрутов экспортируют Route — это не компонент, но так устроен роутер.
  // Роутинг code-based, поэтому мест три: корень, лейауты и router/ внутри модулей.
  {
    files: [
      'src/app/router/**/*.{ts,tsx}',
      'src/app/layouts/**/*.route.{ts,tsx}',
      'src/modules/*/router/**/*.{ts,tsx}',
    ],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },

  // Node-окружение: генераторы CSS, локальный сервер и конфиги сборки.
  // Без этого блока у них нет ни process, ни console — no-undef на ровном месте.
  {
    files: [
      'scripts/**/*.{js,mjs,cjs}',
      'server/**/*.{ts,js}',
      '*.config.{js,ts,mjs}',
      'rsbuild.*.config.ts',
    ],
    languageOptions: {
      globals: globals.node,
    },
  },

  // отключает правила ESLint, которые конфликтуют с Prettier. Всегда последним.
  prettier,
)
