import { Schema } from "mongoose";
import Image from "next/image";
import { useChatId } from "./chatContext";

interface FriendDetailsType {
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  photoURL: string;
}

interface FriendCardProps {
  friendDetails: FriendDetailsType;
}

function FriendCard({ friendDetails }: FriendCardProps) {
  const { setChatId, setIsSidePanelOpen, setChatName, setChatEmail, setChatImage } =
    useChatId();

  async function handleChatClick(){
    setChatId(String(friendDetails._id))
    setIsSidePanelOpen(false);
    setChatName(friendDetails.name);
    setChatEmail(friendDetails.email);
    setChatImage(friendDetails.photoURL);
  } 

  return (
    <div className="hover:bg-neutral-800 cursor-pointer p-2 px-3 rounded-sm flex gap-3 w-full items-center self-start h-fit" onClick={handleChatClick}>
      <Image
        src={friendDetails.photoURL}
        alt="avatar"
        height={20}
        width={43}
        className="rounded-full"
      />
      <div className="flex flex-col">
        <p className="font-semibold">{friendDetails.name}</p>
        <p className="text-neutral-600 wrap-anywhere leading-4 text-sm">
          {friendDetails.email}
        </p>
      </div>
    </div>
  );
}

export default FriendCard;
