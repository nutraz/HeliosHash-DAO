import { Router, Request, Response } from "express";

const router = Router();

/**
 * @route   GET /api/v1/treasury/balance
 * @desc    Get treasury balance and allocations
 */
router.get("/balance", async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        balance: 500000,
        currency: "HHU",
        allocations: {
          projects: 200000,
          reserves: 150000,
          operations: 100000,
          rewards: 50000,
        },
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
 * @route   GET /api/v1/treasury/history
 * @desc    Get transaction history
 */
router.get("/history", async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit || 50;

    res.json({
      success: true,
      data: {
        transactions: [],
        total: 0,
        limit: parseInt(limit as string),
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
 * @route   POST /api/v1/treasury/allocate
 * @desc    Allocate funds from treasury
 */
router.post("/allocate", async (req: Request, res: Response) => {
  try {
    const { projectId, amount, reason, milestones } = req.body;

    res.status(201).json({
      success: true,
      data: {
        allocationId: `alloc_${projectId}`,
        projectId,
        amount,
        status: "approved",
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: { code: "ALLOCATION_FAILED", message: error.message },
    });
  }
});

/**
 * @route   GET /api/v1/treasury/budget
 * @desc    Get budget information
 */
router.get("/budget", async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        totalBudget: 500000,
        allocated: 400000,
        available: 100000,
        allocations: {
          projects: 200000,
          reserves: 150000,
          operations: 100000,
          rewards: 50000,
        },
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
