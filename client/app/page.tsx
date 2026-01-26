"use client";

import { useState } from "react";
import NicknameForm from "./components/NicknameForm";
import ChatRoom from "./components/ChatRoom";

const Home = () => {
  const [nickname, setNickname] = useState<string>("");

  const handleNicknameSubmit = (name: string) => {
    setNickname(name);
  };
  console.log({nickname});
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-4xl mx-4">
        {!nickname ? (
          <NicknameForm onSubmit={handleNicknameSubmit} />
        ) : (
          <ChatRoom nickname={nickname} setNickname={setNickname} />
        )}
      </main>
    </div>
  );
};

export default Home;
