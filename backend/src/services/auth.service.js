import argon2 from "argon2";
import { prisma } from "../lib/prisma.js";
import { signToken } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";
import { toPublicUser } from "./profile.service.js";

export async function loginUser({ clientId, mobileNumber, password }) {
  const user = await prisma.user.findFirst({
    where: { clientId, mobileNumber },
  });

  // Same error for "no such user" and "wrong password" — never reveal
  // which part was incorrect, that's a user-enumeration leak.
  if (!user) {
    throw new AppError("Invalid Client Id, Mobile Number or Password.", 401);
  }

  const passwordMatches = await argon2.verify(user.passwordHash, password);
  if (!passwordMatches) {
    throw new AppError("Invalid Client Id, Mobile Number or Password.", 401);
  }

  const token = signToken({ sub: user.id, clientId: user.clientId });

  return { token, user: toPublicUser(user) };
}

export async function hashPassword(plainPassword) {
  return argon2.hash(plainPassword);
}
