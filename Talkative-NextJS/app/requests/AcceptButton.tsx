import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";

function AcceptButton({ userId }: { userId: string }) {
  const [isAccepted, setIsAccepted] = useState(false);

  async function handleAcceptFriendRequest(e: React.MouseEvent<HTMLButtonElement>) {
    setIsAccepted(true);
    try{
        await axios.post("/api/accept-request",{userId:userId},{withCredentials:true});
    }catch(err:unknown){
        console.log(err);
    }
  }

  return (
    <Button
      variant="outline"
      className={`text-black cursor-pointer duration-300 hover:opacity-90 ${
        isAccepted
          ? "pointer-events-none border-none bg-neutral-700 text-neutral-500"
          : ""
      }`}
      onClick={handleAcceptFriendRequest}
    >
      {isAccepted ? "Accepted" : "Accept"}
    </Button>
  );
}

export default AcceptButton;
