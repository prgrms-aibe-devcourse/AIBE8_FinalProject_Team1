import * as monaco from 'monaco-editor'

// @monaco-editor/react는 path 하나에 Monaco 모델(파일 내용) 하나를 만든다
function findFileModel(path: string) {
  return monaco.editor.getModel(monaco.Uri.parse(path))
}

// 저장하지 않고 탭을 닫으면 에디터 내용을 마지막 저장본으로 되돌린다
export function restoreFileContent(path: string, savedContent: string) {
  findFileModel(path)?.setValue(savedContent)
}

// 탐색기에서 이름을 바꾸면 내용을 새 경로의 모델로 옮긴다 (폴더라면 안의 파일까지)
export function moveFileContents(path: string, newPath: string) {
  // 한글 경로가 %EC... 로 바뀌지 않도록 인코딩하지 않은 문자열로 비교한다
  const oldPrefix = monaco.Uri.parse(path).toString(true)
  monaco.editor.getModels().forEach((model) => {
    const uri = model.uri.toString(true)
    if (uri !== oldPrefix && !uri.startsWith(`${oldPrefix}/`)) {
      return
    }
    const movedPath = newPath + uri.slice(oldPrefix.length)
    monaco.editor.createModel(
      model.getValue(),
      model.getLanguageId(),
      monaco.Uri.parse(movedPath),
    )
    model.dispose()
  })
}
