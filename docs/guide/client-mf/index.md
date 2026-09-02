# Конфигурация

### Почему в MF-конфиге именно такие настройки

- `dev.assetPrefix` и `output.assetPrefix` — абсолютный URL. Чанки remote'а грузит
  хост со своего origin, и без абсолютных ссылок он будет искать их у себя.
  В проде адрес подставляется через `PUBLIC_MF_URL`.
- `server.headers` с `Access-Control-Allow-Origin` — иначе браузер не отдаст хосту
  `remoteEntry.js` кросс-доменно.
- `optimization.splitChunks: false` — Module Federation несовместим с выносом
  общих чанков.
- `shared` с `singleton: true` для React и react-dom — два экземпляра React
  ломают хуки. `@tanstack/react-query` в singleton, чтобы кэш запросов был общий.
- **Асинхронная граница в точке входа.** `src/main.tsx` содержит только
  `void import('./app/bootstrap')`, а вся инициализация живёт в `bootstrap.tsx`.
  Без этого remote падает с `RUNTIME-006: Invalid loadShareSync function call`:
  entry тянет react синхронно, когда share scope ещё не готов. Динамический
  импорт откладывает код приложения на отдельный чанк, который грузится уже
  после инициализации shared.
