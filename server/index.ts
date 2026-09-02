import { createApp } from './app.ts'
import { PORT } from './config.ts'

createApp().listen(PORT, () => {
  console.log(`API слушает http://localhost:${PORT}`)
})
