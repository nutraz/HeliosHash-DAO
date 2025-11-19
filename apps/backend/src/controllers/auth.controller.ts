import { Request, Response } from "express";
import { prisma } from "../app";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
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

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this principal or email'
        });
      }

      // Create new user
      const user = await prisma.user.create({
        data: {
          principal,
          name,
          email,
          walletAddress
        }
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, principal: user.principal },
        process.env.JWT_SECRET || 'default-secret',
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user.id,
            principal: user.principal,
            name: user.name,
            email: user.email
          },
          token
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Login user (verify Internet Identity)
   */
  async login(req: Request, res: Response) {
    try {
      const { principal, signature }: LoginRequest = req.body;

      // Find user by principal
      const user = await prisma.user.findUnique({
        where: { principal }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // In a real ICP app, you'd verify the signature here
      // For now, we'll just generate a token

      const token = jwt.sign(
        { id: user.id, email: user.email, principal: user.principal },
        process.env.JWT_SECRET || 'default-secret',
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            principal: user.principal,
            name: user.name,
            email: user.email
          },
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            principal: user.principal,
            name: user.name,
            email: user.email,
            walletAddress: user.walletAddress
          }
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

export const authController = new AuthController();