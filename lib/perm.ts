import { Role } from "@prisma/client";

export function hasAtLeast(userRole: Role, required: Role) {
  const order: Role[] = ["USER", "BLOGGER", "STREAMER", "MOD", "ADMIN", "OWNER"];
  return order.indexOf(userRole) >= order.indexOf(required);
}

export function canPublish(userRole: Role) {
  return hasAtLeast(userRole, "BLOGGER");
}

export function canModerate(userRole: Role) {
  return hasAtLeast(userRole, "MOD");
}

export function isAdmin(userRole: Role) {
  return hasAtLeast(userRole, "ADMIN");
}
