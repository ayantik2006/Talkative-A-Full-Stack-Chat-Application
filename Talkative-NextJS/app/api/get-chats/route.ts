import getUserEmail from "@/lib/getUserEmail";
import Chat from "@/models/Chat";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId }: { userId: string } = await req.json();
  const email = await getUserEmail();
  const userData = await User.findOne({ email: email });
  const userId2 = String(userData?._id);
  const chatData = await Chat.findOne({
    users: { $all: [userId, userId2] },
  });
  return NextResponse.json({ chats: chatData?.chats, id:chatData?._id });
}
