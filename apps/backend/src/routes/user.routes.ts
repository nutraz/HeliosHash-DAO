import { Router, Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

const router = Router();

/**
 * @route   GET /api/v1/users/:userId
 * @desc    Get user profile
 * @param   userId - User ID or "me" for current user
 * @returns { id, email, name, role, kycStatus, balance, ... }
 */
router.get("/:userId", async (req: AuthRequest, res: Response) => {
  try {
    const userId =
      req.params.userId === "me" ? req.user?.id : req.params.userId;

    res.json({
      success: true,
      data: {
        id: userId,
        email: req.user?.email,
        name: "User Name",
        role: req.user?.role,
        kycStatus: "verified",
        balance: 5000,
        rewards: 250,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: { code: "FETCH_FAILED", message: error.message },
    });
  }
});

/**
 * @route   PUT /api/v1/users/:userId
 * @desc    Update user profile
 */
router.put("/:userId", async (req: AuthRequest, res: Response) => {
  try {
    const { name, phoneNumber, country } = req.body;

    res.json({
      success: true,
      data: {
        id: req.params.userId,
        updated: true,
        fields: ["name", "phoneNumber", "country"],
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: { code: "UPDATE_FAILED", message: error.message },
    });
  }
});

/**
 * @route   GET /api/v1/users/:userId/balance
 * @desc    Get user token balance
 */
router.get("/:userId/balance", async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        address: req.params.userId,
        balance: 5000,
        staked: 1000,
        available: 4000,
        decimals: 8,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: { code: "FETCH_FAILED", message: error.message },
    });
  }
});

/**
 * @route   GET /api/v1/users/:userId/rewards
 * @desc    Get user pending rewards
 */
router.get("/:userId/rewards", async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        pending: 250,
        claimed: 5000,
        available: 250,
        lastClaimed: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: { code: "FETCH_FAILED", message: error.message },
    });
  }
});

export default router;
