import { Request, Response, NextFunction } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();
  const path = req.path;
  const method = req.method;

  // Log response when finished
  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const status = statusCode >= 400 ? "✗" : "✓";

    console.log(`${status} [${statusCode}] ${method} ${path} (${duration}ms)`);
  });

  next();
};
