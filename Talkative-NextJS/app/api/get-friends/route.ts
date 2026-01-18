import getUserEmail from "@/lib/getUserEmail";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const email=await getUserEmail();
    const userData=await User.findOne({email:email}).populate("friends","_id name email photoURL");
    const friends=userData?.friends;
    return NextResponse.json({status:200,friends:friends});
}