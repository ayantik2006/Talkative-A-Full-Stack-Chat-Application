"use client";
import { createContext, useContext, useState } from "react";

interface ChatContextType {
  chatId: string | null;
  setChatId: (id: string | null) => void;
  isSidePanelOpen: boolean | null;
  setIsSidePanelOpen: (isOpen: boolean | null) => void;
  chatName: string | null;
  setChatName: (name: string | null) => void;
  chatEmail: string | null;
  setChatEmail: (email: string | null) => void;
  chatImage: string | null;
  setChatImage: (img: string | null) => void;
}

const ChatContext = createContext<ChatContextType>({
  chatId: null,
  setChatId: () => {},
  isSidePanelOpen: null,
  setIsSidePanelOpen: () => {},
  chatName: null,
  setChatName: () => {},
  chatEmail: null,
  setChatEmail: () => {},
  chatImage: null,
  setChatImage: () => {},
});

export const ChatContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [chatId, setChatId] = useState<string | null>("");
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean | null>(false);
  const [chatName, setChatName] = useState<string | null>("");
  const [chatEmail, setChatEmail] = useState<string | null>("");
  const [chatImage, setChatImage] = useState<string | null>("");

  return (
    <ChatContext.Provider
      value={{
        chatId,
        setChatId,
        isSidePanelOpen,
        setIsSidePanelOpen,
        chatName,
        setChatName,
        chatEmail,
        setChatEmail,
        chatImage,
        setChatImage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatId = () => {
  const context = useContext(ChatContext);
  return context;
};
