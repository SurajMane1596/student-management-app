import { prisma } from "../lib/prisma.js";
import { AppError } from "../middleware/errorHandler.js";

// Never let a passwordHash escape this module.
export function toPublicUser(user) {
  return {
    clientId: user.clientId,
    userName: user.userName,
    contactNumber: user.mobileNumber,
    emailId: user.email,
    clientName: user.clientName,
    subscriptionStatus: user.subscriptionStatus === "ACTIVE" ? "Active" : "Inactive",
  };
}

export async function getProfile(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found.", 404);
  return toPublicUser(user);
}

export async function updateProfile(userId, updates) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      userName: updates.userName,
      mobileNumber: updates.contactNumber,
      email: updates.emailId,
      clientName: updates.clientName,
    },
  });
  return toPublicUser(user);
}
