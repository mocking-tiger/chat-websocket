"use client";

import { useState, useEffect, useRef } from "react";

interface ChatRoomProps {
  nickname: string;
  setNickname: (nickname: string) => void;
}

interface Message {
  id: string;
  nickname: string;
  content: string;
  timestamp: Date;
  type: "user" | "system";
}   

const ChatRoom = ({ nickname, setNickname }: ChatRoomProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket 연결
  useEffect(() => {
    let isMounted = true;
    const ws = new WebSocket("ws://localhost:8080");
    wsRef.current = ws;

    ws.onopen = () => {
      if (!isMounted) {
        ws.close();
        return;
      }
      
      console.log("✅ WebSocket 연결됨");
      setIsConnected(true);

      // 입장 메시지 전송
      const joinMessage = {
        type: "system",
        nickname: "System",
        content: `${nickname}님이 입장했습니다.`,
      };
      ws.send(JSON.stringify(joinMessage));
    };

    ws.onmessage = (event) => {
      if (!isMounted) return;
      
      try {
        const data = JSON.parse(event.data);
        const newMessage: Message = {
          id: Date.now().toString() + Math.random(),
          nickname: data.nickname,
          content: data.content,
          timestamp: new Date(),
          type: data.type || "user",
        };
        setMessages((prev) => [...prev, newMessage]);
      } catch (error) {
        console.error("메시지 파싱 에러:", error);
      }
    };

    ws.onclose = () => {
      if (!isMounted) return;
      console.log("WebSocket 연결 종료");
      setIsConnected(false);
    };

    ws.onerror = () => {
      if (!isMounted) return;
      console.error("WebSocket 에러 발생");
    };

    return () => {
      isMounted = false;
      
      if (ws.readyState === WebSocket.OPEN) {
        const leaveMessage = {
          type: "system",
          nickname: "System",
          content: `${nickname}님이 퇴장했습니다.`,
        };
        ws.send(JSON.stringify(leaveMessage));
      }
      
      ws.close();
    };
  }, [nickname]);

  // 메시지 전송
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || !wsRef.current || !isConnected) return;

    const message = {
      type: "user",
      nickname: nickname,
      content: inputValue.trim(),
    };

    wsRef.current.send(JSON.stringify(message));
    setInputValue("");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden h-[600px] flex flex-col">
      {/* 헤더 */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
          <h2 className="text-white text-xl font-bold">채팅방</h2>
          <p className="text-blue-100 text-sm">{nickname}님으로 접속 중</p>
          <button onClick={()=>setNickname("")} className="text-white text-sm bg-red-400 px-2 py-1 rounded-md">나가기</button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-400" : "bg-red-400"
            }`}
          />
          <span className="text-white text-sm">
            {isConnected ? "연결됨" : "연결 끊김"}
          </span>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
            <p>메시지가 없습니다.</p>
            <p className="text-sm mt-2">첫 메시지를 보내보세요! 👋</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.type === "system" ? "justify-center" : "justify-start"
              }`}
            >
              {msg.type === "system" ? (
                <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-full text-sm text-gray-600 dark:text-gray-300">
                  {msg.content}
                </div>
              ) : (
                <div
                  className={`max-w-[70%] ${
                    msg.nickname === nickname ? "ml-auto" : ""
                  }`}
                >
                  <div
                    className={`flex items-baseline gap-2 mb-1 ${
                      msg.nickname === nickname
                        ? "flex-row-reverse"
                        : "flex-row"
                    }`}
                  >
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {msg.nickname}
                    </span>
                    <span className="text-xs text-gray-400">
                      {msg.timestamp.toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      msg.nickname === nickname
                        ? "bg-blue-600 text-white rounded-tr-sm"
                        : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="메시지를 입력하세요..."
            disabled={!isConnected}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
                     placeholder-gray-400 dark:placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || !isConnected}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700
                     disabled:bg-gray-400 disabled:cursor-not-allowed
                     text-white font-semibold rounded-lg
                     transition-all duration-200"
          >
            전송
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
