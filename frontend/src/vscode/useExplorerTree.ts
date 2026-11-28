import { useState } from 'react'
import type { NewsCategory } from '../api/news'
import { NEWS_FOLDER_NAME, toNewsFilePath } from '../domains/news/newsFiles'

export type ExplorerNodeKind = 'file' | 'folder'

export type ExplorerNode = {
  path: string
  name: string
  kind: ExplorerNodeKind
}

// 워크스페이스 맨 위의 경로. 'src/사회.mjs'의 부모는 'src', 'src'의 부모는 ''
export const ROOT_PATH = ''

const NEWS_FOLDER_NODE: ExplorerNode = {
  path: NEWS_FOLDER_NAME,
  name: NEWS_FOLDER_NAME,
  kind: 'folder',
}

// 탐색기의 파일·폴더 목록. 뉴스 파일은 받아온 뉴스로 만들고(뉴스가 늦게 와도 화면에서 만든 파일은 남는다),
// 화면에서 만든 파일은 서버에 저장하지 않는다
export function useExplorerTree(categories: NewsCategory[]) {
  const [createdNodes, setCreatedNodes] = useState<ExplorerNode[]>([])
  const newsNodes = [NEWS_FOLDER_NODE, ...categories.map(toNewsNode)]
  const nodes = [...newsNodes, ...createdNodes]

  const getChildren = (parentPath: string) =>
    nodes
      .filter((node) => getParentPath(node.path) === parentPath)
      .sort(compareFoldersFirst)

  // 이름이 비었거나, '/'가 들어갔거나, 같은 폴더에 같은 이름이 있으면 만들지 않는다
  const createNode = (
    parentPath: string,
    name: string,
    kind: ExplorerNodeKind,
  ): string | undefined => {
    const trimmedName = name.trim()
    const path = joinPath(parentPath, trimmedName)
    if (!isValidName(trimmedName) || hasNode(path)) {
      return undefined
    }
    setCreatedNodes([...createdNodes, { path, name: trimmedName, kind }])
    return path
  }

  // 폴더 이름을 바꾸면 안에 있는 파일 경로도 같이 바뀐다
  const renameNode = (path: string, newName: string): string | undefined => {
    const trimmedName = newName.trim()
    const newPath = joinPath(getParentPath(path), trimmedName)
    if (isProtected(path) || !isValidName(trimmedName) || hasNode(newPath)) {
      return undefined
    }
    setCreatedNodes(
      createdNodes.map((node) => {
        if (node.path === path) {
          return { ...node, path: newPath, name: trimmedName }
        }
        if (isInside(node.path, path)) {
          return { ...node, path: newPath + node.path.slice(path.length) }
        }
        return node
      }),
    )
    return newPath
  }

  const deleteNode = (path: string): boolean => {
    if (isProtected(path)) {
      return false
    }
    setCreatedNodes(
      createdNodes.filter(
        (node) => node.path !== path && !isInside(node.path, path),
      ),
    )
    return true
  }

  const hasNode = (path: string) => nodes.some((node) => node.path === path)

  // 뉴스 폴더와 뉴스 파일은 이름 바꾸기·삭제를 막는다
  const isProtected = (path: string) =>
    newsNodes.some((node) => node.path === path)

  return { getChildren, createNode, renameNode, deleteNode, isProtected }
}

function toNewsNode(category: NewsCategory): ExplorerNode {
  return {
    path: toNewsFilePath(category),
    name: category.fileName,
    kind: 'file',
  }
}

export function getParentPath(path: string): string {
  const lastSlashIndex = path.lastIndexOf('/')
  return lastSlashIndex === -1 ? ROOT_PATH : path.slice(0, lastSlashIndex)
}

export function getNodeName(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1)
}

export function isInside(path: string, folderPath: string): boolean {
  return path.startsWith(`${folderPath}/`)
}

function joinPath(parentPath: string, name: string): string {
  return parentPath === ROOT_PATH ? name : `${parentPath}/${name}`
}

function isValidName(name: string): boolean {
  return name !== '' && !name.includes('/')
}

function compareFoldersFirst(left: ExplorerNode, right: ExplorerNode): number {
  if (left.kind !== right.kind) {
    return left.kind === 'folder' ? -1 : 1
  }
  return left.name.localeCompare(right.name)
}
