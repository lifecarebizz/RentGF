export function authMiddleware(request: Request): {
  userId: string;
  role: string;
  status: string;
} {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Unauthorized: No token provided");
  }

  const token = authHeader.substring(7);
  // Token validation would use JWT or session in production
  // For now, decode the token (placeholder for real JWT verification)
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1] || "", "base64").toString());
    return {
      userId: payload.id,
      role: payload.role || "CUSTOMER",
      status: payload.status || "ACTIVE",
    };
  } catch {
    throw new Error("Unauthorized: Invalid token");
  }
}

export function requireRole(...roles: string[]) {
  return async (request: Request) => {
    const { role } = authMiddleware(request);
    if (!roles.includes(role)) {
      throw new Error("Forbidden: Insufficient permissions");
    }
    return true;
  };
}

export function requireAdmin(request: Request): boolean {
  const { role } = authMiddleware(request);
  if (role !== "ADMIN") {
    throw new Error("Forbidden: Admin access required");
  }
  return true;
}
