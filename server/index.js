// CommonJS
// const WebSocket = require("ws");
// const wss = new WebSocket.Server({ port: 8080 });

import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

// WebSocket Server(wss) 이벤트:
// connection: 클라이언트가 연결될 때 발생
// close: 클라이언트가 연결을 끊을 때 발생
// error: 오류가 발생할 때 발생
// headers: 응답 헤더 전송 전
wss.on("connection", (ws) => {
  console.log("클라이언트 연결됨");

  // 개별 WebSocket 연결(ws) 이벤트:
  // message: 메시지 수신
  // close: 연결 종료
  // error: 오류
  // open: 연결 성공(클라이언트)
  // ping: 클라이언트가 연결 유지를 위해 보낸 패킷
  // pong: 서버가 클라이언트의 ping에 대한 응답
  ws.on("message", (message) => {
    console.log("메시지 수신:", message);

    // 모든 클라이언트에 브로드캐스트
    wss.clients.forEach((client) => {
      // OPEN은 클래스의 static 상수이기 때문에 ws가 아닌 WebSocket.OPEN으로 접근해야 함
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("클라이언트 연결 종료");
  });

  ws.on("error", (error) => {
    console.error("오류 발생:", error);
  });
});
