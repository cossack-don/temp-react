/**
 * Асинхронная граница для Module Federation.
 *
 * Точка входа не должна тянуть shared-зависимости (react, react-dom) синхронно:
 * на момент её выполнения share scope ещё не инициализирован, и remote падает
 * с RUNTIME-006 «Invalid loadShareSync function call».
 *
 * Динамический import откладывает код приложения на отдельный чанк — к моменту
 * его загрузки shared уже готов. На обычную сборку это влияет только одним
 * дополнительным чанком.
 */
void import('./app/bootstrap')
