import { Document, model, Schema } from "mongoose";

/**
 * Type to model the User Schema for TypeScript.
 * @param googleId:string
 * @param firstName:string
 * @param lastName:string
 * @param email:string
 */
export type AuthProvider = "local" | "google";

export type TUser = {
  googleId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  authProvider: AuthProvider;
};

/**
 * Mongoose Document based on TUser for TypeScript.
 * https://mongoosejs.com/docs/documents.html
 *
 * TUser
 * @param googleId:string
 * @param firstName:string
 * @param lastName:string
 * @param email:string
 */

export interface IUser extends TUser, Document {}

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    googleId: {
      type: String,
      required: true,
    },
    firstName: {
      required: true,
      type: String,
    },
    lastName: {
      required: true,
      type: String,
    },
    password: {
      required: false,
      type: String,
    },
    authProvider: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Mongoose Model based on TUser for TypeScript.
 * https://mongoosejs.com/docs/models.html
 *
 * TUser
 * @param id:string
 * @param firstName:string
 * @param lastName:string
 * @param email:string
 */

const User = model<IUser>("User", userSchema);

export default User;
