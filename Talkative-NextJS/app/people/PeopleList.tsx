"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import UserCard from "./UserCard";
import { Schema } from "mongoose";

interface userType {
  name: string;
  email: string;
  photoURL: string;
  joiningDate: string;
  _id: Schema.Types.ObjectId;
  pendingRequests:Array<Schema.Types.ObjectId>;
}

interface userDataType{
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  photoURL: string;
  joiningDate: string;
  friends: Array<Schema.Types.ObjectId>;
}

function PeopleList() {
  const [users, setUsers] = useState<Array<userType>>([]);
  const [userData, setUserData] = useState<userDataType>(Object);

  const getAllUsers = useCallback(() => {
    axios
      .post("/api/get-people", {}, { withCredentials: true })
      .then((response) => {
        setUsers(response.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getUserData = useCallback(() => {
    axios
      .post("/api/user-data", {}, { withCredentials: true })
      .then((response) => {
        setUserData(response.data.userData);
      })
      .catch((err: unknown) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    getAllUsers();
    getUserData();
  }, [getAllUsers, getUserData]);


  return (
    <div className="bg-neutral-900 w-full p-4 rounded-sm flex flex-col">
      {users.length == 0 && (
        <div>
          <p className="text-neutral-500">No users here</p>
        </div>
      )}
      {users.map((user) => (
        <UserCard user={user} userId={userData._id} key={String(user._id)} />
      ))}
    </div>
  );
}

export default PeopleList;
