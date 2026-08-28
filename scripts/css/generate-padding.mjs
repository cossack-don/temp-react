#!/usr/bin/env node
/**
 * Генератор padding-утилит. Пишет один файл: src/app/styles/padding.css
 *
 *   node scripts/css/generate-padding.mjs                    → .p-4 (16px)
 *   node scripts/css/generate-padding.mjs --prefix cost-     → .cost-p-4
 *   node scripts/css/generate-padding.mjs --step 2           → .p-4 = 8px
 *   node scripts/css/generate-padding.mjs --prefix cost- --step 2
 *
 * В отличие от margin здесь нет ни отрицательных значений, ни `auto`:
 * padding не бывает отрицательным, а `padding: auto` — невалидный CSS.
 *
 * Файл перезаписывается целиком — правьте генератор, а не результат.
 */
import { SCALE, createHelpers, header, parseOptions, writeCss } from './_shared.mjs'

const options = parseOptions()
const { prefix, step } = options
const { cls, size, rules, one } = createHelpers(options)

/** Сторона: класс, CSS-свойство, человеческое описание. */
const SIDES = [
  ['p', 'padding', 'все стороны'],
  ['px', 'padding-inline', 'по горизонтали — слева и справа'],
  ['py', 'padding-block', 'по вертикали — сверху и снизу'],
  ['pt', 'padding-top', 'сверху'],
  ['pr', 'padding-right', 'справа'],
  ['pb', 'padding-bottom', 'снизу'],
  ['pl', 'padding-left', 'слева'],
  ['ps', 'padding-inline-start', 'начало строки — слева в LTR, справа в RTL'],
  ['pe', 'padding-inline-end', 'конец строки — справа в LTR, слева в RTL'],
  ['pbs', 'padding-block-start', 'начало блока, зависит от writing-mode'],
  ['pbe', 'padding-block-end', 'конец блока'],
]

const out = []

const section = (title, pairs) => {
  out.push(`\n/* ${title} */`)
  out.push(rules(pairs))
}

out.push(
  header({
    title: 'padding — внутренние отступы',
    command: `node scripts/css/generate-padding.mjs${prefix ? ` --prefix ${prefix}` : ''}${step !== 4 ? ` --step ${step}` : ''}`,
    note: `
   Шкала: число в классе × ${step}px.
   p-4 = ${4 * step}px, p-2.5 = ${2.5 * step}px, p-px = 1px, p-0 = 0.
   Шаг задаётся флагом --step.
`,
  }),
)

for (const [name, property, title] of SIDES) {
  section(
    `${prefix}${name}-* — ${title}`,
    one(property, SCALE.map((v) => [`${name}-${v}`, size(v)])),
  )
}

out.push(`
/* --------------------------------------------------------------------------
   Более конкретный класс перебивает более общий за счёт порядка в файле:
   p-* идёт выше, значит "${cls('p-4')} ${cls('pt-8')}" даст сверху ${8 * step}px,
   а с остальных сторон ${4 * step}px.

   Адаптивных вариантов здесь нет — нужный набор оборачивается вручную:

   @media (min-width: 48rem) {
     .${cls('md:p-8')} { padding: ${8 * step}px; }
   }

   Брейкпоинты как в Tailwind: sm 40rem, md 48rem, lg 64rem, xl 80rem, 2xl 96rem.
   -------------------------------------------------------------------------- */
`)

writeCss('padding.css', out, options)
