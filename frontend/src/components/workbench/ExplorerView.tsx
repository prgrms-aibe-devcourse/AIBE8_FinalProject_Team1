import { Fragment, useRef, useState, type MouseEvent } from 'react'
import { NEWS_FOLDER_NAME } from '../../news/newsFiles'
import { ContextMenu, type ContextMenuItem } from './ContextMenu'
import { FileIcon } from './FileIcon'
import { IconButton } from './IconButton'
import {
  ROOT_PATH,
  getParentPath,
  type ExplorerNode,
  type ExplorerNodeKind,
} from './useExplorerTree'
import styles from './ExplorerView.module.css'

type ExplorerViewProps = {
  activeTabId: string | undefined
  getChildren: (parentPath: string) => ExplorerNode[]
  isProtected: (path: string) => boolean
  onOpenFile: (path: string) => void
  onCreateNode: (
    parentPath: string,
    name: string,
    kind: ExplorerNodeKind,
  ) => void
  onRenameNode: (path: string, newName: string) => void
  onDeleteNode: (path: string) => void
}

// 트리 안에 이름 입력칸을 띄운 상태: 새로 만들기 또는 이름 바꾸기
type Editing =
  | { mode: 'create'; parentPath: string; kind: ExplorerNodeKind }
  | { mode: 'rename'; path: string }

type ContextMenuState = { x: number; y: number; targetPath: string | undefined }

const WORKSPACE_NAME = 'news'
const WORKSPACE_PATH_PREFIX = '~/news/'
const COLLAPSED_SECTIONS = ['Outline', 'Timeline']
const INDENT_PX = 12
const ROW_PADDING_PX = 8

// VSCode 탐색기처럼 파일·폴더를 만들고, 이름을 바꾸고, 지운다
export function ExplorerView({
  activeTabId,
  getChildren,
  isProtected,
  onOpenFile,
  onCreateNode,
  onRenameNode,
  onDeleteNode,
}: ExplorerViewProps) {
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true)
  const [openFolderPaths, setOpenFolderPaths] = useState(
    () => new Set([NEWS_FOLDER_NAME]),
  )
  const [selectedPath, setSelectedPath] = useState<string>()
  const [editing, setEditing] = useState<Editing>()
  const [contextMenu, setContextMenu] = useState<ContextMenuState>()

  const toggleFolder = (path: string) => {
    const nextPaths = new Set(openFolderPaths)
    if (nextPaths.has(path)) {
      nextPaths.delete(path)
    } else {
      nextPaths.add(path)
    }
    setOpenFolderPaths(nextPaths)
  }

  const handleClickNode = (node: ExplorerNode) => {
    setSelectedPath(node.path)
    if (node.kind === 'folder') {
      toggleFolder(node.path)
      return
    }
    onOpenFile(node.path)
  }

  // 선택한 것이 폴더면 그 안에, 파일이면 같은 폴더에, 없으면 맨 위에 만든다
  const startCreate = (
    kind: ExplorerNodeKind,
    targetPath: string | undefined,
  ) => {
    const parentPath = toCreateParentPath(targetPath)
    setIsWorkspaceOpen(true)
    if (parentPath !== ROOT_PATH) {
      setOpenFolderPaths(new Set(openFolderPaths).add(parentPath))
    }
    setEditing({ mode: 'create', parentPath, kind })
  }

  const toCreateParentPath = (targetPath: string | undefined) => {
    if (targetPath === undefined) {
      return ROOT_PATH
    }
    const isFolder = getChildren(getParentPath(targetPath)).some(
      (node) => node.path === targetPath && node.kind === 'folder',
    )
    return isFolder ? targetPath : getParentPath(targetPath)
  }

  const submitEditing = (name: string) => {
    if (editing?.mode === 'create') {
      onCreateNode(editing.parentPath, name, editing.kind)
    }
    if (editing?.mode === 'rename') {
      onRenameNode(editing.path, name)
    }
    setEditing(undefined)
  }

  const openContextMenu = (
    event: MouseEvent,
    targetPath: string | undefined,
  ) => {
    event.preventDefault()
    event.stopPropagation()
    setSelectedPath(targetPath)
    setContextMenu({ x: event.clientX, y: event.clientY, targetPath })
  }

  const toContextMenuItems = (
    targetPath: string | undefined,
  ): ContextMenuItem[] => {
    const canChange = targetPath !== undefined && !isProtected(targetPath)
    const relativePath = targetPath ?? ''

    return [
      { label: 'New File...', onSelect: () => startCreate('file', targetPath) },
      {
        label: 'New Folder...',
        onSelect: () => startCreate('folder', targetPath),
      },
      'separator',
      {
        label: 'Copy Path',
        onSelect: () =>
          navigator.clipboard.writeText(WORKSPACE_PATH_PREFIX + relativePath),
      },
      {
        label: 'Copy Relative Path',
        onSelect: () => navigator.clipboard.writeText(relativePath),
      },
      'separator',
      {
        label: 'Rename...',
        isDisabled: !canChange,
        onSelect: () =>
          targetPath && setEditing({ mode: 'rename', path: targetPath }),
      },
      {
        label: 'Delete',
        isDisabled: !canChange,
        onSelect: () => targetPath && onDeleteNode(targetPath),
      },
    ]
  }

  const renderChildren = (parentPath: string, depth: number) => (
    <>
      {editing?.mode === 'create' && editing.parentPath === parentPath && (
        <NameInput
          depth={depth}
          kind={editing.kind}
          initialName=""
          onSubmit={submitEditing}
          onCancel={() => setEditing(undefined)}
        />
      )}
      {getChildren(parentPath).map((node) => (
        <Fragment key={node.path}>
          {editing?.mode === 'rename' && editing.path === node.path ? (
            <NameInput
              depth={depth}
              kind={node.kind}
              initialName={node.name}
              onSubmit={submitEditing}
              onCancel={() => setEditing(undefined)}
            />
          ) : (
            <TreeRow
              node={node}
              depth={depth}
              isOpen={openFolderPaths.has(node.path)}
              isSelected={node.path === (selectedPath ?? activeTabId)}
              onClick={() => handleClickNode(node)}
              onContextMenu={(event) => openContextMenu(event, node.path)}
            />
          )}
          {node.kind === 'folder' &&
            openFolderPaths.has(node.path) &&
            renderChildren(node.path, depth + 1)}
        </Fragment>
      ))}
    </>
  )

  return (
    <div className={styles.explorerView}>
      <div
        className={styles.tree}
        onContextMenu={(event) => openContextMenu(event, undefined)}
      >
        <div className={styles.workspaceHeader}>
          <button
            type="button"
            className={styles.sectionHeader}
            onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
          >
            <i
              className={`codicon codicon-chevron-${isWorkspaceOpen ? 'down' : 'right'}`}
            />
            {WORKSPACE_NAME}
          </button>
          <div className={styles.headerActions}>
            <IconButton
              icon="new-file"
              label="New File..."
              onClick={() => startCreate('file', selectedPath)}
            />
            <IconButton
              icon="new-folder"
              label="New Folder..."
              onClick={() => startCreate('folder', selectedPath)}
            />
            <IconButton icon="refresh" label="Refresh Explorer" />
            <IconButton
              icon="collapse-all"
              label="Collapse Folders in Explorer"
              onClick={() => setOpenFolderPaths(new Set())}
            />
          </div>
        </div>

        {isWorkspaceOpen && renderChildren(ROOT_PATH, 0)}
      </div>

      {COLLAPSED_SECTIONS.map((section) => (
        <button key={section} type="button" className={styles.sectionHeader}>
          <i className="codicon codicon-chevron-right" />
          {section}
        </button>
      ))}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={toContextMenuItems(contextMenu.targetPath)}
          onClose={() => setContextMenu(undefined)}
        />
      )}
    </div>
  )
}

type TreeRowProps = {
  node: ExplorerNode
  depth: number
  isOpen: boolean
  isSelected: boolean
  onClick: () => void
  onContextMenu: (event: MouseEvent) => void
}

function TreeRow({
  node,
  depth,
  isOpen,
  isSelected,
  onClick,
  onContextMenu,
}: TreeRowProps) {
  return (
    <button
      type="button"
      className={isSelected ? styles.selectedRow : styles.row}
      style={{ paddingLeft: ROW_PADDING_PX + depth * INDENT_PX }}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <NodeIcon kind={node.kind} name={node.name} isOpen={isOpen} />
      {node.name}
    </button>
  )
}

type NameInputProps = {
  depth: number
  kind: ExplorerNodeKind
  initialName: string
  onSubmit: (name: string) => void
  onCancel: () => void
}

// Enter·포커스 이동은 확정, Esc는 취소. 확정 뒤 입력칸이 사라질 때 blur가 한 번 더 오는 것을 막는다
function NameInput({
  depth,
  kind,
  initialName,
  onSubmit,
  onCancel,
}: NameInputProps) {
  const isFinishedRef = useRef(false)

  const finish = (action: () => void) => {
    if (isFinishedRef.current) {
      return
    }
    isFinishedRef.current = true
    action()
  }

  return (
    <div
      className={styles.inputRow}
      style={{ paddingLeft: ROW_PADDING_PX + depth * INDENT_PX }}
    >
      <NodeIcon kind={kind} name={initialName} isOpen={false} />
      <input
        className={styles.nameInput}
        defaultValue={initialName}
        autoFocus
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            finish(() => onSubmit(event.currentTarget.value))
          }
          if (event.key === 'Escape') {
            finish(onCancel)
          }
        }}
        onBlur={(event) => {
          const name = event.currentTarget.value
          finish(() => onSubmit(name))
        }}
      />
    </div>
  )
}

function NodeIcon({
  kind,
  name,
  isOpen,
}: {
  kind: ExplorerNodeKind
  name: string
  isOpen: boolean
}) {
  if (kind === 'folder') {
    return (
      <i className={`codicon codicon-chevron-${isOpen ? 'down' : 'right'}`} />
    )
  }
  return (
    <>
      <span className={styles.chevronSpace} />
      <FileIcon fileName={name} />
    </>
  )
}
