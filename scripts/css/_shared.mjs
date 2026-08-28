/**
 * Общая часть генераторов CSS-утилит из scripts/css/.
 * Здесь живут разбор аргументов, шкала, экранирование и запись файла —
 * чтобы генераторы не расходились между собой.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/** Ступени шкалы. Число N превращается в N * step пикселей. */
export const SCALE = ['0','px','0.5','1','1.5','2','2.5','3','3.5','4','5','6','7','8',
  '9','10','11','12','14','16','20','24','28','32','40','48','56','64','80','96']

/** Куда складываются сгенерированные файлы. */
const STYLES_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'src',
  'app',
  'styles',
  'utils',
)

/**
 * Разбирает флаги командной строки.
 *   --prefix con-   (или --prefix=con-)   префикс классов, по умолчанию пустой
 *   --step 2        (или --step=2)        шаг шкалы в px, по умолчанию 4
 */
export function parseOptions(argv = process.argv.slice(2)) {
  const flag = (name) => {
    const i = argv.findIndex((a) => a === `--${name}` || a.startsWith(`--${name}=`))
    if (i === -1) return undefined
    return argv[i].includes('=') ? argv[i].split('=').slice(1).join('=') : argv[i + 1]
  }

  const prefix = flag('prefix') ?? ''
  const rawStep = flag('step') ?? '4'
  const step = Number(rawStep)

  if (!Number.isFinite(step) || step <= 0) {
    console.error(`--step должен быть положительным числом, получено: ${rawStep}`)
    process.exit(1)
  }

  return { prefix, step }
}

/** Хелперы, настроенные на конкретные префикс и шаг. */
export function createHelpers({ prefix, step }) {
  /** Вешает префикс и экранирует точку и слэш. Минус остаётся снаружи префикса. */
  const cls = (name) => {
    const negative = name.startsWith('-')
    const body = negative ? name.slice(1) : name
    return (negative ? '-' : '') + (prefix + body).replace(/\./g, '\\.').replace(/\//g, '\\/')
  }

  /** Ступень шкалы в пиксели. '0' → 0, 'px' → 1px, N → N * step. */
  const size = (v, negative = false) => {
    const sign = negative ? '-' : ''
    if (v === '0') return '0'
    if (v === 'px') return `${sign}1px`
    return `${Number(v) * step * (negative ? -1 : 1)}px`
  }

  const rules = (pairs) =>
    pairs
      .map(([name, decls]) => `.${cls(name)} { ${decls.map(([p, v]) => `${p}: ${v};`).join(' ')} }`)
      .join('\n')

  /** Короткая запись для правил с одним свойством. */
  const one = (property, entries) => entries.map(([name, value]) => [name, [[property, value]]])

  const range = (n, from = 1) => Array.from({ length: n }, (_, k) => k + from)

  return { cls, size, rules, one, range }
}

/** Шапка сгенерированного файла. */
export function header({ title, command, note = '' }) {
  return `/* ==========================================================================
   ${title}
   --------------------------------------------------------------------------
   Сгенерировано: ${command}
   Правьте генератор, а не этот файл.
${note}   ========================================================================== */
`
}

/** Пишет файл в src/app/styles и печатает итог. */
export function writeCss(fileName, parts, { prefix, step }) {
  mkdirSync(STYLES_DIR, { recursive: true })
  const text = parts.join('\n')
  writeFileSync(join(STYLES_DIR, fileName), text)

  const count = text.split('\n').filter((line) => line.startsWith('.')).length
  const bits = [prefix ? `префикс "${prefix}"` : 'без префикса']
  // у grid нет пиксельной шкалы, там step не при чём
  if (step != null) bits.push(`шаг ${step}px`)
  console.log(`${fileName}: ${count} классов, ${bits.join(', ')}`)
}
