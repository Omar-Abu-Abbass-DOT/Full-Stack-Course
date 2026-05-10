/**
 * Server-side Socket.io accessor.
 *
 * The custom server (`server.js`) attaches the Socket.io instance to
 * `globalThis.__osta_io` after it boots. API route handlers import
 * `getIO()` from here to emit events without circular dependencies.
 *
 * If the app is being run via `next dev`/`next start` (i.e. WITHOUT our
 * custom server), `globalThis.__osta_io` is undefined and emitters are
 * silently no-ops — the app still works, it just won't push events.
 */

export function getIO() {
  return globalThis.__osta_io || null;
}

/**
 * Send a notification to a single user (their JWT-authenticated socket(s)).
 * Safe to call: if Socket.io isn't running, this is a no-op.
 */
export function emitToUser(userId, event, payload) {
  const io = getIO();
  if (!io || !userId) return;
  io.to(`user:${String(userId)}`).emit(event, payload);
}
