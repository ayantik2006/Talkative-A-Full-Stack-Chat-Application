import getUserEmail from "@/lib/getUserEmail";
import Chat from "@/models/Chat";
import User from "@/models/User";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId }: { userId: string } = await req.json();
  const email = await getUserEmail();
  let userData = await User.findOne({ email: email });
  const onwerId=userData?._id;

  const chatUsers:Array<string>=[String(onwerId),userId];
  const x=await Chat.create({users:chatUsers});

  let oldPendingRequests = userData?.pendingRequests;
  let newPendingRequests: Types.ObjectId[] = [];
  oldPendingRequests?.map((id) => {
    if (String(id) !== userId) {
      newPendingRequests.push(id);
    }
  });
  await User.updateOne(
    { email: email },
    { pendingRequests: newPendingRequests }
  );

  await User.updateOne(
    { email: email },
    { $addToSet: { friends: new Types.ObjectId(userId) } }
  );
  await User.updateOne(
    { _id: userId }, 
    { $addToSet: { friends: userData?._id } }
  );
  
  userData=await User.findOne({_id:userId});
  oldPendingRequests = userData?.pendingRequests;
  newPendingRequests = [];
  oldPendingRequests?.map((id) => {
    if (String(id) !== String(onwerId)) {
      newPendingRequests.push(id);
    }
  });
  await User.updateOne(
    { _id: userId },
    { pendingRequests: newPendingRequests }
  );
  
  return NextResponse.json({ status: 200, message: "friend request accepted" });
}
