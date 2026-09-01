# Client

Клиентская часть — приложение в `src/`. Этот обзор про то, чем в нём
удерживается единый вид кода: три файла в корне проекта, у каждого своя зона
ответственности, и они намеренно не пересекаются.

| Файл               | Кто исполняет | За что отвечает                                            |
| ------------------ | ------------- | ---------------------------------------------------------- |
| `.editorconfig`    | сам редактор  | отступы, кодировка, перевод строки — **пока вы печатаете** |
| `.prettierrc.json` | Prettier      | внешний вид кода: кавычки, переносы, запятые               |
| `eslint.config.js` | ESLint        | смысл кода: ошибки, опасные конструкции, правила хуков     |

Короткая формула: **EditorConfig — до сохранения, Prettier — как выглядит,
ESLint — что нельзя.**

## .editorconfig — правила для редактора

Читается почти любой IDE (в VS Code нужно расширение EditorConfig, в WebStorm
поддержка встроена). Работает до всякой сборки: вы просто нажимаете Tab, и
редактор уже знает, что вставить.

```ini
# root = true останавливает поиск конфигов вверх по дереву.
# Без него настройки из родительских папок подмешались бы к нашим.
root = true

# [*] — правила для всех файлов проекта
[*]
# кодировка файлов
charset = utf-8

# перевод строки Unix. На Windows без этого git начнёт видеть
# изменения во всём файле вместо одной правленой строки
end_of_line = lf

# отступы пробелами, не табами
indent_style = space

# два пробела на уровень вложенности
indent_size = 2

# пустая строка в конце файла: без неё diff показывает
# «\ No newline at end of file» при каждой правке последней строки
insert_final_newline = true

# срезать пробелы в конце строк
trim_trailing_whitespace = true

# [*.md] переопределяет общее правило только для Markdown
[*.md]
# в Markdown два пробела в конце строки — осмысленный перенос.
# Общее правило их бы съело и поломало разметку
trim_trailing_whitespace = false
```

---

## .prettierrc.json — как выглядит код

Prettier не смотрит на смысл. Он разбирает файл в AST и печатает заново по
своим правилам — поэтому спорить о расстановке скобок в ревью больше не о чем.

```jsonc
{
  // без точек с запятой в конце строк
  "semi": false,

  // одинарные кавычки в TS/JS: import { api } from './http'
  "singleQuote": true,

  // а в JSX-атрибутах двойные: className="row" — как в обычном HTML
  "jsxSingleQuote": false,

  // висячая запятая везде, включая аргументы функций.
  // Строка в конец списка даёт diff в одну строку, а не в две
  "trailingComma": "all",

  // мягкая граница переноса. Не жёсткий лимит, а ориентир:
  // Prettier старается уложиться, но не рвёт то, что рвать нельзя
  "printWidth": 90,

  // ширина отступа. Совпадает с indent_size в .editorconfig — иначе
  // редактор и форматтер будут переписывать файл друг за другом
  "tabWidth": 2,

  // скобки у одиночного аргумента стрелки: (value) => value + 1.
  // Не косметика: второй аргумент или тип добавляется потом
  "arrowParens": "always",

  // дублирует end_of_line из .editorconfig.
  // Prettier про EditorConfig не знает и переписал бы по-своему
  "endOfLine": "lf",
}
```

:::warning Комментарии выше — только для чтения
В `.prettierrc.json` их вставлять нельзя: это строгий JSON, Prettier упадёт с
ошибкой парсинга. Если комментарии нужны в самом файле — переименуйте его в
`.prettierrc.json5`, там они разрешены (и кавычки у ключей можно убрать).
:::

`.prettierignore` исключает то, что форматировать не надо:

```bash
node_modules/
dist/
package-lock.json      # генерируется npm, править бессмысленно
*.module.css.d.ts      # генерирует @rsbuild/plugin-typed-css-modules
```

```bash
npm run format         # переписать файлы
npm run format:check   # только проверить, ничего не трогая — для CI
```

---

## eslint.config.js — что нельзя

Flat config (ESLint 9+): не объект с `extends`, а массив блоков. **Порядок
важен** — каждый следующий блок переопределяет предыдущие для совпавших файлов.

<!-- prettier-ignore -->
```js
export default tseslint.config(
  {
    // сюда линтер не заходит вообще: сборки приложения и документации
    ignores: ['dist', 'node_modules', 'docs_build'],
  },

  // базовые ошибки JS: недостижимый код, дублирующиеся ключи объекта
  js.configs.recommended,

  // правила TypeScript поверх них
  ...tseslint.configs.recommended,

  // TanStack Query: полнота queryKey, стабильность queryClient
  ...pluginQuery.configs['flat/recommended'],

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      // код приложения выполняется в браузере: window, document, fetch
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // хук внутри условия или цикла — всегда ошибка
      'react-hooks/rules-of-hooks': 'error',

      // неполный массив зависимостей: иногда так и задумано
      'react-hooks/exhaustive-deps': 'warn',

      // Fast Refresh ломается, если из файла компонента торчит
      // что-то ещё. allowConstantExport разрешает экспорт
      // констант — они безопасны
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // типы импортируются отдельной строкой:
      // import type { Foo } from './foo'. Не косметика: в tsconfig
      // включён verbatimModuleSyntax, при нём сборщик не догадается
      // сам, что импорт был типом, и оставит мёртвый импорт
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],

      // неиспользуемая переменная — ошибка, но осознанно названную
      // с подчёркиванием (_event) линтер пропускает
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // Исключение 1. Маршруты экспортируют объект Route, не компонент.
  // Роутинг code-based: корень, лейауты и router/ внутри модулей
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

  // Исключение 2. Тут среда Node, а не браузер. Блок выше даёт
  // globals.browser только для .ts/.tsx, а генераторы CSS — это
  // .mjs: без этого блока у них нет ни process, ни console
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

  // Всегда последним: гасит правила, спорящие с Prettier.
  // Поставить выше — и они снова включатся следующими блоками
  prettier,
)
```

```bash
npm run lint       # проверить
npm run lint:fix   # починить то, что чинится автоматически
```

---

## Почему их трое, а не один

Каждый следующий инструмент видит то, чего не видит предыдущий:

```
печатаете код   →   .editorconfig    отступы и кодировка на лету
сохраняете      →   Prettier         переписывает вид файла
коммитите       →   ESLint           ловит неверное по смыслу
```

Prettier и ESLint могли бы подраться за одни и те же скобки — этого не
происходит, потому что `eslint-config-prettier` стоит в конфиге последним и
выключает у ESLint всё, что касается внешнего вида. Правила остаются только
там, где речь о смысле.
