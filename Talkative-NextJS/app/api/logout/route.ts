import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
  const cookieStore = await cookies();
  cookieStore.delete("user"); 

  return NextResponse.json({ status: 200, message:"logout successful" });
}
