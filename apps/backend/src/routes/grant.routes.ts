import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

/**
 * @route   GET /api/v1/grants
 * @desc    Get all grants available
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, minAmount, maxAmount } = req.query;

    res.json({
      success: true,
      data: {
        grants: [],
        total: 0,
        filters: { category, minAmount, maxAmount },
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
 * @route   GET /api/v1/grants/:grantId
 * @desc    Get grant details
 */
router.get("/:grantId", async (req: Request, res: Response) => {
  try {
    const { grantId } = req.params;

    res.json({
      success: true,
      data: {
        grantId,
        name: "Grant Name",
        category: "research",
        amount: 50000,
        status: "open",
        deadline: new Date().toISOString(),
        description: "Grant description",
        requirements: [],
        applicationCount: 5,
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
 * @route   POST /api/v1/grants/:grantId/apply
 * @desc    Apply for a grant
 */
router.post(
  "/:grantId/apply",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { grantId } = req.params;
      const { proposal, projectDetails, budget } = req.body;

      res.status(201).json({
        success: true,
        data: {
          applicationId: `app_${grantId}_${Date.now()}`,
          grantId,
          status: "submitted",
          submittedAt: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: { code: "APPLICATION_FAILED", message: error.message },
      });
    }
  }
);

/**
 * @route   GET /api/v1/grants/:grantId/applications/:applicationId
 * @desc    Get application status
 */
router.get(
  "/:grantId/applications/:applicationId",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { grantId, applicationId } = req.params;

      res.json({
        success: true,
        data: {
          applicationId,
          grantId,
          status: "under_review",
          submittedAt: new Date().toISOString(),
          reviewedAt: null,
        },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: { code: "FETCH_FAILED", message: error.message },
      });
    }
  }
);

export default router;
