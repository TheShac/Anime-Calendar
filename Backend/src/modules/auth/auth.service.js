import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByUsername } from "./auth.model.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const loginAdmin = async ({ username, password }) => {
  const user = await findUserByUsername(username);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: "admin" },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: { id: user.id, username: user.username, role: "admin" },
  };
};