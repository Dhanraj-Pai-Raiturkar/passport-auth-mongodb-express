// repo/userRepo.ts
import User, { TUser } from "../models/User";

export const createUser = async (userData: TUser) => {
  console.log("userData", userData);
  return await User.create(userData);
};

export const getUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

export const getUserById = async (id: string) => {
  return await User.findById(id);
};

export const updateUserByEmail = async (
  email: string,
  updateData: Partial<TUser>
) => {
  return await User.findOneAndUpdate({ email }, updateData, { new: true });
};

export const deleteUserByEmail = async (email: string) => {
  return await User.findOneAndDelete({ email });
};

export const getAllUsers = async () => {
  return await User.find();
};
