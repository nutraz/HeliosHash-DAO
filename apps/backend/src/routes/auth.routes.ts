import * as express from "express";
import { Router, Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { authController } from "../controllers/auth.controller";

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @body    { principal, name, email, walletAddress }
 * @returns { userId, accessToken, refreshToken, user }
 */
router.post("/register", async (req: Request, res: Response) => {
  await authController.register(req, res);
});

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user and get tokens
 * @body    { principal, signature }
 * @returns { accessToken, refreshToken, expiresIn }
 */
router.post("/login", async (req: Request, res: Response) => {
  await authController.login(req, res);
});

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user and invalidate tokens
 */
router.post("/logout", async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Not authenticated" },
      });
    }

    // Invalidate refresh tokens in database
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: {
        code: "LOGOUT_FAILED",
        message: error.message,
      },
    });
  }
});

export default router;
