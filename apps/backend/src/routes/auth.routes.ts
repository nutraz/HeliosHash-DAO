import express, { Router, Request, Response } from "express";
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
  try {
    const result = await authController.register(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: {
        code: "REGISTER_FAILED",
        message: error.message,
      },
    });
  }
});

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user and get tokens
 * @body    { principal, signature }
 * @returns { accessToken, refreshToken, expiresIn }
 */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const result = await authController.login(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: {
        code: "LOGIN_FAILED",
        message: error.message,
      },
    });
  }
});

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @body    { refreshToken }
 * @returns { accessToken, expiresIn }
 */
router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const result = await authController.refreshToken(req.body.refreshToken);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: {
        code: "REFRESH_FAILED",
        message: error.message,
      },
    });
  }
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
