import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

// Liveness/readiness probe for uptime monitors and deploy platforms
// (Render/Railway/Fly all expect something like this). Checks the DB too,
// since a server that's "up" but can't reach Neon isn't actually healthy.
router.get("/", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, status: "healthy", db: "connected", timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ ok: false, status: "unhealthy", db: "disconnected" });
  }
});

export default router;
