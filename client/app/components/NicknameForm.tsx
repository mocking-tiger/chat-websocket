"use client";

import { useState } from "react";

interface NicknameFormProps {
  onSubmit: (nickname: string) => void;
}

const NicknameForm = ({ onSubmit }: NicknameFormProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSubmit(inputValue.trim());
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          💬 WebSocket Chat
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          실시간 채팅에 참여하세요
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="nickname"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            닉네임
          </label>
          <input
            id="nickname"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="닉네임을 입력하세요"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     placeholder-gray-400 dark:placeholder-gray-500
                     transition-all"
            maxLength={20}
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 
                   disabled:bg-gray-400 disabled:cursor-not-allowed
                   text-white font-semibold rounded-lg
                   transition-all duration-200 transform hover:scale-[1.02]
                   focus:ring-4 focus:ring-blue-300"
        >
          채팅 시작하기
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>🔗 WebSocket 학습 프로젝트</p>
      </div>
    </div>
  );
};

export default NicknameForm;
