import { useState } from 'react'
import type { CSSProperties } from 'react'

import { LAYERS, PROJECT_TREE } from './project-tree.data'
import type { TreeNode } from './project-tree.data'
import styles from './ProjectTree.module.css'

/**
 * Дерево структуры проекта для документации.
 *
 * Дерево описано моком в ./project-tree.data.ts — файловая система не читается.
 * Раньше эти данные жили в модуле architecture приложения; модуль удалён,
 * данные переехали сюда, и теперь документация — их единственный владелец.
 * Переехала папка в проекте — правим этот файл.
 */

interface BranchProps {
  node: TreeNode
  defaultOpen: boolean
}

function Branch({ node, defaultOpen }: BranchProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const hasChildren = Boolean(node.children?.length)

  const caret = [
    styles.caret,
    hasChildren ? '' : styles.caretHidden,
    isOpen ? '' : styles.caretClosed,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <li>
      <div className={styles.row}>
        <button
          type="button"
          className={hasChildren ? styles.node : `${styles.node} ${styles.leaf}`}
          onClick={hasChildren ? () => setIsOpen((value) => !value) : undefined}
          aria-expanded={hasChildren ? isOpen : undefined}
          disabled={!hasChildren}
        >
          <span className={caret} aria-hidden="true">
            ▾
          </span>
          {node.name}
        </button>

        {node.note ? <span className={styles.note}>{node.note}</span> : null}
      </div>

      {hasChildren && isOpen ? (
        <ul className={styles.nested}>
          {node.children?.map((child) => (
            <Branch key={child.name} node={child} defaultOpen={defaultOpen} />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

export function ProjectTree() {
  // смена ключа перемонтирует дерево и сбрасывает состояние всех веток
  const [treeKey, setTreeKey] = useState(0)
  const [openAll, setOpenAll] = useState(false)

  const reset = (open: boolean) => {
    setOpenAll(open)
    setTreeKey((value) => value + 1)
  }

  return (
    <div className={styles.root}>
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
                <div className={styles.groupName}>{group.name}</div>
                {layer ? (
                  <span className={styles.layerTag}>
                    <span className={styles.dot} style={{ background: layer.color }} />
                    {layer.label}
                  </span>
                ) : null}
              </div>

              {group.note ? <p className={styles.groupNote}>{group.note}</p> : null}

              <ul className={styles.tree} key={treeKey}>
                {group.children?.map((child) => (
                  <Branch key={child.name} node={child} defaultOpen={openAll} />
                ))}
              </ul>

              {group.footer ? <p className={styles.groupFooter}>{group.footer}</p> : null}
            </section>
          )
        })}
      </div>
    </div>
  )
}
