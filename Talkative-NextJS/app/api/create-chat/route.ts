import getUserEmail from "@/lib/getUserEmail";
import Chat from "@/models/Chat";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { chatId, content, time, date } = await req.json();

  const email = await getUserEmail();
  const userData = await User.findOne({ email: email });
  const chatObjectData = {
    content: content,
    time: `${time} ${date}`,
    authorName: userData?.name,
    authorId: userData?._id,
  };
  await Chat.updateOne({ _id: chatId }, { $push: { chats: chatObjectData } });
  const chatData = await Chat.findOne({ _id: chatId });
  const chats = chatData?.chats;
  return NextResponse.json({ chats: chats });
}
