import { useState } from 'react'
import type { CSSProperties } from 'react'

import { TreeBranch } from './components'
import { LAYERS, PROJECT_TREE } from './static'
import styles from './Page.module.css'

/**
 * Страница /architecture. Дерево описано моком в static/tree.ts:
 * файловая система не читается, запросов на бэкенд нет.
 */
export const ArchitecturePage = () => {
  // ключ перемонтирует дерево, сбрасывая состояние всех веток
  const [treeKey, setTreeKey] = useState(0)
  const [openAll, setOpenAll] = useState(false)

  const reset = (open: boolean) => {
    setOpenAll(open)
    setTreeKey((value) => value + 1)
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Архитектура папок</h1>
      <p className={styles.intro}>
        Шесть слоёв: оболочка приложения, экраны, работа с бэкендом, общий код, локальный
        сервер и сборка. Кликните по папке, чтобы развернуть её.
      </p>

      <div className={styles.legend}>
        {Object.entries(LAYERS).map(([key, layer]) => (
          <span key={key} className={styles.legendItem}>
            <span className={styles.dot} style={{ background: layer.color }} />
            {layer.label}
          </span>
        ))}
      </div>

      <div className={styles.controls}>
        <button type="button" className={styles.button} onClick={() => reset(true)}>
          Развернуть всё
        </button>
        <button type="button" className={styles.button} onClick={() => reset(false)}>
          Свернуть всё
        </button>
      </div>

      <div className={styles.groups}>
        {PROJECT_TREE.map((group) => {
          const layer = group.layer ? LAYERS[group.layer] : undefined

          return (
            <section
              key={group.name}
              className={styles.group}
              style={layer ? ({ '--tone': layer.color } as CSSProperties) : undefined}
            >
              <div className={styles.groupHead}>
                <h2 className={styles.groupName}>{group.name}</h2>
                {layer ? <span className={styles.layerTag}>{layer.label}</span> : null}
              </div>

              {group.note ? <p className={styles.groupNote}>{group.note}</p> : null}

              <ul className={styles.tree} key={treeKey}>
                {group.children?.map((child) => (
                  <TreeBranch key={child.name} node={child} defaultOpen={openAll} />
                ))}
              </ul>

              {group.footer ? <p className={styles.footer}>{group.footer}</p> : null}
            </section>
          )
        })}
      </div>
    </div>
  )
}
