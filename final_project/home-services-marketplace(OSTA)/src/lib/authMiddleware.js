import { verifyToken } from "./auth";
import { unauthorized, forbidden } from "./apiHelpers";

export function requireAuth(request) {
  const user = verifyToken(request);
  if (!user) return { user: null, error: unauthorized() };
  return { user, error: null };
}

export function requireRole(request, roles) {
  const { user, error } = requireAuth(request);
  if (error) return { user: null, error };

  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(user.role)) {
    return { user: null, error: forbidden("Access denied for this role") };
  }
  return { user, error: null };
}
