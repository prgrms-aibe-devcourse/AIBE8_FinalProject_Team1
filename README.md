# README

> 회사에서는 코드를 보는 척, 사실은 오늘의 뉴스를 읽는다.

**README**는 VSCode처럼 보이는 개발자용 뉴스 웹 서비스입니다.
화면은 VSCode와 똑같이 생겼지만, 탐색기의 파일은 뉴스 카테고리이고 에디터에 열리는 코드는 기사입니다.
옆에서 보면 코드를 읽고 있는 것처럼 보입니다.

## 컨셉

| VSCode에서 보이는 것 | 실제로는 |
| --- | --- |
| 탐색기의 파일 목록 | 카테고리별로 뉴스를 담은 파일 (사회, IT, 정치, 경제, 문화) |
| 에디터에 열린 코드 | 기사 제목과 요약 |
| Command Palette | 기사 키워드 검색 |
| 터미널 | 명령어로 뉴스 검색·조회 |

실제 VSCode 기능(파일 저장, Git, 익스텐션 설치 등)은 동작하지 않습니다. **동작하는 것처럼 보이기만** 합니다.

## MVP 기능

| 기능 | 대상 |
| --- | --- |
| VSCode 모양 화면 (액티비티 바, 탐색기, 에디터 탭, 상태바) | 전체 |
| 뉴스 목록 (주요 뉴스 10개 + 최신순 약 300개, 무한 스크롤) | 전체 |
| 기사 상세 (에디터에서 코드 형식으로 열림) | 전체 |
| 키워드 검색 (Command Palette, 터미널) | 전체 |
| 테마 (프로젝트 구조 테마, 색상 테마) | 전체 |
| 북마크 (`BOOKMARKS` 폴더에 모임) | 로그인 |

### 테마

테마는 두 종류로 나눕니다.

| 테마 | 바뀌는 것 | 예 |
| --- | --- | --- |
| 프로젝트 구조 테마 | 탐색기의 폴더·파일 이름과 확장자, 기사가 열리는 코드 형식 | React, TypeScript, Next.js, HTML·CSS·JavaScript |
| 색상 테마 | 화면 색상과 코드 하이라이팅 | Dark+, Light+, Monokai |

예를 들어 Next.js 테마를 고르면 탐색기가 `app/`, `components/`, `page.tsx`처럼 보이고, 기사도 그 파일 형식에 맞는 코드처럼 열립니다.

### 키워드 검색

**Command Palette**

1. 키워드를 입력한다.
2. 키워드가 들어간 기사가 있는 파일이 열린다.
3. 키워드가 있는 줄로 이동하고 줄 전체를 강조한다.
4. 다음 버튼을 누르면 다음 일치 줄로 이동한다. (Cmd + F처럼)

**터미널**

| 명령어 | 동작 |
| --- | --- |
| `news ls <카테고리>` | 기사 목록 출력 |
| `news cat <번호>` | 기사 출력 |
| `news grep <키워드>` | 키워드 검색 |
| `news bookmark <번호>` | 북마크 |

## 추가 기능 (MVP 이후)

- 키워드 구독 (`MY KEYWORDS/<키워드>` 폴더, 새 기사 수 배지)
- 채팅 (AI agent 창에서 익명 전체 채팅, 친구와 1:1 채팅)
- 월급 현황 (오늘 월급이 얼마나 찼는지)
- 커뮤니티
- 에디터 테마 (IntelliJ, Cursor처럼 보이는 화면)
- 미니게임 (익스텐션 창)

## 저장소 구조

```
├ frontend/   웹 화면 (VSCode 모양 + 뉴스)
├ desktop/    Electron 앱 (frontend를 주소창 없는 창에 띄움)
├ backend/    API 서버 (뉴스 수집, 뉴스·회원 API)
└ docs/       개발 규칙
```

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| 에디터 | Monaco Editor |
| 터미널 | xterm.js |
| Command Palette | cmdk |
| 아이콘 | Codicons |
| Desktop | Electron |
| Backend | Java 25, Spring Boot 4.1 |
| 뉴스 데이터 | 네이버 검색 API (뉴스) |
| DB, 캐시, 배포 | 미정 |

## 개발 규칙

- 코드 작성 원칙: [docs/CLEAN_CODE.md](docs/CLEAN_CODE.md)
- Git·코드 컨벤션: [docs/CONVENTION.md](docs/CONVENTION.md)
- AI 작업 원칙: [CLAUDE.md](CLAUDE.md)
