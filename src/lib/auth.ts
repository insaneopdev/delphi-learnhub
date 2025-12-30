import { getUserByUsername, verifyPassword, type User } from './storage';

const SESSION_KEY = 'delphi_tvs_session';

export interface Session {
  user: Omit<User, 'passwordHash'>;
  loginAt: string;
}

export async function login(username: string, password: string): Promise<{ success: boolean; error?: string; session?: Session }> {
  // Input validation
  if (!username || !password) {
    return { success: false, error: 'Username and password are required' };
  }

  if (username.length < 3 || username.length > 50) {
    return { success: false, error: 'Invalid username format' };
  }

  const user = getUserByUsername(username.trim());

  if (!user) {
    return { success: false, error: 'Invalid username or password' };
  }

  const isValid = await verifyPassword(password, user.passwordHash);

  if (!isValid) {
    return { success: false, error: 'Invalid username or password' };
  }

  const session: Session = {
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    },
    loginAt: new Date().toISOString(),
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return { success: true, session };
}

export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function getSession(): Session | null {
  try {
    const sessionStr = sessionStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;
    return JSON.parse(sessionStr) as Session;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

export function isAdmin(): boolean {
  const session = getSession();
  return session?.user.role === 'admin';
}

export function getCurrentUser(): Omit<User, 'passwordHash'> | null {
  const session = getSession();
  return session?.user ?? null;
}
