import connectDb from "@/lib/db";
import getUserEmail from "@/lib/getUserEmail";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    connectDb();
    const email=await getUserEmail();
    const userData=await User.findOne({email:email}).populate("pendingRequests","_id name joiningDate photoURL");
    const pendingRequests=userData?.pendingRequests.reverse();
    return NextResponse.json({pendingRequests:pendingRequests});
}