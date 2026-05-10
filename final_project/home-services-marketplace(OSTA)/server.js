/**
 * Custom Next.js server with Socket.io attached.
 *
 *  Why a custom server?
 *  ────────────────────
 *  Next.js's default `next dev` / `next start` is serverless-style and does
 *  not expose a long-lived HTTP server we can attach Socket.io to. To support
 *  real-time features (in-app notifications) we boot Next manually and bolt
 *  Socket.io onto the same HTTP server.
 *
 *  Use:
 *    npm run dev    → node server.js NODE_ENV=development
 *    npm start      → node server.js NODE_ENV=production
 *
 *  Deployment note:
 *    Vercel's serverless functions do NOT support persistent WebSocket
 *    connections. Deploy this app on Render / Railway / Fly.io / a VPS,
 *    OR keep Vercel for the Next.js part and run this server.js on a
 *    separate host that the client points to.
 */

import { createServer } from "node:http";
import { parse } from "node:url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";

const dev      = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port     = Number(process.env.PORT) || 3000;

const app    = next({ dev, hostname, port });
const handle = app.getRequestHandler();

await app.prepare();

const httpServer = createServer((req, res) => {
  const parsedUrl = parse(req.url, true);
  handle(req, res, parsedUrl);
});

/**
 * Attach Socket.io.
 * - Authenticates connections via JWT (passed in `auth.token` from the client).
 * - Each authenticated user joins a personal room: `user:<userId>`.
 *   API routes emit to `user:<id>` to deliver targeted notifications.
 */
const io = new SocketIOServer(httpServer, {
  cors: { origin: "*" },
  path: "/api/socket.io",
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      // Allow anonymous connections so the client can still subscribe to
      // public channels later if we want; they just won't receive personal events.
      socket.data.user = null;
      return next();
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.data.user = { id: decoded.id || decoded._id, role: decoded.role };
    return next();
  } catch (err) {
    socket.data.user = null;
    return next(); // soft-fail; user simply won't receive private events
  }
});

io.on("connection", (socket) => {
  const u = socket.data.user;
  if (u?.id) {
    socket.join(`user:${u.id}`);
  }
  socket.on("disconnect", () => {
    /* nothing to clean up — rooms are auto-removed */
  });
});

// Make `io` available to API route handlers via global. The accessor is in
// src/lib/socket.js — kept on `globalThis` so it survives Next.js HMR cycles.
globalThis.__osta_io = io;

httpServer.listen(port, () => {
  console.log(`▲ OSTA on http://${hostname}:${port}`);
  console.log(`◉ Socket.io listening on /api/socket.io`);
});
