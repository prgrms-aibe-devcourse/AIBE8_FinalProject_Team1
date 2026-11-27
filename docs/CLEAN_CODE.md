# 클린 코드 규칙

> 『클린 코드』(로버트 C. 마틴)의 원칙을 이 프로젝트(Spring + React)에 맞게 줄인 개발 기준.
> 사람도 AI도 이 문서를 기준으로 코드를 작성하고 리뷰한다.
> 🔧 표시는 린트·테스트로 자동으로 막는(막을) 규칙이다. 같은 지적을 리뷰에서 두 번 하게 되면 문장을 늘리지 말고 자동 검사로 옮긴다.

# 코드 작성 원칙

기준은 하나다. **다음에 이 코드를 읽는 사람(사람이든 AI든)이 쉽게 이해하고 고칠 수 있는가.**
규칙끼리 부딪히거나 규칙을 따르면 오히려 읽기 어려워질 때는 이 기준을 우선하고, PR에 이유를 적는다.

## 1. 이름

### 규칙
- 이름만 보고 **무엇을 담는지, 무엇을 하는지** 알 수 있게 짓는다.
- 한 글자·축약 이름은 쓰지 않는다. 짧은 반복문의 `i`만 예외.
- **메서드는 동사**로 시작하고, **변수·클래스는 명사**로 짓는다.
- 여러 개를 담으면 **복수형** (`members`, `orderItems`).
- `boolean`은 `is`, `has`, `can`으로 시작한다 (`isDeleted`, `hasStock`, `canCancel`).
- **한 개념에는 한 단어만.** `get`, `find`, `fetch`, `load`를 같은 뜻으로 섞지 않는다.
- 이름이 하는 일을 숨기지 않는다. `getMember`가 저장까지 한다면 이름이 틀린 것.
- 숫자·문자열 값은 이름 있는 상수로. 단위가 있으면 이름에 넣는다 (`TIMEOUT_MS`, `MAX_FILE_SIZE_MB`). 🔧

### 메서드 이름 통일 (팀 약속)

| 하는 일 | 접두어 | 예 |
| --- | --- | --- |
| 하나 조회 (없으면 예외) | `get` | `getMember(memberId)` |
| 하나 조회 (없을 수 있음) | `find` → `Optional` 반환 (TypeScript는 `T \| undefined`) | `findByEmail(email)` |
| 목록 조회 | `get` + 복수형 | `getPosts(condition)` |
| 생성 | `create` | `createOrder(request)` |
| 수정 | `update` | `updateNickname(...)` |
| 삭제 | `delete` | `deletePost(postId)` |
| 검증 (실패 시 예외) | `validate` | `validateOwner(post, memberId)` |
| 여부 확인 | `is` / `has` / `can` / `exists` | `existsByEmail(email)` |
| 변환 (매퍼) | `to` + 대상 | `toEntity`, `toResponse` |

> 팀에서 확정 후 이 표만 고친다. 확정하면 섞어 쓰지 않는다.

### 예시

```java
// ❌
List<Member> list = repo.findAll();
int d = 7;
public Member get(Long id) { ... }        // 무엇을?
public boolean check(Member m) { ... }    // 무엇을 확인?

// ✅
List<Member> activeMembers = memberRepository.findAllByStatus(ACTIVE);
private static final int REFUND_LIMIT_DAYS = 7;
public Member getMember(Long memberId) { ... }
public boolean canRefund(Order order) { ... }
```

## 2. 메서드

- **한 가지 일만** 한다. 설명할 때 "그리고"가 들어가면 나눌 수 있는지 본다.
- 한 메서드 안에서는 **같은 수준의 일만** 한다. 큰 흐름(검증 → 계산 → 저장)과 세부 처리(문자열 자르기, 반복문)를 섞지 않는다.
- 파일 안에서 **위에서 아래로** 읽히게 둔다. 부르는 메서드 바로 아래에 불리는 메서드.
- 인자는 **3개 이하.** 넘으면 객체(DTO, 조건 객체)로 묶는다. 🔧
- `true/false`로 동작을 바꾸는 **플래그 인자 금지.** 메서드를 둘로 나눈다.
- **값을 바꾸는 메서드와 값을 알려주는 메서드를 나눈다.** 조회처럼 보이는 메서드가 몰래 상태를 바꾸지 않는다.
- 복잡한 조건은 이름 있는 메서드·변수로 뺀다 (`if (canPurchase(member))`). 부정의 부정(`!isNotValid`) 금지.
- 너무 잘게 쪼개지도 않는다. 메서드 하나를 이해하려고 여러 파일을 오가야 하면 지나친 것.

```java
// ❌ 한 메서드에 검증·계산·저장·알림이 섞임
public void order(Long memberId, Long productId, int qty, boolean notify) { ... 80줄 ... }

// ✅ 큰 흐름만 보이고, 세부는 아래 메서드로
@Transactional
public OrderResponse createOrder(Long memberId, OrderCreateRequest request) {
    Member member = memberService.getMember(memberId);
    Product product = productService.getProduct(request.productId());
    validateStock(product, request.quantity());

    Order order = Order.create(member, product, request.quantity());
    orderRepository.save(order);
    return orderMapper.toResponse(order);
}

private void validateStock(Product product, int quantity) { ... }
```

## 3. 주석

- 주석은 코드만으로 알 수 없는 **"왜"** 에만 쓴다 (외부 제약, 일부러 그렇게 한 이유, 건드리면 생기는 문제).
- 코드를 다시 말하는 주석, **주석 처리한 옛 코드**, 변경 이력, 구역 배너(`// ===== 유틸 =====`)는 남기지 않는다. 옛 코드와 이력은 Git에 있다. 🔧
- `// 임시`, `// 일단`, `// TODO 나중에 수정` 같은 **변명 주석 금지.** 할 일이면 이슈로 만든다. 🔧
- 주석을 달아야 읽히는 코드라면, 먼저 **이름을 바꾸거나 메서드로 빼서** 해결할 수 있는지 본다.

```java
// ❌
// 회원을 조회한다
Member member = memberService.getMember(memberId);

// ✅ (이유가 있을 때만)
// 토스 결제 승인 API는 같은 orderId로 두 번 호출하면 409를 주므로, 승인 전에 상태를 먼저 확인한다
```

## 4. 객체와 데이터

- 상태를 가진 객체(엔티티)는 밖에서 필드를 직접 바꾸지 않고 **객체에게 시킨다.**
  - `order.setStatus(CANCELED)` 대신 `order.cancel()` → 취소 규칙이 바뀌면 한 곳만 고친다.
- 데이터를 옮기기만 하는 타입(DTO)에는 로직을 넣지 않는다.
- 객체를 줄줄이 타고 들어가지 않는다 (`order.getMember().getAddress().getCity()`). 필요한 것을 직접 묻는 메서드를 둔다. (DTO는 예외)
- 종류에 따라 갈라지는 `switch/if`가 여러 곳에 반복되면, enum 메서드나 인터페이스로 옮긴다.

> ⚠️ **팀 결정 필요**: EFY 컨벤션은 "엔티티를 요청·응답에 직접 쓰지 않으므로 `@Setter` 허용"이었다.
> 이번 프로젝트는 상태 변경 규칙이 있는 필드(상태, 재고, 잔액 등)만이라도 **의미 있는 메서드**(`cancel()`, `decreaseStock()`)로 바꾸는 것을 제안한다. 동시성·부하 테스트에서 규칙을 한 곳에서 지키기 쉽다.

## 5. 오류 처리

- 실패는 `null`, `-1`, `false` 반환이 아니라 **예외**로 알린다. (`BusinessException` + `ErrorCode`)
- 예외 메시지에는 **어떤 작업이, 어떤 값 때문에, 왜** 실패했는지 넣는다.
- **예외를 삼키지 않는다.** 빈 `catch`, 로그만 찍고 넘어가는 `catch` 금지. 처리할 수 없으면 위로 던진다. 🔧
- 예외 처리는 한 곳에 모은다 (`GlobalExceptionHandler`, 프론트는 API 클라이언트 인터셉터·에러 바운더리).
- `null`을 반환하지도, 인자로 넘기지도 않는다. 목록은 빈 리스트, 없을 수 있는 값은 `Optional` / `T | undefined`.

## 6. 외부 코드와의 경계

- 외부 라이브러리·API(결제, S3, 소셜 로그인, 외부 HTTP API)는 **감싸는 클래스 하나**에서만 쓴다. 서비스·컴포넌트에서 직접 부르지 않는다. 🔧
  - 예: `global/storage/S3StorageClient`, `global/payment/TossPaymentClient`
  - 프론트 예: Monaco Editor는 `NewsEditor`, xterm.js는 `NewsTerminal` 컴포넌트 안에서만 쓴다.
- 감싸는 클래스는 외부 응답을 **우리 타입**으로, 외부 예외를 **우리 예외**로 바꿔서 돌려준다.
- 아직 없는 API에 맞춰 개발할 때는 원하는 모양의 인터페이스를 먼저 정하고, 나중에 실제 API를 연결한다.

## 7. 클래스와 컴포넌트

- 클래스(서비스, React 컴포넌트)를 바꿔야 하는 **이유는 하나**여야 한다.
- 이름에 `Manager`, `Helper`, `Util`, `Processor`가 들어가거나 이름 짓기가 어렵다면 책임이 너무 많다는 신호.
- 기존 파일에 계속 덧붙이지 않는다. 파일이 커지면 덧붙이기 전에 나눌지 먼저 본다.
- React 컴포넌트에 데이터 가져오기·상태 관리·화면 그리기가 몰리면 **커스텀 훅과 하위 컴포넌트로** 나눈다.
- 객체는 쓰는 곳에서 `new`로 만들지 않고 **생성자 주입**으로 받는다.

## 8. 중복과 과한 설계

- 새 메서드·컴포넌트·타입·ErrorCode를 만들기 전에 **비슷한 것이 이미 있는지 먼저 찾는다.**
- 지금 필요 없는 추상화(쓰는 곳이 하나뿐인 인터페이스, 팩토리, 설정 옵션)를 "나중을 위해" 미리 만들지 않는다.
- 쓰지 않는 코드(죽은 메서드, 안 쓰는 import·변수)는 남기지 않는다. 🔧
- **같은 일은 같은 방식으로.** 예외 처리, 응답 형식, 날짜 처리, `async/await`와 `.then()` 등을 섞지 않는다.

---

## ✅ PR 셀프 체크 (올리기 전에)

- [ ] 이름만 보고 무엇을 하는지 알 수 있는가?
- [ ] 메서드가 한 가지 일만 하는가? 인자가 3개 이하인가?
- [ ] 주석 처리한 코드, 변명 주석, `System.out.println`이 없는가?
- [ ] 예외를 삼키는 곳이 없는가?
- [ ] 이미 있는 메서드·ErrorCode를 다시 만들지 않았는가?
- [ ] 이 코드를 내가 말로 설명할 수 있는가?
