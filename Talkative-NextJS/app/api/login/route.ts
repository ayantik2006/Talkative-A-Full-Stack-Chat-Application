import { NextRequest, NextResponse } from "next/server";
import admin from "@/firebaseAdmin";
import connectDb from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const { idToken } = await req.json();
  const decoded = await admin.auth().verifyIdToken(idToken);
  const name = decoded.name;
  const email = decoded.email;
  const photoURL = decoded.picture;

  const now = new Date();
  const joiningDate = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`;

  connectDb();
  try {
    await User.create({
      name: name,
      email: email,
      photoURL: photoURL,
      joiningDate: joiningDate,
    });
  } catch (err: unknown) {
    console.log(err);
  }

  const jwtToken = jwt.sign({user:email}, String(process.env.JWT_SECRET), {expiresIn:"60d"});
  const res=NextResponse.json({ status: 200 });

  res.cookies.set("user", jwtToken, {
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: "lax", 
    path: "/", 
    maxAge: 60 * 60 * 24 * 60, 
  });

  return res;
}
