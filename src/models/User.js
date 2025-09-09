import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "../app/api/utils/db.js";

const UserSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Email: { type: String, unique: true, required: true },
  Password: { type: String, required: true },
  Role: {
    type: String,
    enum: ["admin","faculty"],
    default: "faculty"
  },
  ProfileImage: { type: String, default: "" },
  Assets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Asset" }],
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

/**
 * Create a new user account
 */
export async function createAccount({ name, email, password, role }) {
  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) throw new Error("User already exists");

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    Name: name,
    Email: email,
    Password: passwordHash,
    Role: role
  });

  const userObj = user.toObject();
  delete userObj.passwordHash;

  return userObj;
}

/**
 * Login user
 */
export async function loginUser({ email, password}) {
  await connectDB();

  const user = await User.findOne({ Email: email });
  if (!user) throw new Error("No User exists");
  
  const isValid = await bcrypt.compare(password, user.Password);
  if (!isValid) throw new Error("Invalid email or password");

  const userObj = user.toObject();
  delete userObj.Password;

  return userObj;
}

export default User;
