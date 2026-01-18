"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

function BackArrow() {
  const router = useRouter();
  return (
    <div
      className="bg-neutral-900 rounded-full w-9 h-9 flex items-center justify-center cursor-pointer hover:bg-neutral-950"
      title="Go back"
      onClick={() => router.push("/chats")}
    >
      <ArrowLeft className="stroke-neutral-400" />
    </div>
  );
}

export default BackArrow;
