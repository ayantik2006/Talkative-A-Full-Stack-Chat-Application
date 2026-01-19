import getUserEmail from "@/lib/getUserEmail";
import Chat from "@/models/Chat";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { chatId, content } = await req.json();

  const now = new Date();
  const date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const period = hours >= 12 ? "pm" : "am";

  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;

  const time = `${hours}:${minutes}${period}`;

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
