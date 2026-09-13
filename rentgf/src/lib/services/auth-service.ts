import { prisma } from "@/lib/db/prisma-client";
import bcrypt from "bcryptjs";

export interface AuthServiceInterface {
  register(data: {
    fullName: string;
    displayName: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    country?: string;
    city?: string;
    password: string;
    role?: string;
  }): Promise<{ user: any; token: string }>;
  login(email: string, password: string): Promise<{ user: any; token: string }>;
  logout(userId: string): Promise<void>;
  getUserById(id: string): Promise<any | null>;
  getUserByEmail(email: string): Promise<any | null>;
  updateUser(id: string, data: Partial<UpdateUserData>): Promise<any>;
  verifyEmail(token: string): Promise<any>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
}

export type UpdateUserData = {
  displayName?: string;
  fullName?: string;
  phone?: string;
  city?: string;
  country?: string;
  avatarUrl?: string;
};

export class AuthService implements AuthServiceInterface {
  async register(data: {
    fullName: string;
    displayName: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    country?: string;
    city?: string;
    password: string;
    role?: string;
  }): Promise<{ user: any; token: string }> {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    if (data.dateOfBirth) {
      const dob = new Date(data.dateOfBirth);
      const now = new Date();
      let age = now.getFullYear() - dob.getFullYear();
      const monthDiff = now.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) age--;
      if (age < 18) throw new Error("Must be 18 years or older to register");
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const role = data.role || "CUSTOMER";

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        displayName: data.displayName,
        fullName: data.fullName,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        country: data.country,
        city: data.city,
        role: role as any,
      },
    });

    const token = await this.generateToken(user.id);
    return { user, token };
  }

  async login(email: string, password: string): Promise<{ user: any; token: string }> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      throw new Error("Invalid email or password");
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    if (user.status === "SUSPENDED" || user.status === "BLOCKED" || user.status === "DEACTIVATED") {
      throw new Error("Account is not active");
    }

    const token = await this.generateToken(user.id);
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    return { user, token };
  }

  async logout(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({ where: { userId } });
  }

  async getUserById(id: string): Promise<any | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<any | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async updateUser(id: string, data: Partial<UpdateUserData>): Promise<any> {
    return prisma.user.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
  }

  async verifyEmail(token: string): Promise<any> {
    const tempToken = await prisma.tempToken.findUnique({ where: { token } });
    if (!tempToken || tempToken.type !== "EMAIL_VERIFY" || tempToken.expiresAt < new Date()) {
      throw new Error("Invalid or expired verification token");
    }

    const user = await prisma.user.findUnique({ where: { id: tempToken.userId } });
    if (!user) throw new Error("User not found");

    await prisma.user.update({ where: { id: user.id }, data: { emailVerified: true } });
    await prisma.tempToken.delete({ where: { id: tempToken.id } });

    return user;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return;

    const token = await this.generateToken(user.id);
    await prisma.tempToken.create({
      data: { token, userId: user.id, type: "PASSWORD_RESET", expiresAt: new Date(Date.now() + 3600000) },
    });

    // Email sending would be implemented here
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tempToken = await prisma.tempToken.findUnique({ where: { token } });
    if (!tempToken || tempToken.type !== "PASSWORD_RESET" || tempToken.expiresAt < new Date()) {
      throw new Error("Invalid or expired reset token");
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: tempToken.userId }, data: { passwordHash } });
    await prisma.tempToken.delete({ where: { id: tempToken.id } });
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.passwordHash) throw new Error("User not found");

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) throw new Error("Current password is incorrect");

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  }

  private async generateToken(userId: string): Promise<string> {
    const crypto = require("crypto");
    return crypto.randomBytes(32).toString("hex");
  }
}
