import Image from "next/image";
import { Schema } from "mongoose";
import RequestButton from "./RequestButton";

interface userType {
  name: string;
  email: string;
  photoURL: string;
  joiningDate: string;
  _id: Schema.Types.ObjectId;
  pendingRequests: Array<Schema.Types.ObjectId>;
}

interface userPropsType {
  user: userType;
  userId: Schema.Types.ObjectId;
}

function UserCard({ user, userId }: userPropsType) {
  const isPendingRequest = user.pendingRequests?.some((id) => {
    return String(id) === String(userId);
  });
  const buttonType = (): "new" | "pending" => {
    if (isPendingRequest) return "pending";
    else return "new";
  };
  return (
    <div
      className="bg-neutral-800 px-5 py-2 rounded-sm border border-neutral-700 flex items-center flex-wrap gap-5 justify-between"
      key={String(user._id)}
    >
      <div className="flex items-center gap-3">
        <Image
          src={user.photoURL}
          height={10}
          width={35}
          alt="avatar"
          className="rounded-full"
        />
        <p className="text-neutral-300 font-semibold">{user.name}</p>
      </div>
      <div>
        <p className="text-neutral-500 italic">Joined on {user.joiningDate}</p>
      </div>
      <div>
        <RequestButton buttonType={buttonType()} userId={user._id} />
      </div>
    </div>
  );
}

export default UserCard;
