import mongoose, { Model } from "mongoose";
import { Document, model, models, Schema } from "mongoose";

interface UserSchemaType extends Document {
  name: string;
  email: string;
  photoURL: string;
  friends: Array<mongoose.Types.ObjectId>;
  pendingRequests: Array<mongoose.Types.ObjectId>;
  joiningDate: string;
}

const UserSchema = new Schema<UserSchemaType>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  photoURL: {
    type: String,
    required: true,
  },
  joiningDate: {
    type: String,
    required: true,
  },
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  pendingRequests: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const User =
  (models.User as Model<UserSchemaType>) ||
  model<UserSchemaType>("User", UserSchema);
export default User;
