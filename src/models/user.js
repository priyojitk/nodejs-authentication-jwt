import { Schema, model } from "mongoose";

const UserSchema = Schema(
  {
    email:  { type: String, required: true, unique: true  },
    user:  { type: String, required: true },
    password: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

export default model("User", UserSchema);
