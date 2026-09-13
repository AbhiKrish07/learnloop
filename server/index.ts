import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

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

      const fs = await import("fs");
      const dataDir = path.resolve(__dirname, "..", "server", "data");
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      const filePath = path.join(dataDir, "waitlist.json");
      let list: Array<{ email: string; timestamp: string }> = [];
      if (fs.existsSync(filePath)) {
        try {
          list = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        } catch {
          list = [];
        }
      }

      if (!list.some((item) => item.email.toLowerCase() === email.toLowerCase())) {
        list.push({ email, timestamp: new Date().toISOString() });
        fs.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf-8");
      }

      console.log(`[Waitlist] New signup saved: ${email}`);
      return res.json({ success: true, message: "Added to waitlist successfully." });
    } catch (err) {
      console.error("[Waitlist API Error]", err);
      return res.status(500).json({ success: false, error: "Server error. Please try again later." });
    }
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });


  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
