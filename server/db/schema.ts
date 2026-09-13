import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  passwordHash: z.string(),
  createdAt: z.string(),
  avatarUrl: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const WaitlistSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  timestamp: z.string(),
  status: z.enum(["pending", "invited", "active"]).default("pending"),
  referredBy: z.string().optional(),
});

export type WaitlistEntry = z.infer<typeof WaitlistSchema>;

export const CaptureItemSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  title: z.string(),
  content: z.string(),
  category: z.enum(["concept", "code", "article", "idea", "paper"]).default("concept"),
  tags: z.array(z.string()).default([]),
  createdAt: z.string(),
  masteryScore: z.number().min(0).max(100).default(50),
  nextReviewAt: z.string().optional(),
});

export type CaptureItem = z.infer<typeof CaptureItemSchema>;

export const MemoryNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.string(),
  connections: z.array(z.string()), // IDs of connected nodes
  strength: z.number().min(0).max(1),
});

export type MemoryNode = z.infer<typeof MemoryNodeSchema>;
