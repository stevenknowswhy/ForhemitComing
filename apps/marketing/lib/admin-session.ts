// Session storage for admin authentication
// Note: In serverless environments, consider using Redis or database-backed sessions for production

interface Session {
  token: string;
  expiresAt: number;
}

const sessions = new Map<string, Session>();

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

export function addSession(token: string): void {
  sessions.set(token, {
    token,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  });
  cleanupExpiredSessions();
}

export function removeSession(token: string): void {
  sessions.delete(token);
}

export function hasSession(token: string): boolean {
  const session = sessions.get(token);
  if (!session) return false;
  
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return false;
  }
  
  return true;
}

export function clearAllSessions(): void {
  sessions.clear();
}

function cleanupExpiredSessions(): void {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      sessions.delete(token);
    }
  }
}
