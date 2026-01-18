"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Schema } from "mongoose";
import { useState } from "react";

interface ButtonProps {
  buttonType: "pending" | "new";
  userId: Schema.Types.ObjectId;
}

function RequestButton({ buttonType, userId }: ButtonProps) {
  const [buttonText, setButtonText] = useState(buttonType);

  async function handleRequestButton() {
    try {
      await axios.post(
        "/api/friend-request",
        { userId: userId },
        { withCredentials: true }
      );
      setButtonText("pending");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Button
      variant="outline"
      className={`text-black cursor-pointer hover:opacity-90 duration-300 text-md ${
        buttonText === "new"
          ? ""
          : "pointer-events-none border-none bg-neutral-700 text-neutral-500"
      }`}
      onClick={handleRequestButton}
    >
      {buttonText === "new" ? "Send Request" : "Request sent"}
    </Button>
  );
}

export default RequestButton;
