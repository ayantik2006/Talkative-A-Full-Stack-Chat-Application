import { Schema, models, model, Model, Document } from "mongoose";

interface ChatSchemaType extends Document {
  users: Array<string>;
  chats: Array<object>;
}

const ChatSchema = new Schema<ChatSchemaType>({
  users: [
    {
      type: String,
    },
  ],
  chats: [
    {
      type:Object,
      default:[Object]
    }
  ]
});

const Chat =
  (models.Chat as Model<ChatSchemaType>) ||
  model<ChatSchemaType>("Chat", ChatSchema);
export default Chat;
