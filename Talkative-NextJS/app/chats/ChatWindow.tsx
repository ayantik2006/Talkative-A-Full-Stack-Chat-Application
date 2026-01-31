"use client";

import Image from "next/image";
import { useChatId } from "./chatContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Ban, RotateCcw, Send, SquarePen, Trash2, Video } from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";
import { Schema } from "mongoose";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import ChatText from "./chatText";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ChatDataType {
  authorName: string;
  time: string;
  content: string;
  authorId: string;
  isDeleted?: boolean;
}

function ChatWindow() {
  const { chatId, chatName, chatEmail, chatImage } = useChatId();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const messageBoxRef = useRef<HTMLInputElement | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [chats, setChats] = useState<Array<ChatDataType>>([]);
  const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL);
  const [id, setId] = useState<Schema.Types.ObjectId | null>(null);
  const [messageRightClickIndex, setMessageRightClickIndex] = useState(0);
  const [editedChat, setEditedChat] = useState("");

  const openVideoWindow = () => {
    window.open(
      "/video-call?id=" + id,
      "VideoCall",
      "width=420,height=720,resizable=yes",
    );
  };

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

    const now = new Date();
    const date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const period = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    const time = `${hours}:${minutes}${period}`;

    try {
      const response = await axios.post(
        "/api/create-chat",
        { chatId: id, content: messageContent, time: time, date: date },
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

  async function handleMessageDelete() {
    axios
      .post(
        "/api/delete-chat",
        { index: messageRightClickIndex, chatId: id },
        { withCredentials: true },
      )
      .then((response) => {
        socket.emit("chat updated", { chatId: id });
        setChats(response.data.chats);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function handlePermanentMessageDelete() {
    axios
      .post(
        "/api/permanent-delete-chat",
        { index: messageRightClickIndex, chatId: id },
        { withCredentials: true },
      )
      .then((response) => {
        socket.emit("chat updated", { chatId: id });
        // setChats(response.data.chats);
        getChats();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function restoreMessage() {
    axios
      .post(
        "/api/restore-chat",
        { index: messageRightClickIndex, chatId: id },
        { withCredentials: true },
      )
      .then((response) => {
        socket.emit("chat updated", { chatId: id });
        setChats(response.data.chats);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function handleEditMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    axios
      .post(
        "/api/edit-chat",
        { index: messageRightClickIndex, editedChat: editedChat, chatId: id },
        { withCredentials: true },
      )
      .then((response) => {
        socket.emit("chat updated", { chatId: id });
        setChats(response.data.chats);
      })
      .catch((err) => {
        console.log(err);
      });
  }

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
          <div className="h-fit w-full bg-neutral-900 p-3 rounded-sm flex gap-3 items-center justify-between">
            <div className="flex gap-3">
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
            {/* <div
              className="hover:bg-neutral-700 rounded-full p-2 cursor-pointer duration-300"
              onClick={() => openVideoWindow()}
            >
              <Video />
            </div> */}
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

            {chats.map((chatData, index) => {
              if (chatData.isDeleted)
                return (
                  <div key={index}>
                    <ContextMenu
                      onOpenChange={(e) => {
                        if (e) setMessageRightClickIndex(index);
                      }}
                    >
                      <ContextMenuTrigger>
                        <div className="w-full hover:bg-neutral-800 rounded-md p-1">
                          <div
                            className={`${
                              chatData.authorId !== chatId
                                ? "ml-auto"
                                : "flex-row-reverse"
                            } w-fit flex items-end gap-2`}
                          >
                            <p
                              className={`${
                                chatData.authorId !== chatId
                                  ? "bg-[#144D37]"
                                  : "bg-[#3e3f3f]"
                              } px-2 py-1 rounded-sm italic text-[#9FA8A8] flex items-center gap-1`}
                            >
                              <Ban size={18} />
                              This message was deleted
                            </p>
                          </div>
                        </div>
                      </ContextMenuTrigger>
                      <ContextMenuContent className="bg-neutral-800 border border-neutral-700 text-white">
                        <div
                          className="flex gap-2 text-neutral-400 pl-2 items-center cursor-pointer py-1 hover:bg-neutral-900 rounded-sm"
                          onClick={restoreMessage}
                        >
                          <RotateCcw size={15} />
                          <p className="text-[0.85rem]">Restore</p>
                        </div>
                        <Dialog>
                          <DialogTrigger className="w-full">
                            <div className="flex gap-2 text-neutral-400 px-2 py-1 items-center cursor-pointer hover:bg-neutral-900 rounded-sm">
                              <Trash2 size={15} className="stroke-red-700" />
                              <p className="text-[0.85rem] text-red-700">
                                Delete
                              </p>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="bg-neutral-900 text-white border border-neutral-700">
                            <DialogHeader>
                              <DialogTitle>Permanently Delete Chat</DialogTitle>
                              <DialogDescription>
                                This action cannot be undone
                              </DialogDescription>
                            </DialogHeader>
                            <DialogClose asChild>
                              <Button
                                variant={"outline"}
                                className="text-black cursor-pointer hover:opacity-90 duration-300"
                                onClick={handlePermanentMessageDelete}
                              >
                                Delete
                              </Button>
                            </DialogClose>
                          </DialogContent>
                        </Dialog>
                      </ContextMenuContent>
                    </ContextMenu>
                  </div>
                );
              else
                return (
                  <div key={index} className="w-full flex flex-col">
                    {chatData.authorId !== chatId && (
                      <ContextMenu
                        onOpenChange={(e) => {
                          if (e) setMessageRightClickIndex(index);
                        }}
                      >
                        <ContextMenuTrigger>
                          <ChatText
                            chatData={{ chatData: chatData, chatId: chatId }}
                          />
                        </ContextMenuTrigger>
                        <ContextMenuContent className="bg-neutral-800 border border-neutral-700 text-white">
                          <Dialog>
                            <DialogTrigger className="w-full">
                              <div className="flex gap-2 text-neutral-400 px-2 py-1 items-center cursor-pointer hover:bg-neutral-900 rounded-sm">
                                <Trash2 size={15} className="stroke-red-700" />
                                <p className="text-[0.85rem] text-red-700">
                                  Delete
                                </p>
                              </div>
                            </DialogTrigger>
                            <DialogContent className="bg-neutral-900 text-white border border-neutral-700">
                              <DialogHeader>
                                <DialogTitle>Delete Chat</DialogTitle>
                                <DialogDescription>
                                  You can undo this action whenever you like
                                </DialogDescription>
                              </DialogHeader>
                              <DialogClose asChild>
                                <Button
                                  variant={"outline"}
                                  className="text-black cursor-pointer hover:opacity-90 duration-300"
                                  onClick={handleMessageDelete}
                                >
                                  Delete
                                </Button>
                              </DialogClose>
                            </DialogContent>
                          </Dialog>
                          <Dialog>
                            <DialogTrigger className="w-full">
                              <div className="flex gap-2 text-neutral-400 pl-2 items-center cursor-pointer py-1 hover:bg-neutral-900 rounded-sm w-full">
                                <SquarePen size={15} />
                                <p className="text-[0.85rem]">Edit</p>
                              </div>
                            </DialogTrigger>
                            <DialogContent className="bg-neutral-900 text-white border border-neutral-700">
                              <DialogHeader>
                                <DialogTitle>Edit Chat</DialogTitle>
                                {/* <DialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete your account and remove
                                  your data from our servers.
                                </DialogDescription> */}
                              </DialogHeader>
                              <form
                                onSubmit={handleEditMessage}
                                className="flex gap-2"
                              >
                                <Input
                                  placeholder="Edit the chat"
                                  autoFocus
                                  defaultValue={
                                    chats[messageRightClickIndex].content
                                  }
                                  className="selection:bg-blue-700"
                                  onInput={(e) =>
                                    setEditedChat(e.currentTarget.value)
                                  }
                                />
                                <DialogClose asChild>
                                  <Button
                                    variant={"outline"}
                                    className="text-black hover:opacity-90 cursor-pointer"
                                    type="submit"
                                  >
                                    Save
                                  </Button>
                                </DialogClose>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </ContextMenuContent>
                      </ContextMenu>
                    )}
                    {chatData.authorId === chatId && (
                      <div className="w-full">
                        <ChatText
                          chatData={{ chatData: chatData, chatId: chatId }}
                        />
                      </div>
                    )}
                  </div>
                );
            })}
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
