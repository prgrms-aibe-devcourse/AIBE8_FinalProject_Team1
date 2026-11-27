# 작업 원칙

이 저장소의 코드는 다음 작업의 본보기가 된다. 기존 코드의 패턴을 따르되,
따르려는 패턴이 우회 코드나 중복으로 보이면 복제하지 말고 먼저 알린다.
코드 작성 원칙은 docs/CLEAN_CODE.md, 컨벤션은 docs/CONVENTION.md를 따른다.

## 서비스 컨셉
- VSCode처럼 **보이기만** 하는 뉴스 서비스다. 실제 VSCode 기능(파일 저장, Git, 진짜 쉘 실행)은 만들지 않는다.
- 터미널은 진짜 쉘이 아니라 `news ls`, `news grep` 같은 정해진 명령어만 해석한다.
- 외부 UI 라이브러리(Monaco, xterm.js, cmdk)는 감싸는 컴포넌트 하나에서만 import한다.

## 문제를 고칠 때
- 증상을 덮지 말고 근본 원인을 고친다. sleep, 재시도, 예외 무시, 경고 억제로
  넘어가고 싶으면 멈추고 원인을 설명한다.
- 린트·타입·테스트가 실패하면 규칙을 끄거나 테스트를 약하게 만들지 않는다.
- 옳은 일을 하지 않은 이유를 주석에 적지 않는다.
- 새로 만들기 전에 기존 메서드·ErrorCode·컴포넌트가 있는지 먼저 찾는다.

## 작업을 끝냈다고 말하기 전에
- 빌드와 검사를 실행하고 결과를 보여준다.
- 동작이 바뀌었으면 실제로 실행한 증거(화면 스크린샷, 요청과 응답, 로그)를 남긴다.
- 확인하지 못한 부분은 그대로 밝힌다.

## 같은 지적을 다시 받았을 때
- 이 문서에 문장을 추가하기보다 oxlint·Checkstyle·ArchUnit 규칙이나
  테스트로 자동 차단할 방법을 먼저 제안한다.

## 명령어
- 프론트 (`frontend/`): npm run dev / npm run lint / npm run typecheck / npm run build / npm run format
- 백엔드 (`backend/`): ./gradlew check / ./gradlew test / ./gradlew bootRun

## 구조
- frontend/: 웹 화면 (React + TypeScript + Vite)
- desktop/: Electron 앱 (frontend 빌드 결과를 띄움)
- backend/: Spring Boot API 서버
  - domain/{도메인}: 엔티티 하나당 패키지 하나, DTO만 dto 하위 패키지
  - global/: 공통 (예외, 보안, 설정) — 팀장만 수정
  - 다른 도메인 데이터는 그 도메인 Service 메서드로만 조회
