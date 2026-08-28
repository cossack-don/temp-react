#!/usr/bin/env node
/**
 * Генератор margin-утилит. Пишет один файл: src/app/styles/margin.css
 *
 *   node scripts/css/generate-margin.mjs                   → .m-4 (16px)  .mx-auto
 *   node scripts/css/generate-margin.mjs --prefix con-     → .con-m-4      .con-mx-auto
 *   node scripts/css/generate-margin.mjs --step 2          → .m-4 = 8px
 *   node scripts/css/generate-margin.mjs --prefix con- --step 2
 *
 * Отрицательные классы получают префикс после минуса:  -mt-4 → -con-mt-4
 * Файл перезаписывается целиком — правьте генератор, а не результат.
 */
import { SCALE, createHelpers, header, parseOptions, writeCss } from './_shared.mjs'

const options = parseOptions()
const { prefix, step } = options
const { cls, size, rules, one } = createHelpers(options)

/** Сторона: класс, CSS-свойство, человеческое описание. */
const SIDES = [
  ['m', 'margin', 'все стороны'],
  ['mx', 'margin-inline', 'по горизонтали — слева и справа'],
  ['my', 'margin-block', 'по вертикали — сверху и снизу'],
  ['mt', 'margin-top', 'сверху'],
  ['mr', 'margin-right', 'справа'],
  ['mb', 'margin-bottom', 'снизу'],
  ['ml', 'margin-left', 'слева'],
  ['ms', 'margin-inline-start', 'начало строки — слева в LTR, справа в RTL'],
  ['me', 'margin-inline-end', 'конец строки — справа в LTR, слева в RTL'],
  ['mbs', 'margin-block-start', 'начало блока, зависит от writing-mode'],
  ['mbe', 'margin-block-end', 'конец блока'],
]

const out = []

const section = (title, pairs) => {
  out.push(`\n/* ${title} */`)
  out.push(rules(pairs))
}

out.push(
  header({
    title: 'margin — внешние отступы',
    command: `node scripts/css/generate-margin.mjs${prefix ? ` --prefix ${prefix}` : ''}${step !== 4 ? ` --step ${step}` : ''}`,
    note: `
   Шкала: число в классе × ${step}px.
   m-4 = ${4 * step}px, m-2.5 = ${2.5 * step}px, m-px = 1px, m-0 = 0.
   Шаг задаётся флагом --step.
`,
  }),
)

// ---------------------------------------------------------- положительные
for (const [name, property, title] of SIDES) {
  section(`${prefix}${name}-* — ${title}`, [
    ...one(property, SCALE.map((v) => [`${name}-${v}`, size(v)])),
    ...one(property, [[`${name}-auto`, 'auto']]),
  ])
}

// ------------------------------------------------------------ отрицательные
out.push(`
/* Отрицательные отступы: -${prefix}m-4, -${prefix}mt-px и так далее.
   Вытягивают элемент за пределы родителя — например, чтобы картинка
   в карточке легла вплотную к её краям поверх внутреннего padding. */`)

for (const [name, property] of SIDES) {
  out.push(
    rules(
      one(
        property,
        SCALE.filter((v) => v !== '0').map((v) => [`-${name}-${v}`, size(v, true)]),
      ),
    ),
  )
}

// ------------------------------------------------------------------ space-*
out.push(`
/* space-* — отступ между соседними детьми: margin получают все, кроме первого.
   Ломается при переносе строк и конфликтует с собственными margin детей,
   поэтому во flex- и grid-контейнерах почти всегда лучше gap-* из flex.css.
   Остаётся полезным там, где контейнер не flex и не grid. */`)

// селектор с потомками, поэтому собираем строки сами, а не через rules()
out.push(
  [
    ...SCALE.map((v) => `.${cls(`space-x-${v}`)} > * + * { margin-inline-start: ${size(v)}; }`),
    ...SCALE.map((v) => `.${cls(`space-y-${v}`)} > * + * { margin-block-start: ${size(v)}; }`),
  ].join('\n'),
)

out.push(`
/* --------------------------------------------------------------------------
   Адаптивных вариантов здесь нет — нужный набор оборачивается вручную:

   @media (min-width: 48rem) {
     .${cls('md:mt-8')} { margin-top: ${8 * step}px; }
   }

   Брейкпоинты как в Tailwind: sm 40rem, md 48rem, lg 64rem, xl 80rem, 2xl 96rem.
   -------------------------------------------------------------------------- */
`)

writeCss('margin.css', out, options)
