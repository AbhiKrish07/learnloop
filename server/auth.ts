import crypto from "crypto";
import { db } from "./db/db.js";
import { User } from "./db/schema.js";

// Utility for hashing passwords securely
export function hashPassword(password: string): string {
  const salt = "learnloop_salt_2026";
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

export function generateToken(user: User): string {
  const payload = `${user.id}:${user.email}:${Date.now()}`;
  return Buffer.from(payload).toString("base64");
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [userId] = decoded.split(":");
    if (!userId) return null;
    return db.getUserById(userId) || null;
  } catch {
    return null;
  }
}
