# Запуска

## Требования

- Node.js **20.19+** или **22.12+** (Rspress 2 не заводится ниже);
- npm 10+.

```bash
node -v
npm install
```

## Команды

### Приложение Client Solo

```bash
npm run dev        # http://localhost:3000
npm run build
npm run preview
```

### Client Микрофронтенд

```bash
npm run dev:mf     # http://localhost:3001, remoteEntry.js
npm run build:mf
npm run preview:mf
```

### Локальный Server API

Express 5 запускается напрямую из TypeScript, без шага сборки:

```bash
npm run server     # http://localhost:4000
```

### Документация

```bash
npm run docs:dev      # http://localhost:3100
npm run docs:build    # → docs_build/
npm run docs:preview
```

### Генерация CSS-утилит

```bash
npm run styles:flex
npm run styles:margin
npm run styles:padding
npm run styles:grid
```

Флаги передаются после `--` смотреть подробней в документации CSS-утилиты:

```bash
npm run styles:flex -- --prefix con- --step 2
```

Подробности — в разделе [CSS-утилиты](/guide/styles/).

## Порты

| Порт | Что                       |
| ---- | ------------------------- |
| 3000 | приложение, обычный режим |
| 3001 | приложение как MF remote  |
| 3100 | сайт документации         |
| 4000 | Express API               |
