import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import connectDb from "./db";
import User from "@/models/User";

async function getUserEmail(): Promise<string | null> {
  const jwtToken = (await cookies()).get("user")?.value;
  if(!jwtToken) return null
  const { user } = jwt.verify(
    String(jwtToken),
    String(process.env.JWT_SECRET)
  ) as JwtPayload;
  connectDb();
  const userData = await User.findOne({ email: user });
  if (userData?.email) return user;
  else return null;
}

export default getUserEmail;
