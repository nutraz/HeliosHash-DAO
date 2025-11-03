import { Request, Response } from "express";
import { prisma } from "../app";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middleware/auth.middleware";

interface RegisterRequest {
  principal: string;
  name: string;
  email: string;
  walletAddress?: string;
}

interface LoginRequest {
  principal: string;
  signature: string;
}

export class AuthController {
  /**
   * Register a new user
   */
  async register(req: Request, res: Response) {
    try {
      const { principal, name, email, walletAddress }: RegisterRequest = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { principal },
            { email }
          ]
        }
      });

