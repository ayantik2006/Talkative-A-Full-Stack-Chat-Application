import getUserEmail from "@/lib/getUserEmail";
import User from "@/models/User";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const {userId}=await req.json();
    const email=await getUserEmail();
    const userData=await User.findOne({email:email});
    const pendingRequests=[...(userData?.friends || [])];
    pendingRequests.push(new mongoose.Types.ObjectId(userData?._id));
    await User.updateOne({_id:userId},{pendingRequests:pendingRequests});
    return NextResponse.json({status:200,msessage:"friend request sent"})
}