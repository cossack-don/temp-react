import { useState } from 'react'

import type { TreeNode } from '../static'
import styles from '../Page.module.css'

interface TreeBranchProps {
  node: TreeNode
  /** Раскрыта ли ветка при первом рендере. */
  defaultOpen: boolean
}

/** Одна ветка дерева. Рекурсивно рисует своих детей. */
export const TreeBranch = ({ node, defaultOpen }: TreeBranchProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const hasChildren = Boolean(node.children?.length)

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
          <span
            className={[
              styles.caret,
              hasChildren ? '' : styles.caretHidden,
              isOpen ? '' : styles.caretClosed,
            ]
              .filter(Boolean)
              .join(' ')}
            aria-hidden="true"
          >
            ▾
          </span>
          {node.name}
        </button>

        {node.note ? <span className={styles.note}>{node.note}</span> : null}
      </div>

      {hasChildren && isOpen ? (
        <ul className={styles.nested}>
          {node.children?.map((child) => (
            <TreeBranch key={child.name} node={child} defaultOpen={defaultOpen} />
          ))}
        </ul>
      ) : null}
    </li>
  )
}
