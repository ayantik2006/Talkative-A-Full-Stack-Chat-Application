import { Schema } from "mongoose";
import Image from "next/image";
import AcceptButton from "./AcceptButton";

interface pendingRequestsType{
    _id:Schema.Types.ObjectId;
    name:string;
    joiningDate:string;
    photoURL:string;
}

interface pendingRequestsProps{
    user:pendingRequestsType
}

function PendingRequestCard({user}:pendingRequestsProps) {
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
        <AcceptButton userId={String(user._id)}/>
      </div>
    </div>
  )
}

export default PendingRequestCard