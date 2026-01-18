import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import User from "@/models/User";
import getUserEmail from "@/lib/getUserEmail";

export async function POST(req: NextRequest) {
  connectDb();
  const email = await getUserEmail();
  const userData = await User.findOne({ email: email });
  const users = await User.find(
    {
      email: { $ne: email },
      _id: { $nin: userData?.friends },
    },
    {
      name: 1,
      email: 1,
      photoURL: 1,
      joiningDate: 1,
      _id: 1,
      pendingRequests:1
    }
  ) || [];

  return NextResponse.json({ users: [...users].reverse() });
}
