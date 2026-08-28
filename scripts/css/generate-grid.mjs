#!/usr/bin/env node
/**
 * Генератор grid-утилит. Пишет один файл: src/app/styles/grid.css
 *
 *   node scripts/css/generate-grid.mjs                    → .grid  .grid-cols-3
 *   node scripts/css/generate-grid.mjs --prefix cost-     → .cost-grid  .cost-grid-cols-3
 *
 * Флага --step здесь нет: у grid-классов нет пиксельной шкалы, все значения —
 * это номера линий и ключевые слова. Расстояние между ячейками задают gap-*,
 * а они лежат в flex.css, потому что работают и во флексе, и в гриде.
 *
 * Файл перезаписывается целиком — правьте генератор, а не результат.
 */
import { createHelpers, header, parseOptions, writeCss } from './_shared.mjs'

const { prefix } = parseOptions()
const { cls, rules, one, range } = createHelpers({ prefix, step: 4 })

const out = []

const section = (title, pairs) => {
  out.push(`\n/* ${title} */`)
  out.push(rules(pairs))
}

out.push(
  header({
    title: 'grid — гриды',
    command: `node scripts/css/generate-grid.mjs${prefix ? ` --prefix ${prefix}` : ''}`,
    note: `
   gap-*, justify-content и align-items общие с флексом и лежат в flex.css.
   Подключайте оба файла, если пользуетесь гридом.
`,
  }),
)

// ---------------------------------------------------------------- контейнер
section('включение', one('display', [
  ['grid', 'grid'],
  ['inline-grid', 'inline-grid'],
]))

section(
  'колонки. minmax(0, 1fr) вместо голого 1fr — чтобы длинное неразрывное слово\n   не раздувало колонку сверх её доли',
  one('grid-template-columns', [
    ...range(12).map((n) => [`grid-cols-${n}`, `repeat(${n}, minmax(0, 1fr))`]),
    ['grid-cols-none', 'none'],
    ['grid-cols-subgrid', 'subgrid'],
  ]),
)

section('строки', one('grid-template-rows', [
  ...range(12).map((n) => [`grid-rows-${n}`, `repeat(${n}, minmax(0, 1fr))`]),
  ['grid-rows-none', 'none'],
  ['grid-rows-subgrid', 'subgrid'],
]))

// ---------------------------------------------------- размещение элемента
section('размещение по колонкам. Отрицательный номер считает линии с конца', [
  ...one('grid-column', [
    ['col-auto', 'auto'],
    ...range(12).map((n) => [`col-span-${n}`, `span ${n} / span ${n}`]),
    ['col-span-full', '1 / -1'],
  ]),
  ...one('grid-column-start', [
    ...range(13).map((n) => [`col-start-${n}`, String(n)]),
    ...range(13).map((n) => [`-col-start-${n}`, String(-n)]),
    ['col-start-auto', 'auto'],
  ]),
  ...one('grid-column-end', [
    ...range(13).map((n) => [`col-end-${n}`, String(n)]),
    ...range(13).map((n) => [`-col-end-${n}`, String(-n)]),
    ['col-end-auto', 'auto'],
  ]),
])

section('размещение по строкам', [
  ...one('grid-row', [
    ['row-auto', 'auto'],
    ...range(12).map((n) => [`row-span-${n}`, `span ${n} / span ${n}`]),
    ['row-span-full', '1 / -1'],
  ]),
  ...one('grid-row-start', [
    ...range(13).map((n) => [`row-start-${n}`, String(n)]),
    ['row-start-auto', 'auto'],
  ]),
  ...one('grid-row-end', [
    ...range(13).map((n) => [`row-end-${n}`, String(n)]),
    ['row-end-auto', 'auto'],
  ]),
])

// ------------------------------------------------------------ неявные треки
section('направление автозаполнения. dense переставляет элементы, чтобы\n   заполнить дыры — визуальный порядок разойдётся с порядком в DOM', one('grid-auto-flow', [
  ['grid-flow-row', 'row'],
  ['grid-flow-col', 'column'],
  ['grid-flow-dense', 'dense'],
  ['grid-flow-row-dense', 'row dense'],
  ['grid-flow-col-dense', 'column dense'],
]))

section('размер треков, созданных автоматически', [
  ...one('grid-auto-columns', [
    ['auto-cols-auto', 'auto'],
    ['auto-cols-min', 'min-content'],
    ['auto-cols-max', 'max-content'],
    ['auto-cols-fr', 'minmax(0, 1fr)'],
  ]),
  ...one('grid-auto-rows', [
    ['auto-rows-auto', 'auto'],
    ['auto-rows-min', 'min-content'],
    ['auto-rows-max', 'max-content'],
    ['auto-rows-fr', 'minmax(0, 1fr)'],
  ]),
])

// ------------------------------------------------------------- выравнивание
section('выравнивание содержимого ячеек по горизонтали — только grid,\n   во флексе justify-items не действует', [
  ...one('justify-items', ['start', 'end', 'center', 'stretch', 'normal'].map((v) => [`justify-items-${v}`, v])),
  ...one('justify-self', ['auto', 'start', 'end', 'center', 'stretch'].map((v) => [`justify-self-${v}`, v])),
])

section('place-* — сокращения для пары align + justify', [
  ...one('place-items', ['start', 'end', 'center', 'baseline', 'stretch'].map((v) => [`place-items-${v}`, v])),
  ...one('place-content', [
    ['place-content-start', 'start'],
    ['place-content-end', 'end'],
    ['place-content-center', 'center'],
    ['place-content-between', 'space-between'],
    ['place-content-around', 'space-around'],
    ['place-content-evenly', 'space-evenly'],
    ['place-content-stretch', 'stretch'],
  ]),
  ...one('place-self', ['auto', 'start', 'end', 'center', 'stretch'].map((v) => [`place-self-${v}`, v])),
])

out.push(`
/* --------------------------------------------------------------------------
   Расстояние между ячейками — gap-* из flex.css.

   Адаптивных вариантов здесь нет — нужный набор оборачивается вручную:

   @media (min-width: 48rem) {
     .${cls('md:grid-cols-3')} { grid-template-columns: repeat(3, minmax(0, 1fr)); }
   }

   Брейкпоинты как в Tailwind: sm 40rem, md 48rem, lg 64rem, xl 80rem, 2xl 96rem.
   -------------------------------------------------------------------------- */
`)

writeCss('grid.css', out, { prefix, step: null })
