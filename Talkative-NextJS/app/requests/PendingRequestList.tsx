"use client";
import axios from "axios";
import { Schema } from "mongoose";
import { useCallback, useEffect, useState } from "react";
import PendingRequestCard from "./PendingRequestCard";

interface pendingRequestsType {
  _id: Schema.Types.ObjectId;
  name: string;
  joiningDate: string;
  photoURL: string;
}

function PendingRequestList() {
  const [pendingRequests, setPendingRequests] = useState<
    Array<pendingRequestsType>
  >([]);

  const getPendingRequestsInfo = useCallback(() => {
    axios
      .post("/api/pending-requests", {}, { withCredentials: true })
      .then((response) => {
        setPendingRequests(response.data.pendingRequests);
      })
      .catch((err: unknown) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    getPendingRequestsInfo();
  }, [getPendingRequestsInfo]);

  return (
    <div className="bg-neutral-900 w-full p-4 rounded-sm flex flex-col">
      {pendingRequests.length === 0 && (
        <div>
          <p className="text-neutral-500">No pending requests from anyone</p>
        </div>
      )}
      {pendingRequests.map((user) => (
        <PendingRequestCard user={user} key={String(user._id)} />
      ))}
    </div>
  );
}

export default PendingRequestList;
