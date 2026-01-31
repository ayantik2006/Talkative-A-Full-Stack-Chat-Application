interface chatDataType {
  authorId: string;
  time: string;
  content: string;
}

interface chatDataTypeProps{
    chatData:chatDataType;
    chatId:string;
}

function ChatText({chatData}:{chatData:chatDataTypeProps}) {
  return (
    <div className="w-full hover:bg-neutral-800 rounded-md p-1">
      <div
        className={`${
          chatData.chatData.authorId !== chatData.chatId ? "ml-auto" : "flex-row-reverse"
        } w-fit flex items-end gap-2`}
      >
        <p className="text-sm text-neutral-600">{chatData.chatData.time}</p>
        <p
          className={`${
            chatData.chatData.authorId !== chatData.chatId
              ? "bg-[#144D37]"
              : "bg-[#3e3f3f]"
          } px-2 py-1 rounded-sm`}
        >
          {chatData.chatData.content}
        </p>
      </div>
    </div>
  );
}

export default ChatText;
