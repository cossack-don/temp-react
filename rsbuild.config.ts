import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginTypedCSSModules } from '@rsbuild/plugin-typed-css-modules'

/**
 * Базовый конфиг: обычная разработка и сборка standalone-приложения.
 *   npm run dev / build / preview
 *
 * Конфиг микрофронтенда (rsbuild.mf.config.ts) наследует этот файл,
 * поэтому правки здесь автоматически попадают и туда.
 */
export default defineConfig({
  // pluginTypedCSSModules кладёт рядом с каждым *.module.css файл
  // *.module.css.d.ts с реальными именами классов — отсюда автодополнение
  // и ошибка компиляции на опечатку в styles.someClass
  plugins: [pluginReact(), pluginTypedCSSModules()],

  source: {
    entry: {
      index: './src/app.tsx',
    },
    define: {
      // подставляется на этапе сборки, видно в UI и в консоли
      'import.meta.env.PUBLIC_APP_MODE': JSON.stringify('standalone'),
    },
  },

  html: {
    title: 'temp-react',
  },

  output: {
    cssModules: {
      // модулем считается только *.module.css, остальной CSS глобальный
      auto: true,

      // .field-label в CSS → styles.fieldLabel в TS.
      // camelCase, а не camelCaseOnly: исходное имя тоже остаётся,
      // поэтому styles['field-label'] продолжит работать
      exportLocalsConvention: 'camelCase',

      // в dev в devtools видно, из какого файла класс;
      // в проде короткое имя плюс хеш
      localIdentName:
        process.env.NODE_ENV === 'production'
          ? '[local]-[hash:base64:6]'
          : '[path][name]__[local]-[hash:base64:6]',
    },
  },

  server: {
    port: 3000,
  },
})
