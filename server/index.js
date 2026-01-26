// CommonJS
// const WebSocket = require("ws");
// const wss = new WebSocket.Server({ port: 8080 });

import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

console.log("🚀 WebSocket 서버가 ws://localhost:8080 에서 실행 중입니다.");

wss.on("connection", (ws) => {
  console.log("✅ 클라이언트 연결됨");

  ws.on("message", (message) => {
    const messageString = message.toString();
    console.log("📨 메시지 수신:", messageString);

    // 모든 클라이언트에 브로드캐스트
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageString);
      }
    });
  });

  ws.on("close", () => {
    console.log("❌ 클라이언트 연결 종료");
  });

  ws.on("error", (error) => {
    console.error("⚠️ 서버 오류 발생:", error);
  });
});
