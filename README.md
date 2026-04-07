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

> SQLite 파일(`backend/prisma/dev.db`)이 자동 생성되고 초기 데이터가 삽입됩니다.

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

```bash
pnpm dev              # 프론트 + 백엔드 동시 실행
pnpm dev:backend      # 백엔드만 실행
pnpm dev:frontend     # 프론트만 실행
pnpm setup            # DB 스키마 적용 + 초기 데이터 삽입
pnpm db:reset         # DB 초기화 (데이터 삭제 후 재생성)
pnpm prisma:studio    # DB GUI 실행 → http://localhost:5555
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
