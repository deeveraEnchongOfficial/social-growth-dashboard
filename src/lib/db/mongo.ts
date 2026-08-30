import mongoose, { type Connection } from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var __mongoConn: { conn: Connection | null; promise: Promise<Connection | null> | null } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Connects to MongoDB if MONGODB_URI is set. If unset, returns null and
 * the app falls back to the mock data layer — so the dashboard runs
 * with zero external dependencies for local development.
 *
 * Caches the connection on the global object to avoid reconnecting
 * on every hot-reload in development.
 */
export async function connectMongo(): Promise<Connection | null> {
  if (!MONGODB_URI) {
    return null;
  }

  if (global.__mongoConn?.conn) {
    return global.__mongoConn.conn;
  }

  if (!global.__mongoConn) {
    global.__mongoConn = { conn: null, promise: null };
  }

  if (!global.__mongoConn.promise) {
    global.__mongoConn.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((m) => {
        global.__mongoConn!.conn = m.connection;
        return m.connection;
      })
      .catch((err) => {
        console.error("[mongo] connection failed — falling back to mock data:", err);
        global.__mongoConn!.promise = null;
        return null;
      });
  }

  return global.__mongoConn.promise;
}
