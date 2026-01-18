import Sidebar from "./Sidebar";
import { ChatContextProvider } from "./chatContext";
import ChatWindow from "./ChatWindow";
import { redirect } from "next/navigation";
import getUserEmail from "@/lib/getUserEmail";

async function Chats() {
  try{
    const email = await getUserEmail();
    if(!email) redirect("/");
  }catch(err:unknown){
    redirect("/");
  }

  return (
    <ChatContextProvider>
      <Sidebar />
      <ChatWindow />
    </ChatContextProvider>
  );
}

export default Chats;
