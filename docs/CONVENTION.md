# Git·코드 컨벤션

> 목적: **누가 짜도 같은 모양** → 다른 사람 코드를 읽는 시간이 줄어든다.
> 코드 작성 원칙은 [CLEAN_CODE.md](CLEAN_CODE.md), AI 작업 원칙은 [CLAUDE.md](../CLAUDE.md)를 따른다.

# Part 1. Git

## ⌨️ 자주 쓰는 명령어

### 하루 작업 순서

```bash
# 1. 최신 dev 받기
git switch dev
git pull --ff-only origin dev

# 2. 이슈 번호로 기능 브랜치 만들기
git switch -c feat/12-member-signup

# 3. 관련된 변경만 스테이징 → 커밋
git status
git add <관련 파일>
git commit -m "feat: 회원가입 API 구현"

# 4. 원격에 올리기 → GitHub에서 dev 대상으로 PR
git push -u origin feat/12-member-signup
```

### 상황별 명령어

| 상황 | 명령어 |
| --- | --- |
| 지금 상태 확인 | `git status`, `git diff` |
| 스테이징 취소 | `git restore --staged <파일>` |
| 커밋 안 한 수정 버리기 | `git restore <파일>` |
| 방금 커밋 메시지 수정 (**push 전만**) | `git commit --amend -m "메시지"` |
| 기록 보기 | `git log --oneline --graph --all` |
| 브랜치 만들고 이동 | `git switch -c <이름>` |
| 브랜치 삭제 | `git branch -d <이름>` |
| 하던 작업 잠깐 치워두기 | `git stash push -m "메모"` → `git stash pop` |
| 공유된 커밋 취소 | `git revert <id>` (기록 유지) |
| 실수로 날린 커밋 찾기 | `git reflog` |
| 최신 dev 받기 | `git pull --ff-only origin dev` |
| 처음 올리기 / 이후 올리기 | `git push -u origin <브랜치>` / `git push` |

> `--ff-only`: 로컬 dev에 실수로 커밋이 생겼으면 합치지 않고 멈춰서 알려준다 → 로컬 dev를 항상 원격과 같게 유지

---

## 🌿 브랜치 전략

| 브랜치 | 역할 |
| --- | --- |
| `main` | **배포용.** 배포 전에 확인한 변경만 반영 |
| `dev` | **기능을 합치는 곳.** 저장소 기본 브랜치 |
| 기능 브랜치 | dev에서 만들고, 끝나면 dev로 PR |

**브랜치 이름**: `<type>/<이슈번호>-<기능명>`

```
feat/12-member-signup
fix/15-login-error
refactor/20-order-service
```

**저장소 설정**
- [ ] main·dev 삭제 방지, 직접 push 금지 (Branch protection)
- [ ] 병합된 기능 브랜치 자동 삭제
- [ ] 기본 브랜치를 dev로 변경

---

## 🏷 type (브랜치·커밋·이슈 라벨 공통)

| type | 용도 |
| --- | --- |
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `refactor` | 동작은 그대로, 구조 개선 |
| `docs` | 문서 |
| `test` | 테스트 추가·수정 |
| `chore` | 설정·빌드·의존성 |

> 브랜치·커밋·라벨을 **같은 6개 단어**로 맞춘다.

---

## 💬 커밋 메시지

형식: `<type>: 변경 내용` (한국어, type은 소문자)

```
feat: Swagger JWT 인증 설정 추가

Swagger에서 Access 토큰을 입력해 API를 호출할 수 있도록
Bearer 인증 방식을 설정했다.
```

- **목적이 다른 변경은 커밋을 나눈다** (기능 추가 + 버그 수정 섞지 않기)
- 설명이 필요하면 한 줄 띄우고 본문에 **이유와 영향**

---

## 📝 이슈

- 제목: `<type>: 할 일`
- 라벨: type과 동일
- 본문: 기능 설명 + **완료 조건** (어디까지 하면 끝인지)

```markdown
## 기능 설명
- 이메일·비밀번호·닉네임으로 회원가입한다.

## 완료 조건
- [ ] 정상 가입 요청을 처리한다.
- [ ] 중복 이메일·닉네임 요청을 거절한다.
- [ ] 잘못된 입력값에 검증 오류를 응답한다.
```

- GitHub Projects 보드: 할 일 → 진행 중 → 완료 (자동화 설정)
- 이슈 1개 = 브랜치 1개 = PR 1개

---

## 🔍 PR

**템플릿** (`.github/pull_request_template.md`)

```markdown
## 변경 내용
- 수정·추가한 동작

## 확인 결과
- 실제로 실행한 빌드·테스트·API 요청 결과 ("될 것이다" ❌ "해봤다" ✅)

## 팀 공유 사항 (선택)
- 새 설정값, 공통 코드 변경 등 다른 사람이 알아야 할 것

Closes #이슈번호
```

**병합 규칙**

| 경우 | 병합 |
| --- | --- |
| 자기 도메인만 바꾼 PR | 작성자가 직접 병합 |
| 다른 사람 도메인 코드를 고친 PR | 해당 담당자 리뷰 후 병합 |
| 공통 코드·다른 도메인이 쓰는 API를 바꾼 PR | 영향받는 담당자 리뷰 후 병합 |

- 병합 방식: **Squash and merge** (PR 하나 = dev 커밋 하나)
- `Closes #번호` → 병합 시 이슈 자동 종료 (기본 브랜치가 dev여야 동작)
- 충돌은 PR 올린 사람이 해결하되, **같이 고친 팀원과 확인하며** 해결

---

# Part 2. 코드 컨벤션

> 아래는 "모양" 규칙이다. 이름·메서드 설계·주석 같은 **코드 작성 원칙은 [CLEAN_CODE.md](CLEAN_CODE.md)**를 따른다.

## 이름

| 대상 | 규칙 | 예 |
| --- | --- | --- |
| 클래스·인터페이스 | PascalCase | `MemberService` |
| 변수·메서드 | lowerCamelCase | `findByEmail` |
| 상수 | UPPER_SNAKE_CASE | `MAX_FILE_COUNT` |
| 패키지 | 소문자 | `member` |
| 엔티티 | `Entity` 접미사 붙이지 않음 | `Member` (O) `MemberEntity` (X) |
| 의존성 주입 필드 | 클래스명을 lowerCamelCase로 | `memberService` (O) `service`, `ms` (X) |
| 요청 / 응답 DTO | `~Request` / `~Response` | `SignupRequest`, `MemberResponse` |
| 매퍼 메서드 | 반환 대상 기준 | `toEntity`, `toResponse`, `toAdminResponse` |
| ErrorCode 상수 | `_EXCEPTION`으로 끝냄 | `MEMBER_NOT_FOUND_EXCEPTION` |

- 같은 개념에는 같은 이름, 임의로 축약하지 않는다.

## 패키지 구조

- **엔티티 하나당 패키지 하나**
- Controller, Service, Repository, Mapper, 엔티티, enum은 같은 패키지 / DTO만 `dto` 하위 패키지

```
domain/
└ member/
   ├ Member.java
   ├ MemberRole.java
   ├ MemberController.java
   ├ MemberService.java
   ├ MemberRepository.java
   ├ MemberMapper.java
   └ dto/
      ├ SignupRequest.java
      └ MemberResponse.java
global/   ← 공통 (예외, 보안, 설정)
```

## Backend 규칙

| 항목 | 규칙 |
| --- | --- |
| 의존성 주입 | `private final` + 생성자 주입. 보통 `@RequiredArgsConstructor`, 설정값이 필요하면 생성자 직접 작성 |
| 요청 DTO | 일반 클래스, 입력값 검증(`@Valid`)은 요청 DTO에 |
| 응답 DTO | `record`. **엔티티를 응답으로 직접 반환하지 않는다** |
| enum 저장 | `@Enumerated(EnumType.STRING)` |
| 생성 시각 | `createdAt`은 `@Column(nullable = false, updatable = false)` + `@PrePersist` |
| 예외 | `BusinessException` + `ErrorCode`. 기존 코드를 먼저 찾아 재사용, 새 코드는 자기 도메인 구역에 추가 |
| 공통 예외 처리 | `GlobalExceptionHandler`는 **팀장만 수정** (필요하면 PR에 이유) |
| 다른 도메인 조회 | 그 도메인 **Service가 제공하는 메서드**로 조회 (다른 도메인 Repository 직접 호출 X) |
| 트랜잭션 | Service 클래스에 `@Transactional(readOnly = true)`, 쓰기 메서드에만 `@Transactional` |
| 포맷 | 들여쓰기 공백 4칸, 메서드 사이 빈 줄 1줄, 포매터 설정 파일은 저장소에 공유 |

## API 경로

| 구분 | 경로 |
| --- | --- |
| 비로그인 API | `/api/public/**` |
| 관리자 API | `/api/admin/**` |
| 로그인 필요 API | `/api/**` |

- 복수형 리소스: `/posts`, `/posts/{postId}`
- 하위 리소스: `/posts/{postId}/comments`
- 하위 리소스를 ID로 바로 식별 가능하면 상위 생략: `/comments/{commentId}`
- 로그인한 본인: `/members/me`, `/members/me/posts`
- 여러 단어는 하이픈: `/expert-profiles`
- 경로 변수는 대상을 명확히: `{postId}` (O) `{id}` (X)
- 공개 API에는 Swagger `@SecurityRequirements` 표시 (실제 허용은 SecurityConfig에서)
- 본인 여부·권한은 URL과 별개로 **서버에서 검증**

## Frontend 규칙 (`frontend/`)

| 대상 | 규칙 | 예 |
| --- | --- | --- |
| 컴포넌트 파일 | PascalCase | `LoginForm.tsx` |
| 훅 | `use` + 이름 | `useAuth` |
| API 호출 | `api/` 계층에서만, `api/client.ts`의 `apiClient`로 보낸다 (컴포넌트에서 직접 fetch·axios 금지) | `api/member.ts` |
| 외부 UI 라이브러리 | Monaco, xterm.js, cmdk는 각각 감싸는 컴포넌트 하나에서만 import | `NewsEditor.tsx`만 `monaco-editor`를 import |
| 폴더 구조 | 아래 「폴더 구조」 | `domains/news/` |

### 폴더 구조 (`frontend/src/`)

```txt
src/
  api/          서버 요청. client.ts(axios 인스턴스) + 도메인별 파일(news.ts, member.ts)
  vscode/       VSCode 모양 화면 틀. 레이아웃, 탐색기, 탭, 에디터, 터미널, 상태바, 아이콘
  domains/
    member/     회원 (가입, 로그인, 개인 설정)
    news/       뉴스 (목록, 기사 → 코드 변환, 검색, 터미널 news 명령, 북마크·구독)
    chat/       채팅·친구 (AI agent 창)
    community/  커뮤니티
    salary/     월급 현황
    admin/      관리자
  styles/       VSCode 색 변수 (theme.css)
```

- 도메인 담당자는 **자기 `domains/<도메인>/` 폴더**와 `api/<도메인>.ts`를 맡는다. 폴더마다 `README.md`에 맡는 기능과 화면 위치가 있다.
- `vscode/`는 모든 도메인이 같이 쓰는 화면이다. 고칠 때는 PR에 이유를 적고 팀장 리뷰를 받는다.
- `vscode/`는 도메인 코드를 가져다 화면에 놓을 수 있지만, 도메인끼리는 서로 import하지 않는다. 다른 도메인의 데이터가 필요하면 `api/`로 받는다.

---

# Part 3. 🚫 하지 말 것 (그리고 대신 할 것)

> 아래 항목은 **PR 리뷰에서 발견되면 병합하지 않는다.**
> 가능한 항목은 린트·테스트·CI로 **자동으로 막는다** (🔧 표시).

## Git

| ❌ 하지 말 것 | 왜 위험한가 | ✅ 대신 이렇게 |
| --- | --- | --- |
| `main`, `dev`에 직접 push 🔧 | 리뷰 없이 다른 사람 작업이 깨진다 | 기능 브랜치 → PR. 저장소에 Branch protection 설정 |
| 비밀 파일 커밋 (`application-secret.properties`, `.env`) 🔧 | 한 번 올라가면 유출된 것으로 본다 | 첫 커밋에 `.gitignore`, 커밋 전 `git status`로 확인. 올라갔으면 **키부터 재발급** |
| `git add .`로 전부 올리기 | 관련 없는 파일·비밀 파일이 섞인다 | `git add <관련 파일>`로 골라서 |
| 이미 push한 커밋에 `amend`, `reset`, `push --force` | 팀원 기록과 어긋나서 충돌·유실 | 공유된 커밋은 `git revert`로 취소 |
| 브랜치를 오래 들고 있기 (일주일+) | 충돌이 커진다 | 작게 나눠 자주 PR. 매일 `dev` 최신 받기 |
| 충돌 날 때 한쪽 코드로 덮어쓰기 | 다른 사람 작업이 사라진다 | 같이 고친 팀원과 확인하며 둘 다 살리기 |
| 이슈 없이 작업 시작 | 무슨 작업인지, 언제 끝인지 모른다 | 이슈 먼저 (완료 조건 포함) → 브랜치 |
| 기능 + 버그 수정 + 리팩토링을 한 PR에 | 리뷰가 어렵고 되돌리기 어렵다 | 목적별로 PR 분리 |
| PR에 "잘 될 것 같습니다" | 실제로 확인한 게 없다 | 실행한 테스트·요청과 응답을 "확인 결과"에 |
| 리뷰 없이 남의 도메인·공통 코드 병합 | 다른 사람 기능이 깨진다 | 영향받는 담당자 리뷰 후 병합 |

## 코드

| ❌ 하지 말 것 | 왜 위험한가 | ✅ 대신 이렇게 |
| --- | --- | --- |
| 필드 주입 `@Autowired` 🔧 | 테스트·불변성 깨짐, 코드 모양이 섞인다 | `private final` + `@RequiredArgsConstructor` |
| 엔티티를 API 응답으로 반환 🔧 | 내부 구조·민감 정보 노출, 순환 참조 | 응답 DTO(`record`)로 변환 |
| Controller에서 Repository 직접 호출 🔧 | 비즈니스 로직이 흩어진다 | Controller → Service → Repository |
| 다른 도메인 Repository 직접 호출 🔧 | 조회 조건·예외 처리가 여러 곳에 중복 | 그 도메인 Service의 조회 메서드 사용 |
| 예외 삼키기 `catch (Exception e) {}` 🔧 | 문제가 숨어서 원인을 못 찾는다 | 처리 못 하면 던지기, `BusinessException` + `ErrorCode` |
| 새 예외 클래스·ErrorCode 마구 만들기 | 같은 에러가 여러 이름으로 | 기존 `ErrorCode` 먼저 검색해 재사용 |
| `System.out.println` 디버깅 흔적 🔧 | 로그 관리가 안 된다 | `@Slf4j` 로그, 커밋 전 제거 |
| `Thread.sleep()`으로 타이밍 문제 덮기 🔧 | 원인은 그대로, 성능만 나빠진다 | 원인(동시성·트랜잭션 순서)을 찾아 고치기 |
| enum을 `ORDINAL`로 저장 🔧 | 순서 바뀌면 기존 데이터 의미가 바뀜 | `@Enumerated(EnumType.STRING)` |
| 하드코딩한 숫자·문자열 | 뜻을 모르고, 바꿀 때 여러 곳 수정 | 이름 있는 상수 (`MAX_FILE_COUNT`) |
| 주석 처리한 옛 코드, `TODO 나중에` 🔧 | 쌓여서 아무도 안 지운다 | 지우기 (Git에 남아 있다). 할 일은 이슈로 |
| 키·비밀번호를 코드에 직접 작성 🔧 | 커밋하는 순간 유출 | `application-secret.properties` / 환경변수 |
| 프론트 컴포넌트에서 직접 fetch·axios 🔧 | API 주소·에러 처리가 흩어진다 | `api/` 계층 함수만 사용 |
| `any`, `@ts-ignore` 🔧 | 타입 검사가 꺼진다 | 정확한 타입 정의, 필요하면 이유를 PR에 |
| `GlobalExceptionHandler` 등 공통 코드 임의 수정 | 모든 도메인에 영향 | 팀장에게 요청, PR에 이유 |
| AI가 만든 코드를 이해 못 한 채 커밋 | 면접에서 설명 못 하고, 버그를 못 고친다 | 설명할 수 있을 때까지 읽고, 실행 결과 확인 후 커밋 ([CLAUDE.md](../CLAUDE.md)) |
