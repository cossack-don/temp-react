#!/usr/bin/env node
/**
 * Генератор flex-утилит. Пишет один файл: src/app/styles/flex.css
 *
 *   node scripts/css/generate-flex.mjs                    → .flex      .gap-4 (16px)
 *   node scripts/css/generate-flex.mjs --prefix con-      → .con-flex  .con-gap-4
 *   node scripts/css/generate-flex.mjs --step 2           → .gap-4 = 8px
 *   node scripts/css/generate-flex.mjs --prefix con- --step 2
 *
 * Отрицательные классы получают префикс после минуса:  -order-2 → -con-order-2
 * Файл перезаписывается целиком — правьте генератор, а не результат.
 */
import { SCALE, createHelpers, header, parseOptions, writeCss } from './_shared.mjs'

const options = parseOptions()
const { prefix, step } = options
const { cls, size, rules, one, range } = createHelpers(options)

const out = []

const section = (title, pairs) => {
  out.push(`\n/* ${title} */`)
  out.push(rules(pairs))
}

out.push(
  header({
    title: 'flex — раскладка, выравнивание и gap',
    command: `node scripts/css/generate-flex.mjs${prefix ? ` --prefix ${prefix}` : ''}${step !== 4 ? ` --step ${step}` : ''}`,
    note: `
   Шкала gap-* и basis-*: число в классе × ${step}px.
   basis-4 = ${4 * step}px, gap-2.5 = ${2.5 * step}px, *-px = 1px, *-0 = 0.
   Шаг задаётся флагом --step.
`,
  }),
)

// ---------------------------------------------------------------- контейнер
section('включение', one('display', [
  ['flex', 'flex'],
  ['inline-flex', 'inline-flex'],
]))

section('направление главной оси', one('flex-direction', [
  ['flex-row', 'row'],
  ['flex-row-reverse', 'row-reverse'],
  ['flex-col', 'column'],
  ['flex-col-reverse', 'column-reverse'],
]))

section('перенос на новую строку', one('flex-wrap', [
  ['flex-wrap', 'wrap'],
  ['flex-nowrap', 'nowrap'],
  ['flex-wrap-reverse', 'wrap-reverse'],
]))

// ------------------------------------------------------------------ элемент
section(
  'flex — сокращение grow/shrink/basis.\n   flex-1    = 1 1 0%   элементы получают равную ширину, своя игнорируется\n   flex-auto = 1 1 auto свободное место делится поверх естественной ширины',
  one('flex', [
    ...range(12).map((n) => [`flex-${n}`, String(n)]),
    ['flex-auto', 'auto'],
    ['flex-initial', '0 auto'],
    ['flex-none', 'none'],
  ]),
)

section('grow / shrink по отдельности', [
  ['grow', [['flex-grow', '1']]],
  ['grow-0', [['flex-grow', '0']]],
  ['shrink', [['flex-shrink', '1']]],
  ['shrink-0', [['flex-shrink', '0']]],
])

section('basis — стартовый размер элемента', one('flex-basis', [
  ...SCALE.map((v) => [`basis-${v}`, size(v)]),
  ['basis-auto', 'auto'],
  ['basis-full', '100%'],
  ['basis-1/2', '50%'],
  ['basis-1/3', '33.333333%'],
  ['basis-2/3', '66.666667%'],
  ['basis-1/4', '25%'],
  ['basis-3/4', '75%'],
]))

section('order — визуальный порядок без правки DOM', one('order', [
  ...range(12).map((n) => [`order-${n}`, String(n)]),
  ...range(12).map((n) => [`-order-${n}`, String(-n)]),
  ['order-first', '-9999'],
  ['order-last', '9999'],
  ['order-none', '0'],
]))

// -------------------------------------------------------------- выравнивание
section('justify-content — по главной оси.\n   -safe: при нехватке места выравнивание откатывается к началу,\n   элемент не уезжает за границу с недоступной прокруткой', one('justify-content', [
  ['justify-start', 'flex-start'],
  ['justify-end', 'flex-end'],
  ['justify-end-safe', 'safe flex-end'],
  ['justify-center', 'center'],
  ['justify-center-safe', 'safe center'],
  ['justify-between', 'space-between'],
  ['justify-around', 'space-around'],
  ['justify-evenly', 'space-evenly'],
  ['justify-stretch', 'stretch'],
  ['justify-baseline', 'baseline'],
  ['justify-normal', 'normal'],
]))

section('align-items — по поперечной оси', one('align-items', [
  ['items-start', 'flex-start'],
  ['items-end', 'flex-end'],
  ['items-end-safe', 'safe flex-end'],
  ['items-center', 'center'],
  ['items-center-safe', 'safe center'],
  ['items-baseline', 'baseline'],
  ['items-baseline-last', 'last baseline'],
  ['items-stretch', 'stretch'],
]))

section('align-self — переопределение для одного элемента', one('align-self', [
  ['self-auto', 'auto'],
  ['self-start', 'flex-start'],
  ['self-end', 'flex-end'],
  ['self-center', 'center'],
  ['self-stretch', 'stretch'],
  ['self-baseline', 'baseline'],
]))

section('align-content — распределение рядов, нужен flex-wrap', one('align-content', [
  ['content-normal', 'normal'],
  ['content-start', 'flex-start'],
  ['content-end', 'flex-end'],
  ['content-center', 'center'],
  ['content-between', 'space-between'],
  ['content-around', 'space-around'],
  ['content-evenly', 'space-evenly'],
  ['content-stretch', 'stretch'],
]))

// ---------------------------------------------------------------------- gap
section('gap — расстояние между элементами', [
  ...one('gap', SCALE.map((v) => [`gap-${v}`, size(v)])),
  ...one('column-gap', SCALE.map((v) => [`gap-x-${v}`, size(v)])),
  ...one('row-gap', SCALE.map((v) => [`gap-y-${v}`, size(v)])),
])

out.push(`
/* --------------------------------------------------------------------------
   Адаптивных вариантов здесь нет — нужный набор оборачивается вручную:

   @media (min-width: 48rem) {
     .${cls('md:flex-row')} { flex-direction: row; }
   }

   Брейкпоинты как в Tailwind: sm 40rem, md 48rem, lg 64rem, xl 80rem, 2xl 96rem.
   -------------------------------------------------------------------------- */
`)

writeCss('flex.css', out, options)
