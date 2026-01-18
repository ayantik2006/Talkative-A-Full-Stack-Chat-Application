"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/firebase/auth";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function GoogleLoginButton() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router=useRouter();

  async function handleGoogleLogin() {
    setIsLoggingIn(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();
      await axios.post("/api/login",{idToken:idToken},{withCredentials:true});
      router.push("/chats");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/popup-closed-by-user") {
          setIsLoggingIn(false);
        }
      }
      console.log(err);
    }
  }

  return (
    <Button
      variant={"outline"}
      className={`bg-white text-black font-semibold mt-4 flex items-center text-md hover:opacity-90 duration-300 cursor-pointer ${isLoggingIn?"pointer-events-none bg-neutral-300":""}`}
      onClick={handleGoogleLogin}
    >
      <Image
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg"
        alt="google-logo"
        width={18}
        height={18}
      />
      {isLoggingIn && <p>Logging you in...</p>}
      {!isLoggingIn && <p>Continue with Google</p>}
    </Button>
  );
}

export default GoogleLoginButton;
