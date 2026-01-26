# 💬 WebSocket 채팅 애플리케이션

WebSocket 개념 학습을 위한 실시간 채팅 토이 프로젝트

---

## 📚 목차

1. [웹소켓이란?](#1️⃣-웹소켓websocket이란)
2. [프로젝트 구조](#2️⃣-client와-server-폴더-구분)
3. [실행 플로우](#3️⃣-사용자-접속-시-전체-플로우)
4. [실행 방법](#🚀-실행-방법)
5. [기술 스택](#🛠️-기술-스택)

---

## 1️⃣ 웹소켓(WebSocket)이란?

### 🏢 비유: 전통적인 HTTP vs WebSocket

#### HTTP (기존 방식) - "편지 우편"
```
[클라이언트]                    [서버]
   "안녕?"      ───────▶      받음
                 ◀───────      "안녕!"
   
   "뭐해?"      ───────▶      받음
                 ◀───────      "코딩중"
```

**특징:**
- 클라이언트가 **질문할 때마다** 매번 새로운 연결
- 서버는 **질문받았을 때만** 답변 가능
- 요청(Request) → 응답(Response) → 연결 끊김
- 매번 새 봉투, 우표, 주소 써야 함 (오버헤드)

#### WebSocket - "전화 통화"
```
[클라이언트] ═══════════════ [서버]
   "안녕?"   ────────────▶   
              ◀────────────  "안녕!"
   "뭐해?"   ────────────▶   
              ◀────────────  "코딩중"
              ◀────────────  "너는?" (서버가 먼저!)
   "나도!"   ────────────▶   
```

**특징:**
- **한 번 연결**하면 계속 유지
- **양방향 소통** - 서버도 먼저 말할 수 있음
- **실시간** - 즉각 전달
- **효율적** - 헤더가 작음

---

### 📝 WebSocket의 핵심 개념

#### 1. **Full-Duplex (전이중 통신)**
```javascript
// 동시에 양쪽 방향으로 데이터 전송 가능
클라이언트 → 서버 (동시에)
클라이언트 ← 서버
```

#### 2. **Persistent Connection (지속적 연결)**
```javascript
// HTTP
연결 → 요청 → 응답 → 끊김 → 연결 → 요청 → 응답 → 끊김

// WebSocket  
연결 → 메시지 ↔ 메시지 ↔ 메시지 → (계속 유지)
```

#### 3. **Low Latency (낮은 지연)**
```javascript
// HTTP: 매번 핸드셰이크 (100ms)
// WebSocket: 한 번만 핸드셰이크, 이후 즉시 전송 (1ms)
```

---

### 🌐 WebSocket 프로토콜

```
일반 웹:  http://localhost:3000
보안 웹:  https://localhost:3000

WebSocket:     ws://localhost:8080
보안 WebSocket: wss://localhost:8080
```

**차이점:**
- `http://` - 웹 페이지 요청 (HTML, CSS, JS)
- `ws://` - 실시간 데이터 연결

---

### 💼 WebSocket 사용 사례

| 용도 | HTTP | WebSocket |
|------|------|-----------|
| 블로그 읽기 | ✅ 적합 | ❌ 과함 |
| 실시간 채팅 | ❌ 불가능 | ✅ 완벽 |
| 온라인 게임 | ❌ 불가능 | ✅ 완벽 |
| 주식 시세 | ❌ 폴링 필요 | ✅ 푸시 |
| 협업 도구 | ❌ 느림 | ✅ 실시간 |
| 로그인 | ✅ 적합 | ❌ 과함 |

---

## 2️⃣ Client와 Server 폴더 구분

### 🏗️ 프로젝트 구조

```
chat-websocket/
├── client/          ← 프론트엔드 (Next.js)
│   ├── app/
│   │   ├── page.tsx           (닉네임 입력 화면)
│   │   └── components/
│   │       ├── NicknameForm.tsx
│   │       └── ChatRoom.tsx   (채팅 UI)
│   └── package.json
│
└── server/          ← 백엔드 (Node.js)
    ├── index.js               (WebSocket 서버)
    └── package.json
```

---

### 🎭 Client (클라이언트) - "손님"

**역할:** 사용자가 보고 상호작용하는 부분

```
┌─────────────────────────────┐
│  브라우저 (Chrome, Safari)   │
│                              │
│  ┌────────────────────────┐ │
│  │  http://localhost:3000 │ │
│  └────────────────────────┘ │
│                              │
│  [닉네임 입력창]              │
│  [채팅 메시지들]              │
│  [메시지 입력창] [전송]       │
│                              │
└─────────────────────────────┘
```

**기술:**
- **Next.js** (React 프레임워크)
- **포트:** 3000
- **언어:** TypeScript, HTML, CSS

**하는 일:**
1. UI 렌더링 (화면에 보이는 것)
2. 사용자 입력 받기 (닉네임, 메시지)
3. WebSocket으로 서버에 연결
4. 메시지 전송 및 수신
5. 화면 업데이트

---

### 🏢 Server (서버) - "중개자"

**역할:** 모든 클라이언트를 연결하고 메시지 중계

```
        [클라이언트 A]
              ↕
        [클라이언트 B] ← → [서버 (포트 8080)]
              ↕
        [클라이언트 C]
```

**기술:**
- **Node.js** + **ws 라이브러리**
- **포트:** 8080
- **언어:** JavaScript

**하는 일:**
1. WebSocket 서버 실행
2. 클라이언트 연결 수락
3. 메시지 수신
4. **모든 클라이언트에게 브로드캐스트** (중계)
5. 연결 관리

---

### 🤔 왜 분리했나?

#### 1. **역할 분리 (Separation of Concerns)**
```javascript
// 클라이언트: "어떻게 보여줄까?" (프레젠테이션)
<div className="message">{content}</div>

// 서버: "어떻게 전달할까?" (비즈니스 로직)
wss.clients.forEach(client => client.send(message));
```

#### 2. **독립적 배포**
```bash
# 클라이언트만 업데이트
cd client && npm run build && deploy

# 서버만 업데이트  
cd server && restart
```

#### 3. **확장성**
```
하나의 서버 → 여러 클라이언트 (웹, 앱, 태블릿)
```

#### 4. **다른 포트 = 다른 프로세스**
```
포트 3000: Next.js 개발 서버 (npm run dev)
포트 8080: WebSocket 서버 (node index.js)
```

---

## 3️⃣ 사용자 접속 시 전체 플로우

### 🎬 Scene 1: 초기 로딩

```
사용자가 브라우저에 http://localhost:3000 입력!
```

**1단계: HTTP 요청**
```
[브라우저]                           [Next.js 서버 (포트 3000)]
   │                                        │
   │  GET http://localhost:3000            │
   │ ───────────────────────────────────▶  │
   │                                        │
   │       HTML, CSS, JavaScript 번들       │
   │ ◀───────────────────────────────────  │
   │                                        │
```

**2단계: React 앱 시작**
```javascript
// 브라우저가 JavaScript 실행
1. page.tsx 로드
2. useState로 nickname = "" 초기화
3. NicknameForm 컴포넌트 렌더링
```

**화면:**
```
┌────────────────────────────┐
│   💬 WebSocket Chat        │
│   실시간 채팅에 참여하세요   │
│                            │
│   닉네임: [_________]      │
│   [채팅 시작하기]          │
└────────────────────────────┘
```

---

### 🎬 Scene 2: 닉네임 입력

```
사용자가 "철수"를 입력하고 [채팅 시작하기] 클릭!
```

**JavaScript 실행:**
```javascript
// NicknameForm.tsx
handleSubmit(e) {
  e.preventDefault();
  onSubmit("철수"); // ← 여기!
}

// page.tsx
handleNicknameSubmit(name) {
  setNickname("철수"); // ← 상태 업데이트
}
```

**React 리렌더링:**
```javascript
// page.tsx
{!nickname ? (
  <NicknameForm />  // ← 이전: 이게 보임
) : (
  <ChatRoom nickname="철수" />  // ← 이제: 이게 보임!
)}
```

---

### 🎬 Scene 3: WebSocket 연결 시작

```
ChatRoom 컴포넌트가 마운트됨!
→ useEffect 실행
```

**코드 실행:**
```javascript
// ChatRoom.tsx
useEffect(() => {
  // 1. WebSocket 생성
  const ws = new WebSocket("ws://localhost:8080");
  
  // 2. 이벤트 리스너 등록
  ws.onopen = () => { ... };
  ws.onmessage = (event) => { ... };
}, []);
```

**네트워크 동작:**
```
[브라우저]                           [WebSocket 서버 (포트 8080)]
   │                                        │
   │  WebSocket 핸드셰이크 요청              │
   │  Upgrade: websocket                    │
   │ ───────────────────────────────────▶  │
   │                                        │
   │         101 Switching Protocols        │
   │ ◀───────────────────────────────────  │
   │                                        │
   │ ═══════ WebSocket 연결 수립 ═══════ │
```

**서버 콘솔:**
```bash
✅ 클라이언트 연결됨
```

---

### 🎬 Scene 4: 입장 메시지 전송

**연결 성공 시:**
```javascript
// ChatRoom.tsx
ws.onopen = () => {
  console.log("✅ WebSocket 연결됨");
  setIsConnected(true); // 상태 업데이트 (초록불)
  
  // 입장 메시지 전송
  const joinMessage = {
    type: "system",
    nickname: "System",
    content: "철수님이 입장했습니다."
  };
  ws.send(JSON.stringify(joinMessage));
};
```

**데이터 전송:**
```
[브라우저]                           [서버]
   │                                   │
   │  {"type":"system", ...}           │
   │ ────────────────────────────────▶ │
   │                                   │
```

**서버 처리:**
```javascript
// server/index.js
ws.on("message", (message) => {
  const messageString = message.toString();
  console.log("📨 메시지 수신:", messageString);
  
  // 모든 클라이언트에게 브로드캐스트
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageString);
    }
  });
});
```

**서버 콘솔:**
```bash
📨 메시지 수신: {"type":"system","nickname":"System","content":"철수님이 입장했습니다."}
```

---

### 🎬 Scene 5: 메시지 수신

**서버가 모든 클라이언트에게 전송:**
```
                    [클라이언트 A: 철수]
                           ↕
[서버] ─────────────→  [클라이언트 B: 영희]
                           ↕
                    [클라이언트 C: 민수]
```

**브라우저에서 수신:**
```javascript
// ChatRoom.tsx
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // {
  //   type: "system",
  //   nickname: "System", 
  //   content: "철수님이 입장했습니다."
  // }
  
  const newMessage = {
    id: "1234567890",
    nickname: data.nickname,
    content: data.content,
    timestamp: new Date(),
    type: data.type
  };
  
  setMessages(prev => [...prev, newMessage]);
};
```

**React 상태 업데이트 → 리렌더링:**
```jsx
// 화면에 표시
<div className="system-message">
  철수님이 입장했습니다.
</div>
```

---

### 🎬 Scene 6: 채팅 메시지 전송

```
철수가 "안녕하세요!" 입력 후 [전송] 클릭!
```

**1. 이벤트 핸들러 실행:**
```javascript
// ChatRoom.tsx
handleSendMessage(e) {
  e.preventDefault();
  
  const message = {
    type: "user",
    nickname: "철수",
    content: "안녕하세요!"
  };
  
  ws.send(JSON.stringify(message));
  setInputValue(""); // 입력창 비우기
}
```

**2. 서버 수신 및 브로드캐스트:**
```javascript
// server/index.js
ws.on("message", (message) => {
  // 받은 메시지를 모두에게 전송
  wss.clients.forEach((client) => {
    client.send(message.toString());
  });
});
```

**3. 모든 클라이언트 수신:**
```
[철수 브라우저]  → 서버 → [철수 브라우저] ✅
                          [영희 브라우저] ✅
                          [민수 브라우저] ✅
```

**4. 화면 업데이트:**
```
┌────────────────────────────────┐
│ System                         │
│ 철수님이 입장했습니다.           │
│                                │
│              철수  12:34       │
│         안녕하세요! 💬         │
└────────────────────────────────┘
```

---

### 📊 전체 플로우 다이어그램

```
┌─────────────┐
│ 사용자      │
└──────┬──────┘
       │
       │ 1. http://localhost:3000 접속
       ▼
┌──────────────┐
│ Next.js 서버 │ (포트 3000)
│ (클라이언트) │
└──────┬───────┘
       │ 2. HTML/JS 전달
       │ 3. React 앱 시작
       │ 4. 닉네임 입력
       │
       │ 5. WebSocket 연결 요청
       │    ws://localhost:8080
       ▼
┌──────────────┐
│ WebSocket    │ (포트 8080)
│ 서버         │
└──────┬───────┘
       │ 6. 연결 수락
       │ 7. 메시지 수신
       │ 8. 브로드캐스트
       │
       ▼
┌─────────────────┐
│ 모든 클라이언트  │
│ (실시간 업데이트)│
└─────────────────┘
```

---

### 🔄 실시간 통신 순환

```
┌──────────────────────────────────────────────┐
│                                              │
│  [사용자 입력]                               │
│       ↓                                      │
│  [React setState]                            │
│       ↓                                      │
│  [WebSocket.send()]                          │
│       ↓                                      │
│  ═══ 네트워크 ═══                           │
│       ↓                                      │
│  [서버 수신]                                 │
│       ↓                                      │
│  [모든 클라이언트에 전송]                     │
│       ↓                                      │
│  ═══ 네트워크 ═══                           │
│       ↓                                      │
│  [ws.onmessage]                              │
│       ↓                                      │
│  [React setState]                            │
│       ↓                                      │
│  [화면 리렌더링] ────────────────────────┐   │
│                                          │   │
└──────────────────────────────────────────┘   │
            (계속 반복)
```

---

## 🎯 핵심 요약

### 1. **WebSocket = 실시간 양방향 통신 채널**
- HTTP처럼 요청/응답이 아닌 **전화처럼 계속 연결**
- 서버도 클라이언트에게 먼저 메시지 가능

### 2. **Client/Server 분리 = 역할 분담**
- Client (포트 3000): 사용자에게 보여주기
- Server (포트 8080): 메시지 중계하기

### 3. **플로우 = 연결 → 메시지 주고받기 → 화면 업데이트**
```
HTTP로 페이지 로드
  ↓
WebSocket 연결
  ↓
메시지 송수신 (무한 반복)
  ↓
React 상태 업데이트
  ↓
화면 리렌더링
```

---

## 🚀 실행 방법

### 1. 서버 실행

```bash
cd server
npm install
node index.js
```

**출력:**
```
🚀 WebSocket 서버가 ws://localhost:8080 에서 실행 중입니다.
```

### 2. 클라이언트 실행 (새 터미널)

```bash
cd client
npm install
npm run dev
```

**출력:**
```
▲ Next.js 16.1.2
- Local:        http://localhost:3000
```

### 3. 브라우저 접속

```
http://localhost:3000
```

---

## 🐛 트러블슈팅

### 문제: 기능은 정상 동작하지만 브라우저 콘솔에 에러 발생

#### 🔴 증상

```javascript
⚠️ WebSocket 에러 발생
❌ WebSocket 연결 종료
   코드: 1006
   이유: 없음
   정상 종료: false

// 하지만 바로 다음에
✅ WebSocket 연결 성공
// 채팅은 정상 작동!
```

**브라우저 로그:**
```
🔵 WebSocket 연결 시도
🔴 컴포넌트 언마운트 - 연결 종료
🔵 WebSocket 연결 시도 (재시도)
✅ WebSocket 연결 성공
```

**패턴:** 연결 시도 → 즉시 종료 → 재연결 → 성공

---

#### 🔍 원인: React 18+ Strict Mode

React 18부터 **개발 모드에서만** 컴포넌트를 **두 번 렌더링**하여 부작용을 찾아내는 기능이 있습니다.

**React의 동작:**
```javascript
useEffect(() => {
  // 1. 첫 번째 실행
  return () => {
    // 2. cleanup 실행 (Strict Mode)
  }
  // 3. 두 번째 실행 (실제로 사용할 것)
}, []);
```

**우리 코드에서 일어난 일:**

```javascript
// ❌ 문제가 있던 코드
useEffect(() => {
  const ws = new WebSocket("ws://localhost:8080");
  
  ws.onopen = () => {
    console.log("연결 성공!");
    setIsConnected(true);
  };
  
  return () => {
    ws.close(); // cleanup: 연결 종료
  };
}, []);
```

**실행 순서:**

```
1️⃣ useEffect 첫 실행
   → new WebSocket() 생성
   → 연결 시작 (CONNECTING 상태)
   
2️⃣ Strict Mode가 즉시 cleanup 실행
   → ws.close() 호출
   → ⚠️ 문제: 아직 CONNECTING 상태인데 close() 호출!
   → 에러 코드 1006: "비정상 종료"
   
3️⃣ 0.01초 후 onopen 이벤트 발생
   → "연결 성공!" 로그
   → setIsConnected(true) 실행
   → ⚠️ 문제: 이미 cleanup된 WebSocket에 상태 업데이트!
   
4️⃣ useEffect 두 번째 실행 (진짜)
   → 새로운 WebSocket 생성
   → 정상 작동! ✅
```

**타임라인:**

| 시간 | 첫 번째 WebSocket | 두 번째 WebSocket |
|------|------------------|------------------|
| 0ms | 연결 시작 (CONNECTING) | - |
| 1ms | cleanup → close() ❌ | - |
| 10ms | onopen 실행 → setState ⚠️ | - |
| 15ms | - | 연결 시작 |
| 25ms | - | onopen 실행 ✅ |

---

#### ✅ 해결: `isMounted` 플래그 패턴

**수정된 코드:**

```javascript
useEffect(() => {
  let isMounted = true; // 🔑 핵심: 마운트 상태 추적
  
  const ws = new WebSocket("ws://localhost:8080");

  ws.onopen = () => {
    if (!isMounted) {
      // 이미 cleanup되었으면 즉시 종료
      ws.close();
      return;
    }
    
    console.log("연결 성공!");
    setIsConnected(true); // 마운트된 상태에서만 업데이트
  };

  ws.onmessage = (event) => {
    if (!isMounted) return; // cleanup되었으면 무시
    // ... 메시지 처리
  };

  ws.onclose = (event) => {
    if (!isMounted) return;
    setIsConnected(false);
  };

  ws.onerror = (event) => {
    if (!isMounted) return;
    console.error("WebSocket 에러");
  };

  return () => {
    isMounted = false; // 🔑 cleanup 시 플래그 변경
    ws.close();
  };
}, [nickname]);
```

**수정 후 동작:**

```
1️⃣ useEffect 첫 실행
   → isMounted = true
   → new WebSocket() 생성
   → 연결 시작 (CONNECTING)
   
2️⃣ Strict Mode가 cleanup 실행
   → isMounted = false 설정
   → ws.close() 호출
   
3️⃣ 0.01초 후 onopen 이벤트 발생
   → if (!isMounted) { ws.close(); return; } ✅
   → 상태 업데이트 안 함 (에러 없음!)
   → 연결 즉시 종료
   
4️⃣ useEffect 두 번째 실행
   → isMounted = true
   → 새 WebSocket 생성
   → onopen 실행 → isMounted가 true
   → 정상 작동! ✅
```

**결과:** 에러 메시지 없이 깔끔하게 동작 ✨

---

#### 🎯 핵심 개념

##### 1. WebSocket 생명주기와 React 생명주기의 비동기성

```javascript
// WebSocket은 비동기
new WebSocket()  // 즉시 반환, 백그라운드에서 연결
setTimeout(() => {
  // 100ms 후 onopen 실행
}, 100);

// React cleanup은 동기
return () => {
  ws.close(); // 즉시 실행
};
```

##### 2. 이벤트 핸들러는 Closure

```javascript
const ws = new WebSocket();

ws.onopen = () => {
  // 이 함수는 나중에 실행되지만
  // cleanup 시점의 변수를 참조할 수 있음
  console.log(isMounted); // ✅ 최신 값 확인 가능
};
```

##### 3. Strict Mode는 개발 모드에만 작동

```javascript
// 프로덕션 빌드 (npm run build)에서는
// useEffect가 한 번만 실행됨
// 따라서 isMounted 플래그가 없어도 문제 없음
// 하지만 안전을 위해 추가하는 게 좋음!
```

---

#### 🔬 디버깅 방법

**Strict Mode 확인:**

```javascript
useEffect(() => {
  console.log("🔵 useEffect 실행");
  
  return () => {
    console.log("🔴 cleanup 실행");
  };
}, []);

// 개발 모드 출력:
// 🔵 useEffect 실행
// 🔴 cleanup 실행
// 🔵 useEffect 실행

// 프로덕션 출력:
// 🔵 useEffect 실행
```

**WebSocket readyState 확인:**

```javascript
console.log(ws.readyState);
// 0: CONNECTING (연결 중)
// 1: OPEN (연결됨)
// 2: CLOSING (종료 중)
// 3: CLOSED (종료됨)

// CONNECTING 상태에서 close() 호출 → 1006 에러!
```

---

#### 💡 다른 해결 방법들

##### 방법 1: StrictMode 비활성화 (❌ 권장 안 함)
```javascript
// next.config.js
module.exports = {
  reactStrictMode: false, // ❌ 좋지 않은 방법
}
```

##### 방법 2: readyState 확인 (⚠️ 불완전)
```javascript
return () => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.close(); // ⚠️ CONNECTING 상태는 여전히 문제
  }
};
```

##### 방법 3: isMounted 플래그 (✅ 권장)
```javascript
let isMounted = true;
return () => {
  isMounted = false;
  ws.close();
};
```

---