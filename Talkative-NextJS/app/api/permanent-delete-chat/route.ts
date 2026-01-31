import connectDb from "@/lib/db";
import Chat from "@/models/Chat";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { index, chatId }: { index: number; chatId: string } = await req.json();
  connectDb();
  const chatData = await Chat.findOne({ _id: chatId });
  let chats: object[] = Object(chatData?.chats);
  chats=[...chats.slice(0,index),...chats.slice(index+1,chats.length)];
  await Chat.updateOne({ _id: chatId }, { chats: chats });

  return NextResponse.json({ chats: chats });
}
