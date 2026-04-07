# PortOne V2 결제 연동 POC

PortOne V2 API를 활용한 결제 연동 데모 프로젝트입니다.  
Node.js(Express) 백엔드 + React 프론트엔드 모노레포 구성이며, Clerk 소셜 로그인과 PortOne 결제 플로우를 포함합니다.

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프론트엔드 | React, TypeScript, Vite, TanStack Query, Tailwind CSS |
| 백엔드 | Node.js, Express, Prisma |
| 데이터베이스 | SQLite (별도 설치 불필요) |
| 인증 | Clerk (소셜 로그인) |
| 결제 | PortOne V2 |

---

## 사전 요구사항

- Node.js 20+
- pnpm (`npm install -g pnpm`)

---

## 시작하기

모든 명령어는 **프로젝트 루트**에서 실행합니다.

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경 변수 설정

`backend/.env.example`과 `frontend/.env.example`을 복사해 `.env`를 만들고 값을 채웁니다.

**`backend/.env`**

```env
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET="임의의_문자열"
ACCESS_TOKEN_EXPIRATION="1h"
REFRESH_TOKEN_EXPIRATION="7d"
CORS_ORIGIN="http://localhost:5173"
PORTONE_STORE_ID="포트원_스토어_ID"
PORTONE_API_SECRET="포트원_API_시크릿"
PORTONE_CHANNEL_KEY_NHN_KCP="NHN_KCP_채널키"
PORTONE_CHANNEL_KEY_KG_INICIS="KG이니시스_채널키"
PORTONE_CHANNEL_KEY_KAKAOPAY="카카오페이_채널키"
CLERK_SECRET_KEY="sk_test_..."
```

**`frontend/.env`**

```env
VITE_SERVER_API_URL=http://localhost:3000/api/v1
VITE_PORTONE_STORE_ID="포트원_스토어_ID"
VITE_CLERK_PUBLISHABLE_KEY="pk_test_..."
```

### 3. DB 초기화

```bash
pnpm setup
```

> SQLite 파일(`backend/prisma/dev.db`)이 자동 생성됩니다. 별도 DB 설치는 필요 없습니다.

### 4. 개발 서버 실행

```bash
pnpm dev
```

| 서버 | 주소 |
|------|------|
| 프론트엔드 | http://localhost:5173 |
| 백엔드 | http://localhost:3000 |
| API 문서 | http://localhost:3000/docs |

---

## 명령어 목록

**처음 실행할 때** (순서대로)

```bash
pnpm install       # 1. 의존성 설치
pnpm setup         # 2. DB 생성 및 초기 데이터 삽입
pnpm dev           # 3. 프론트 + 백엔드 동시 실행
```

**이후 실행할 때**

```bash
pnpm dev           # 프론트 + 백엔드 동시 실행
pnpm dev:backend   # 백엔드만 실행
pnpm dev:frontend  # 프론트만 실행
```

**DB 관련**

```bash
pnpm db:reset        # DB 초기화 (데이터 전체 삭제 후 재생성)
pnpm prisma:studio   # DB 데이터 GUI로 확인 → http://localhost:5555
```

---

## API 엔드포인트

### 결제

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|:----:|------|
| GET | `/api/v1/payments/channel-key?pg={PG사}` | | PG사별 채널키 조회 |
| POST | `/api/v1/payments/complete` | ✓ | 결제 완료 처리 및 검증 |
| GET | `/api/v1/payments/my` | ✓ | 내 결제 내역 조회 |
| POST | `/api/v1/payments/:paymentId/cancel` | ✓ | 결제 취소 |

### 티켓

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|:----:|------|
| GET | `/api/v1/tickets/products` | | 티켓 상품 목록 조회 |
| GET | `/api/v1/tickets/my-credits` | ✓ | 잔여 크레딧 조회 |

### 사용자

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|:----:|------|
| GET | `/api/v1/user` | ✓ | 내 프로필 조회 |

**응답 형식**

```json
{
  "isSuccess": true,
  "code": "SUCCESS",
  "message": "요청이 성공적으로 처리되었습니다.",
  "result": {}
}
```

**지원 PG사** (`pg` 파라미터): `NHN_KCP` | `KG_INICIS` | `KAKAOPAY`

---

## 인증

Clerk 소셜 로그인을 사용합니다.  
최초 로그인 시 Clerk 계정 정보를 기반으로 로컬 DB에 사용자가 자동 생성됩니다.  
인증이 필요한 API는 `Authorization: Bearer <Clerk JWT>` 헤더를 포함해야 합니다.

---

## 프론트엔드 사용 흐름

### 1. 로그인 (`/login`)
- Google 등 소셜 계정으로 Clerk 로그인
- 로그인 성공 시 `/` (홈) 으로 이동
- 최초 로그인이면 백엔드 DB에 사용자가 자동 생성됨

### 2. 홈 (`/`)
- 로그인한 사용자 이름·이메일 표시
- **티켓 구매** 버튼 → `/payment` 이동
- **로그아웃** 버튼 → Clerk 세션 종료 후 `/login` 이동

### 3. 티켓 구매 (`/payment`)

#### 상품 선택
- 판매 중인 티켓 상품 목록 표시 (리포트 생성권 1개 / 3개)
- `+` / `-` 버튼으로 수량 조절
- 현재 잔여 크레딧 수 상단에 표시

#### 결제
- 수량을 1개 이상 선택하면 결제 수단 버튼 노출
- PG사 선택: **NHN KCP (카드)** / **KG이니시스 (카드)** / **카카오페이 (간편결제)**
- 버튼 클릭 시 흐름:
  1. 백엔드에서 해당 PG사의 채널키 조회
  2. PortOne SDK로 결제창 호출
  3. 결제 완료 후 백엔드에 검증 요청 (`POST /payments/complete`)
  4. 검증 성공 시 크레딧 지급 + 잔여 크레딧 갱신

#### 결제 내역
- 페이지 하단에 본인의 결제 내역 목록 표시
- 각 결제 건마다 **취소** 버튼으로 결제 취소 가능
