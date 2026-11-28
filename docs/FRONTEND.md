# 프론트엔드 구조 (`frontend/`)

VSCode처럼 **보이기만** 하는 뉴스 화면이다. 화면 틀(`vscode/`)은 팀장이 만들어 두었고,
각 도메인 담당자는 자기 기능을 `domains/<도메인>/`과 `api/<도메인>.ts`에 만든다.

## 실행

```bash
cd frontend
cp .env.example .env   # 처음 한 번
npm install
npm run dev            # http://localhost:5173
```

## 검사 (CI)

dev에 PR을 올리면 GitHub Actions(`.github/workflows/frontend-ci.yml`)가 아래 4가지를 자동으로 실행한다.
PR 아래에 ✅가 떠야 병합한다. ❌면 Details에서 실패한 단계를 보고 고친다.

| 명령어 | 도구 | 무엇을 검사하나 |
| --- | --- | --- |
| `npm run lint` | oxlint | 실수하기 쉬운 코드 습관 (안 쓰는 변수, 항상 참인 조건문) |
| `npm run typecheck` | TypeScript | 타입이 맞는지 (잘못된 props, 틀린 import 경로) |
| `npm run build` | Vite | 배포할 파일이 실제로 만들어지는지 |
| `npm run format:check` | Prettier | 코드 모양이 팀 규칙과 같은지 (`npm run format`으로 자동 정리) |

CI 결과를 기다리지 않고 미리 확인하고 싶으면 `frontend/`에서 직접 실행해도 된다.

## 폴더 한눈에 보기

```txt
frontend/src/
  api/          서버와 이야기하는 곳 (우편실)
  vscode/       VSCode 모양 화면 틀 (건물 뼈대·복도) ← 팀장
  domains/      기능별 코드 (팀별 사무실) ← 각 담당자
  styles/       VSCode 색 변수 (theme.css)
```

| 폴더 | 무엇을 두나 | 누가 고치나 |
| --- | --- | --- |
| `api/client.ts` | axios 인스턴스. 서버 주소(`VITE_API_BASE_URL`), 나중에 로그인 토큰·401 처리 | 팀장 |
| `api/<도메인>.ts` | 그 도메인의 서버 요청 함수 (`getNewsCategories()` 같은) | 도메인 담당자 |
| `vscode/` | 탐색기, 탭, 에디터, 터미널, 패널, 상태바, Command Palette, 아이콘 | 팀장 (고칠 때는 PR에 이유 + 팀장 리뷰) |
| `domains/<도메인>/` | 그 도메인의 화면 코드, 훅, 데이터 변환 함수 | 도메인 담당자 |

## 도메인 폴더

폴더마다 `README.md`에 맡는 기능과 화면 위치가 적혀 있다. 담당은 4차 회의에서 정한다.

| 폴더 | 도메인 | VSCode 화면에서 보이는 곳 |
| --- | --- | --- |
| `domains/member/` | 회원 (가입, 로그인, 개인 설정) | 왼쪽 아래 Accounts |
| `domains/news/` | 뉴스 (목록, 기사 → 코드, 검색, 터미널 명령, 북마크·구독) | 탐색기, 에디터, 터미널, Command Palette |
| `domains/chat/` | 채팅·친구 | 오른쪽 AI agent 창 (Codex = 전체 채팅, Claude Code = 1:1) |
| `domains/community/` | 커뮤니티 | 미정 |
| `domains/salary/` | 월급 현황 | 상태바, Extensions 패널 |
| `domains/admin/` | 관리자 | 미정 |

뉴스 수집(네이버 API, 스케줄러, 중복 기사 묶기)은 백엔드에만 있는 도메인이라 프론트 폴더가 없다.

## 규칙 3가지

1. **서버 요청은 `api/`에서만.** 컴포넌트에서 `fetch`나 `axios`를 직접 쓰지 않고, `api/client.ts`의 `apiClient`를 쓴다.
2. **도메인끼리는 서로 import하지 않는다.** 채팅 코드가 뉴스 코드를 가져다 쓰면, 뉴스를 고쳤을 때 채팅이 깨진다. 다른 도메인 데이터가 필요하면 `api/`로 받는다.
3. **`vscode/`는 도메인 코드를 화면에 놓기만 한다.** 도메인 화면을 붙일 자리가 필요하면 팀장에게 말하거나, PR에 이유를 적는다.

## 데이터가 화면까지 오는 길 (뉴스 예시)

```txt
api/client.ts            axios 인스턴스
  ↓
api/news.ts              getNewsCategories()  ← 지금은 샘플을 돌려준다. 백엔드가 생기면 이 함수 안만 바꾼다
  ↓
domains/news/useNewsCategories.ts   화면이 열릴 때 한 번 받아 온다 (실패하면 상태바에 "Failed to load news")
  ↓
vscode/Workbench.tsx     받은 뉴스를 탐색기·에디터·시작 화면·Command Palette·터미널에 나눠 준다
```

새 도메인도 같은 순서로 만든다: `api/<도메인>.ts`에 요청 함수 → `domains/<도메인>/`에 훅·화면 → 화면 틀에 붙이기.

## `vscode/` 파일 안내

| 파일 | 화면 |
| --- | --- |
| `Workbench.tsx` | 전체 배치. 각 영역의 열림 상태와 열린 탭을 관리 |
| `TitleBar.tsx` | 맨 위 줄. 가운데 검색창(누르면 Command Palette), 오른쪽 레이아웃 버튼 |
| `ActivityBar.tsx` | 맨 왼쪽 아이콘 줄 |
| `SideBar.tsx`, `ExplorerView.tsx` | 왼쪽 사이드바, 탐색기 (파일·폴더 만들기, 우클릭 메뉴) |
| `EditorArea.tsx`, `EditorTabs.tsx`, `NewsEditor.tsx` | 가운데 에디터, 탭, Monaco 에디터 |
| `WelcomePage.tsx` | 처음 열리는 Welcome 탭 |
| `Panel.tsx`, `NewsTerminal.tsx` | 아래 패널, xterm.js 터미널 (글자 입력, ↑↓ 이전 명령, 결과 표시) |
| `terminalCommand.ts` | 터미널 명령어 하나의 모양(`TerminalCommand`)과 결과 함수 `success`·`failure` |
| `terminalCommandRegistry.ts` | 등록된 명령어 목록, 입력을 알맞은 명령으로 보내는 실행기, `help`·`clear` |
| `SecondarySideBar.tsx` | 오른쪽 AI agent 창 (채팅 자리) |
| `CommandPalette.tsx` | ⌘P 검색창 (cmdk) |
| `StatusBar.tsx` | 맨 아래 상태바 |
| `PlaceholderView.tsx` | 아직 기능이 없는 사이드바 화면의 VSCode 모양 |
| `use*.ts` | 레이아웃 열고 닫기, 탭, 탐색기 트리, 저장 안 한 파일 상태 |

외부 UI 라이브러리는 감싸는 파일 하나에서만 쓴다: Monaco는 `NewsEditor.tsx`, xterm.js는 `NewsTerminal.tsx`, cmdk는 `CommandPalette.tsx`.

## 지금 동작하는 것

- VSCode 모양 화면: 사이드바·패널·AI agent 창 열고 닫기, VSCode 단축키
- 탐색기: 카테고리 파일(`사회.mjs`, `IT.mjs` …) 열기, 파일·폴더 만들기·이름 바꾸기·삭제 (뉴스 파일은 막힘)
- 에디터: 기사를 코드 모양으로 읽기 전용 표시, VSCode와 같은 색, 직접 만든 파일에 입력·⌘S
- 터미널: `news ls`, `news cat <번호>`, `news grep <키워드>`, `help`, `clear`
- Command Palette: 키워드 검색 → 파일 열고 그 줄로 이동·강조

## 모양만 있고 동작하지 않는 것

필요한 도메인 담당자가 기능을 붙인다.

| 화면 | 붙일 도메인 (예상) |
| --- | --- |
| AI agent 창 채팅 (지금은 화면에만 쌓임) | chat |
| 터미널 `news bookmark` (지금은 "로그인한 뒤 쓸 수 있습니다") | news + member |
| Accounts, Manage(톱니바퀴) 아이콘 | member |
| 사이드바 Search, Extensions | news(검색), salary(기능 켜고 끄기) |
| 사이드바 Source Control, Run and Debug, Containers | 모양만 유지 |
| Welcome의 New File / Open / Clone, 패널의 Problems·Output 등 | 모양만 유지 |

## 터미널 명령어 추가하는 법

터미널 엔진(`vscode/`)은 고치지 않고, 자기 도메인 폴더에 명령을 만들어 등록 목록에 한 줄만 추가한다.
견본은 `domains/news/newsCommands.ts`의 `newsCommand`다.

```ts
// domains/salary/salaryCommands.ts (예시)
import { failure, success, type TerminalCommand } from '../../vscode/terminalCommand'

export const salaryCommand: TerminalCommand = {
  name: 'salary',                          // 'salary today'의 첫 단어
  usage: ['salary today         오늘 찬 월급'], // help에 자동으로 나온다
  run: async ([subcommand = '']) => {      // 'salary today' → ['today']
    if (subcommand !== 'today') {
      return failure('usage: salary today')
    }
    const salary = await getTodaySalary()  // api/salary.ts
    return success([`오늘 찬 월급: ${salary.amount}원`])
  },
}
```

```ts
// vscode/terminalCommandRegistry.ts
const TERMINAL_COMMANDS: TerminalCommand[] = [newsCommand, salaryCommand] // 한 줄 추가
```

- 결과는 `success(줄 목록)` 또는 `failure(메시지)`로 돌려준다. 실패면 프롬프트 앞에 빨간 ⊗가 붙는다.
- 서버 요청이 실패해서 에러가 나도 터미널은 멈추지 않고 "명령을 실행하지 못했습니다"를 보여준다.
- 명령에 뉴스 말고 다른 값(예: 로그인 정보)이 필요하면 `CommandContext`에 추가해 달라고 팀장에게 말한다.
- 도메인은 다른 도메인을 import하지 않지만, 명령어 모양(`vscode/terminalCommand.ts`)은 가져다 쓴다.
