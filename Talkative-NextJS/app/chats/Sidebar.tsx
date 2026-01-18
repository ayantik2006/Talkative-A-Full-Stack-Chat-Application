"use client";

import { CircleDot, PanelsTopLeft, UsersRound } from "lucide-react";
import { useChatId } from "./chatContext";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import FriendCard from "./FriendCard";
import { Schema } from "mongoose";

interface FriendDetailsType {
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  photoURL: string;
}

function Sidebar() {
  const { isSidePanelOpen, setIsSidePanelOpen } =
    useChatId();
  const [friends, setFriends] = useState<FriendDetailsType[]>([]);

  const getFriends = useCallback(() => {
    axios
      .post("/api/get-friends", {}, { withCredentials: true })
      .then((response) => {
        setFriends(response.data.friends);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    getFriends();
  }, [getFriends]);

  return (
    <div
      className={`w-[20rem] h-screen z-80 bg-neutral-900 duration-300 flex flex-col items-center p-5 border-r-2 border-neutral-700 text-white absolute left-0 top-0 ${
        !isSidePanelOpen ? "-translate-x-62" : ""
      }`}
    >
      <div className="flex items-center justify-between w-full">
        <p className="text-xl font-semibold">Talkative</p>
        <PanelsTopLeft
          className="stroke-neutral-300 hover:bg-neutral-700 p-1 rounded-sm cursor-pointer"
          size={30}
          onClick={() => {
            setIsSidePanelOpen((prev: boolean) => !prev);
          }}
        />
      </div>
      <div className="mt-10 h-full w-full">
        {friends.length == 0 && (
          <div className="text-sm text-neutral-600">
            <p>No friends yet!</p>
          </div>
        )}

        {friends.map((friend) => (
          <FriendCard friendDetails={friend} key={String(friend._id)} />
        ))}
      </div>
      <div className="h-30 flex flex-col gap-2 mt-4 w-full justify-center text-sm">
        <Link
          href="/requests"
          className="flex items-center gap-2 text-neutral-400 hover:bg-neutral-800 p-3 rounded-sm duration-300 cursor-pointer bg-neutral-950"
        >
          <CircleDot size={16} />
          <p className="font-normal">Pending Requests</p>
        </Link>
        <Link
          href="/people"
          className="flex items-center gap-2 text-neutral-400 hover:bg-neutral-800 p-3 rounded-sm duration-300 cursor-pointer bg-neutral-950"
        >
          <UsersRound size={16} />
          <p className="font-normal">Explore People</p>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
