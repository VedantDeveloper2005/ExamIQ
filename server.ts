import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(process.env.DATABASE_PATH || "exam_iq.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL, -- 'notes', 'mcq', 'five_mark'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT NOT NULL,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/materials", (req, res) => {
    const materials = db.prepare("SELECT * FROM materials ORDER BY created_at DESC").all();
    res.json(materials);
  });

  app.post("/api/materials", (req, res) => {
    const { title, subject, content, type } = req.body;
    const info = db.prepare("INSERT INTO materials (title, subject, content, type) VALUES (?, ?, ?, ?)").run(title, subject, content, type);
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/analytics", (req, res) => {
    const scores = db.prepare("SELECT * FROM scores ORDER BY created_at ASC").all();
    res.json(scores);
  });

  app.post("/api/scores", (req, res) => {
    const { subject, score, total } = req.body;
    db.prepare("INSERT INTO scores (subject, score, total) VALUES (?, ?, ?)").run(subject, score, total);
    res.status(201).send();
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
