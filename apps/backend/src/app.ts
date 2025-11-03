import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import proposalRoutes from "./routes/proposal.routes";
import treasuryRoutes from "./routes/treasury.routes";
import projectRoutes from "./routes/project.routes";
import grantRoutes from "./routes/grant.routes";
import disputeRoutes from "./routes/dispute.routes";

// Import middleware
import { authMiddleware } from "./middleware/auth.middleware";
import { errorHandler } from "./middleware/errorHandler.middleware";
import { requestLogger } from "./middleware/requestLogger.middleware";

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Create Express app
const app: Express = express();

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Logging
app.use(requestLogger);

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ============================================================================
// ROUTES
// ============================================================================

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API version
app.get("/api/v1/info", (req: Request, res: Response) => {
  res.json({
    name: "HeliosHash DAO Backend API",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  });
});

// Auth routes (no authentication required)
app.use("/api/v1/auth", authRoutes);

// Protected routes
app.use("/api/v1/users", authMiddleware, userRoutes);
app.use("/api/v1/proposals", authMiddleware, proposalRoutes);
app.use("/api/v1/treasury", authMiddleware, treasuryRoutes);
app.use("/api/v1/projects", authMiddleware, projectRoutes);
app.use("/api/v1/grants", grantRoutes);
app.use("/api/v1/disputes", authMiddleware, disputeRoutes);

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
});

// Global error handler
app.use(errorHandler);

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================

process.on("SIGINT", async () => {
  console.log("\n✓ Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n✓ Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
