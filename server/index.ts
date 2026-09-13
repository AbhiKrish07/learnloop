import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "./db/db.js";
import { sendWaitlistConfirmation } from "./email.js";
import { hashPassword, generateToken, verifyToken } from "./auth.js";
import { nanoid } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.json());
  app.use(express.static(staticPath));

  // Waitlist API endpoint
  app.post("/api/waitlist", async (req, res) => {
    try {
      const { email } = req.body || {};
      if (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ success: false, error: "Please enter a valid email address." });
      }

      const timestamp = new Date().toISOString();
      db.addWaitlistEntry({ id: nanoid(), email, timestamp, status: "pending" });

      // Trigger background confirmation email
      sendWaitlistConfirmation(email).catch(console.error);

      const totalCount = db.getWaitlist().length;
      return res.json({
        success: true,
        message: "Added to waitlist successfully.",
        totalCount: totalCount + 1420 // baseline offset
      });
    } catch (err) {
      console.error("[Waitlist API Error]", err);
      return res.status(500).json({ success: false, error: "Server error. Please try again later." });
    }
  });

  // Waitlist stats API
  app.get("/api/waitlist/stats", (_req, res) => {
    const list = db.getWaitlist();
    return res.json({
      success: true,
      totalWaitlist: list.length + 1420,
    });
  });

  // Auth: Signup
  app.post("/api/auth/signup", (req, res) => {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: "Name, email and password are required." });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, error: "Email already registered." });
    }

    const newUser = {
      id: `usr_${nanoid(8)}`,
      name,
      email,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    };

    db.addUser(newUser);
    const token = generateToken(newUser);

    return res.json({
      success: true,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, avatarUrl: newUser.avatarUrl },
      token
    });
  });

  // Auth: Login
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required." });
    }

    const user = db.getUserByEmail(email);
    if (!user || user.passwordHash !== hashPassword(password)) {
      return res.status(400).json({ success: false, error: "Invalid email or password." });
    }

    const token = generateToken(user);
    return res.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
      token
    });
  });

  // Captures API: Get user captures
  app.get("/api/captures", (req, res) => {
    const authHeader = req.headers.authorization;
    let userId: string | undefined = undefined;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const user = verifyToken(authHeader.substring(7));
      if (user) userId = user.id;
    }
    const captures = db.getCaptures(userId);
    return res.json({ success: true, captures });
  });

  // Captures API: Add new capture
  app.post("/api/captures/add", (req, res) => {
    const { title, content, category, tags } = req.body || {};
    if (!title || !content) {
      return res.status(400).json({ success: false, error: "Title and content are required." });
    }

    const newCapture = {
      id: `cap_${nanoid(8)}`,
      title,
      content,
      category: category || "concept",
      tags: tags || ["General"],
      createdAt: new Date().toISOString(),
      masteryScore: 50,
      nextReviewAt: new Date(Date.now() + 86400000).toISOString()
    };

    db.addCapture(newCapture);
    return res.json({ success: true, capture: newCapture });
  });

  // Captures API: Update Review Mastery
  app.post("/api/captures/review", (req, res) => {
    const { id, delta } = req.body || {};
    if (!id || typeof delta !== "number") {
      return res.status(400).json({ success: false, error: "Item ID and numeric delta required." });
    }
    const captures = db.getCaptures();
    const existing = captures.find(c => c.id === id);
    if (!existing) {
      return res.status(404).json({ success: false, error: "Capture not found." });
    }
    const newScore = Math.min(100, Math.max(0, existing.masteryScore + delta));
    const updated = db.updateCaptureMastery(id, newScore);
    return res.json({ success: true, capture: updated });
  });

  // Handle client-side routing - serve index.html for all non-API routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
