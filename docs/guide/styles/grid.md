# grid-утилиты

Набор из 180 CSS-классов для гридов. Именование как в Tailwind, но это обычный
статический CSS: ни сборщика утилит, ни рантайма, ни сканирования исходников.
Файл `src/app/styles/utils/grid.css` целиком генерируется скриптом.

> **Про префикс в примерах.** Ниже классы записаны без префикса — `grid`,
> `grid-cols-3`. Сейчас файлы сгенерированы с `--prefix cost-`, поэтому в
> разметке они называются `cost-grid`, `cost-grid-cols-3`, а отрицательные —
> `-cost-col-start-1`. Проверить текущий префикс можно в шапке самого
> CSS-файла, строка «Сгенерировано».

> **`gap-*` лежит в `flex.css`.** Свойство общее для флекса и грида,
> дублировать правила в двух файлах смысла нет. Пользуетесь гридом —
> подключайте оба файла.

---

## Генерация

```bash
npm run styles:grid                        # .grid  .grid-cols-3
npm run styles:grid -- --prefix cost-      # .cost-grid  .cost-grid-cols-3
```

Скрипт: `scripts/css/generate-grid.mjs`, общая часть — в `scripts/css/_shared.mjs`.
Чистый Node, без зависимостей. Результат: `src/app/styles/utils/grid.css`
(перезаписывается целиком).

> **Файл руками не правят.** Любая правка исчезнет при следующей генерации.
> Нужен новый класс или другое значение — меняйте генератор.

### Почему тут нет `--step`

У остальных генераторов флаг `--step` задаёт пиксельный шаг шкалы. У grid
пиксельной шкалы нет вовсе: все значения — это количество колонок, номера линий
и ключевые слова. Единственное, что меряется в пикселях, — расстояние между
ячейками, а это `gap-*` из `flex.css`, и шаг ему задаёт генератор flex.

### Подключение

```css
/* src/app/styles/index.css */
/* core */
@import './resets.css';
@import './app.css';

/* utils */
@import './utils/flex.css';
@import './utils/margin.css';
@import './utils/padding.css';
@import './utils/grid.css';
```

---

## Справочник классов

### Контейнер

| класс                          | CSS                                                |
| ------------------------------ | -------------------------------------------------- |
| `grid`                         | `display: grid`                                    |
| `inline-grid`                  | `display: inline-grid`                             |
| `grid-cols-1` … `grid-cols-12` | `grid-template-columns: repeat(N, minmax(0, 1fr))` |
| `grid-cols-none`               | `grid-template-columns: none`                      |
| `grid-cols-subgrid`            | `grid-template-columns: subgrid`                   |
| `grid-rows-1` … `grid-rows-12` | `grid-template-rows: repeat(N, minmax(0, 1fr))`    |
| `grid-rows-none`               | `grid-template-rows: none`                         |
| `grid-rows-subgrid`            | `grid-template-rows: subgrid`                      |

`minmax(0, 1fr)` вместо голого `1fr` — это не придирка. По умолчанию минимальный
размер трека равен `auto`, то есть по содержимому, и одно длинное неразрывное
слово или широкая картинка растянут колонку сверх её доли, сломав сетку.
`minmax(0, 1fr)` разрешает треку сжиматься до нуля.

### Размещение элемента

| класс                                                                 | CSS                                          |
| --------------------------------------------------------------------- | -------------------------------------------- |
| `col-auto`                                                            | `grid-column: auto`                          |
| `col-span-1` … `col-span-12`                                          | `grid-column: span N / span N`               |
| `col-span-full`                                                       | `grid-column: 1 / -1` — на всю ширину сетки  |
| `col-start-1` … `col-start-13`                                        | `grid-column-start: N`                       |
| `-col-start-1` … `-col-start-13`                                      | `grid-column-start: -N` — счёт линий с конца |
| `col-start-auto`                                                      | `grid-column-start: auto`                    |
| `col-end-1` … `col-end-13`                                            | `grid-column-end: N`                         |
| `-col-end-1` … `-col-end-13`                                          | `grid-column-end: -N`                        |
| `col-end-auto`                                                        | `grid-column-end: auto`                      |
| `row-auto`, `row-span-*`, `row-span-full`, `row-start-*`, `row-end-*` | то же для строк                              |

Линий всегда на одну больше, чем треков: у `grid-cols-4` линии с 1 по 5,
поэтому `col-start-*` и `col-end-*` идут до 13. Отрицательные номера считают
с конца: `-col-start-1` — последняя линия, `-col-start-2` — предпоследняя.

### Автоматические треки

| класс                                         | CSS                        |
| --------------------------------------------- | -------------------------- |
| `grid-flow-row` / `grid-flow-col`             | направление автозаполнения |
| `grid-flow-dense`                             | `dense` — заполнять дыры   |
| `grid-flow-row-dense` / `grid-flow-col-dense` | комбинации                 |
| `auto-cols-auto` / `-min` / `-max` / `-fr`    | `grid-auto-columns`        |
| `auto-rows-auto` / `-min` / `-max` / `-fr`    | `grid-auto-rows`           |

`auto-*` управляют треками, которые грид создаёт сам, когда элементов больше,
чем описано в `grid-cols-*` / `grid-rows-*`.

### Выравнивание

| класс                                                                                        | CSS             |
| -------------------------------------------------------------------------------------------- | --------------- |
| `justify-items-start` / `-end` / `-center` / `-stretch` / `-normal`                          | `justify-items` |
| `justify-self-auto` / `-start` / `-end` / `-center` / `-stretch`                             | `justify-self`  |
| `place-items-start` / `-end` / `-center` / `-baseline` / `-stretch`                          | `place-items`   |
| `place-content-start` / `-end` / `-center` / `-between` / `-around` / `-evenly` / `-stretch` | `place-content` |
| `place-self-auto` / `-start` / `-end` / `-center` / `-stretch`                               | `place-self`    |

`items-*`, `self-*`, `justify-*` и `content-*` — в `flex.css`, они работают и
здесь. Разделение простое: то, что есть только у грида (`justify-items`,
`justify-self`, `place-*`), лежит в этом файле, общее с флексом — в том.

---

## Типовые раскладки

### Адаптивная сетка карточек

```html
<div class="grid grid-cols-1 gap-4">
  <article class="p-4">01</article>
  <article class="p-4">02</article>
  <article class="p-4">03</article>
</div>
```

Количество колонок по брейкпоинтам — вручную:

```css
@media (min-width: 40rem) {
  .sm\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 64rem) {
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
```

### Центрирование одной строкой

```html
<div class="grid place-items-center">
  <div>Ровно по центру</div>
</div>
```

Короче флексового `flex items-center justify-center`.

### Дашборд: плитки разного размера

```html
<div class="grid grid-cols-4 grid-rows-2 gap-4">
  <div class="col-span-2 row-span-2">График</div>
  <div>KPI 1</div>
  <div>KPI 2</div>
  <div class="col-span-2">Таблица</div>
</div>
```

### Форма в две колонки с полем во всю ширину

```html
<form class="grid grid-cols-2 gap-4">
  <label>Имя</label>
  <label>Фамилия</label>
  <label class="col-span-full">Комментарий</label>
  <button class="col-span-full justify-self-end">Отправить</button>
</form>
```

`col-span-full` — это `1 / -1`, то есть от первой линии до последней независимо
от числа колонок. `justify-self-end` прижимает кнопку к правому краю ячейки.

### Элемент в конкретных линиях

```html
<div class="grid grid-cols-4 gap-4">
  <div class="col-start-2 col-end-4">со второй линии по четвёртую</div>
</div>
```

### Выравнивание карточек через subgrid

```html
<div class="grid grid-cols-3 gap-4">
  <article class="grid grid-rows-subgrid row-span-3 gap-2">
    <h3>Заголовок</h3>
    <p>Описание разной длины.</p>
    <button>Купить</button>
  </article>
</div>
```

Карточка наследует строки родительской сетки, поэтому кнопки во всех карточках
встанут на одну линию, даже если описания разной высоты.

---

## Грабли

**`justify-*` и `justify-items-*` — разные вещи.** `justify-content` (класс
`justify-center` из `flex.css`) двигает **всю сетку** внутри контейнера, когда
у неё остаётся свободное место. `justify-items-center` центрирует **содержимое
каждой ячейки**. Их часто путают, и результат выглядит как «класс не работает».

**Во флексе `justify-items` не действует вовсе.** Это чисто гридовое свойство.

**`min-width: 0` для обрезки текста.** Как и во флексе, элемент грида не
сжимается меньше своего содержимого. Без `min-width: 0` (или `overflow: hidden`)
на ячейке не сработают ни `text-overflow: ellipsis`, ни внутренняя прокрутка.
`minmax(0, 1fr)` в `grid-cols-*` решает это на уровне трека, но не на уровне
самого элемента.

**Отступ между ячейками — это `gap-*`, а не padding у детей.** Второй вариант
даст лишние поля по краям сетки и удвоенный отступ между соседями.

**`grid-flow-dense` меняет визуальный порядок.** Элементы переставляются,
чтобы заполнить дыры, и порядок на экране расходится с порядком в DOM.
Для клавиатурной навигации и скринридеров порядок остаётся исходным — на
интерактивных элементах это заметная проблема доступности.

**Линий на одну больше, чем колонок.** В сетке из четырёх колонок пять линий.
`col-end-4` заканчивает элемент **перед** четвёртой колонкой, а не после неё.
Классическая ошибка — написать `col-start-1 col-end-4` в расчёте на «все четыре
колонки»; правильно `col-end-5` или просто `col-span-full`.

**Порядок правил важнее порядка в атрибуте.** Все классы одной специфичности,
выигрывает тот, что **ниже в файле**. Порядок секций в `grid.css`: включение,
колонки, строки, размещение по колонкам, размещение по строкам, автозаполнение,
выравнивание. Поэтому `class="col-span-2 col-start-3"` даст и span, и start —
это разные свойства, конфликта нет, но `class="col-span-full col-span-2"`
оставит `span 2`, потому что `col-span-full` идёт выше.

**Адаптива нет.** Генератор не делает `md:grid-cols-3` — полная матрица
брейкпоинтов раздула бы файл в пять раз. Нужный набор оборачивается вручную:

```css
@media (min-width: 48rem) {
  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
```

Брейкпоинты как в Tailwind: `sm` 40rem (640px), `md` 48rem (768px),
`lg` 64rem (1024px), `xl` 80rem (1280px), `2xl` 96rem (1536px).
