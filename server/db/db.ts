import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { User, WaitlistEntry, CaptureItem, MemoryNode } from "./schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "..", "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonFile<T>(filename: string, defaultValue: T): T {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), "utf-8");
    return defaultValue;
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function writeJsonFile<T>(filename: string, data: T): void {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// Initial mock data if empty
const MOCK_CAPTURES: CaptureItem[] = [
  {
    id: "cap-1",
    userId: "demo-user",
    title: "Transformer Architecture & Attention Mechanisms",
    content: "Self-attention matrix computation Q*K^T / sqrt(d_k) allows parallel computation across tokens compared to RNNs.",
    category: "concept",
    tags: ["AI", "Deep Learning", "Transformers"],
    createdAt: new Date().toISOString(),
    masteryScore: 78,
    nextReviewAt: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: "cap-2",
    userId: "demo-user",
    title: "Rust Ownership & Lifetime Annotations",
    content: "Lifetimes tell the borrow checker how references relate to each other so dangling pointers are caught at compile time.",
    category: "code",
    tags: ["Rust", "Systems Programming"],
    createdAt: new Date().toISOString(),
    masteryScore: 62,
    nextReviewAt: new Date(Date.now() + 172800000).toISOString(),
  },
  {
    id: "cap-3",
    userId: "demo-user",
    title: "Spaced Repetition & Ebbinghaus Forgetting Curve",
    content: "Reviews timed right before exponential memory decay lock items into long-term storage with minimal total repetition.",
    category: "article",
    tags: ["Learning Science", "Memory"],
    createdAt: new Date().toISOString(),
    masteryScore: 90,
    nextReviewAt: new Date(Date.now() + 432000000).toISOString(),
  }
];

export const db = {
  // Waitlist Operations
  getWaitlist: (): WaitlistEntry[] => readJsonFile("waitlist.json", []),
  addWaitlistEntry: (entry: WaitlistEntry): void => {
    const list = db.getWaitlist();
    if (!list.some(item => item.email.toLowerCase() === entry.email.toLowerCase())) {
      list.push(entry);
      writeJsonFile("waitlist.json", list);
    }
  },

  // User Operations
  getUsers: (): User[] => readJsonFile("users.json", []),
  getUserByEmail: (email: string): User | undefined => {
    return db.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  getUserById: (id: string): User | undefined => {
    return db.getUsers().find(u => u.id === id);
  },
  addUser: (user: User): void => {
    const users = db.getUsers();
    users.push(user);
    writeJsonFile("users.json", users);
  },

  // Capture Item Operations
  getCaptures: (userId?: string): CaptureItem[] => {
    const captures = readJsonFile("captures.json", MOCK_CAPTURES);
    if (!userId) return captures;
    return captures.filter(c => !c.userId || c.userId === userId);
  },
  addCapture: (item: CaptureItem): void => {
    const captures = readJsonFile("captures.json", MOCK_CAPTURES);
    captures.unshift(item);
    writeJsonFile("captures.json", captures);
  },
  updateCaptureMastery: (id: string, score: number): CaptureItem | undefined => {
    const captures = readJsonFile("captures.json", MOCK_CAPTURES);
    const item = captures.find(c => c.id === id);
    if (item) {
      item.masteryScore = score;
      item.nextReviewAt = new Date(Date.now() + Math.max(1, score / 10) * 86400000).toISOString();
      writeJsonFile("captures.json", captures);
    }
    return item;
  }
};
