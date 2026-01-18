"use client";

import Image from "next/image";
import { useChatId } from "./chatContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";
import { Schema } from "mongoose";

interface ChatDataType {
  authorName: string;
  time: string;
  content: string;
  authorId: string;
}

function ChatWindow() {
  const { chatId, chatName, chatEmail, chatImage } = useChatId();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const messageBoxRef = useRef<HTMLInputElement | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [chats, setChats] = useState<Array<ChatDataType>>([]);
  const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL);
  const [id, setId] = useState<Schema.Types.ObjectId | null>(null);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [chatId, chats]);

  useEffect(() => {
    chatContainerRef.current?.focus();
  }, []);

  const getChats = useCallback(
    function () {
      axios
        .post("/api/get-chats", { userId: chatId }, { withCredentials: true })
        .then((response) => {
          setChats(response.data.chats);
          setId(response.data.id);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [chatId],
  );

  useEffect(() => {
    socket.on("update chats", (data) => {
      if (id === data.chatId) {
        getChats();
      }
    });
  }, [getChats, id, socket]);

  async function handleSendMessage() {
    if (messageContent.trim() === "") return;
    setMessageContent((message) => message.trim());
    try {
      const response = await axios.post(
        "/api/create-chat",
        { chatId: id, content: messageContent },
        { withCredentials: true },
      );
      setMessageContent("");
      socket.emit("chat added", { chatId: id });
      setChats(response.data.chats);
      messageBoxRef.current?.focus();
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!chatId) return;
    getChats();
  }, [chatId, getChats]);

  useEffect(() => {}, [socket]);

  return (
    <div
      className={`z-0 text-white bg-neutral-800 p-5 duration-300 flex-1 left-18 h-screen pl-30 flex ${
        !chatId ? "items-center justify-center" : ""
      }`}
    >
      {!chatId && (
        <div>
          <p className="text-2xl text-neutral-500">
            Select a Chat to get started!
          </p>
        </div>
      )}
      {chatId && (
        <div className="w-full flex flex-col gap-3">
          <div className="h-fit w-full bg-neutral-900 p-3 rounded-sm flex gap-3 items-center">
            <Image
              src={String(chatImage)}
              alt="avatar"
              height={20}
              width={43}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <p className="font-semibold">{chatName}</p>
              <p className="text-neutral-600 wrap-anywhere leading-4 text-sm">
                {chatEmail}
              </p>
            </div>
          </div>

          <div
            className="w-full h-full p-3 bg-neutral-900 rounded-sm overflow-y-auto flex flex-col gap-5"
            ref={chatContainerRef}
          >
            {chats.length === 0 && (
              <div>
                <p className="text-neutral-500">No Chats to Show</p>
              </div>
            )}

            {chats.map((chatData, index) => (
              <div key={index} className="w-full flex flex-col">
                <div className="w-full">
                  <div
                    className={`${
                      chatData.authorId !== chatId
                        ? "ml-auto"
                        : "flex-row-reverse"
                    } w-fit flex items-end gap-2`}
                  >
                    <p className="text-sm text-neutral-600">{chatData.time}</p>
                    <p
                      className={`${
                        chatData.authorId !== chatId
                          ? "bg-[#144D37]"
                          : "bg-[#3e3f3f]"
                      } px-2 py-1 rounded-sm`}
                    >
                      {chatData.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full h-15 rounded-sm bg-neutral-900 p-1 flex items-center gap-2">
            <input
              type="text"
              className="rounded-sm h-full bg-neutral-900 border-2 border-neutral-800 outline-none w-full px-2"
              placeholder="Type Your message here..."
              value={messageContent}
              ref={messageBoxRef}
              onChange={(e) => {
                setMessageContent(e.currentTarget.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <Button
              variant={"outline"}
              className="text-black rounded-sm h-full cursor-pointer hover:opacity-90 duration-300"
              onClick={handleSendMessage}
            >
              <Send />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
