import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

interface SessionData {
  user: User;
  timestamp: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

import { API_URL } from '@/utils/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const SESSION_STORAGE_KEY = 'vitalgeo_user_session';
const SESSION_VALIDATION_INTERVAL = 5 * 60 * 1000; // 5 minutes
const SESSION_MAX_AGE = 14 * 24 * 60 * 60 * 1000; // 14 days

// Helper functions for session storage
const saveSession = (user: User): void => {
  try {
    const sessionData: SessionData = {
      user,
      timestamp: Date.now()
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
  } catch (error) {
    console.error('Error saving session to localStorage:', error);
  }
};

const loadSession = (): SessionData | null => {
  try {
    const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!savedSession) return null;

    const sessionData: SessionData = JSON.parse(savedSession);
    
    // Check if session is still valid (not expired)
    const now = Date.now();
    if (now - sessionData.timestamp > SESSION_MAX_AGE) {
      clearSession();
      return null;
    }

    return sessionData;
  } catch (error) {
    console.error('Error loading session from localStorage:', error);
    clearSession();
    return null;
  }
};

const clearSession = (): void => {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing session from localStorage:', error);
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Update user state and persist to localStorage
  const updateUser = useCallback((newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      saveSession(newUser);
    } else {
      clearSession();
    }
  }, []);

  // Check authentication status with server validation
  const checkAuthStatus = useCallback(async (useCached = true) => {
    try {
      // First, try to restore from localStorage if available (faster UX)
      if (useCached) {
        const cachedSession = loadSession();
        if (cachedSession && cachedSession.user) {
          // Only allow regular users (reject admin users)
          if (cachedSession.user.role !== 'admin') {
            setUser(cachedSession.user);
            setLoading(false);
            // Continue to validate with server in background
          }
        }
      }

      // Always validate with server to ensure session is still valid
      const response = await fetch(`${API_URL}/auth/status`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated && data.user) {
          // Backend already filters out admin users, but double-check for safety
          if (data.user.role === 'admin') {
            updateUser(null);
          } else {
            updateUser(data.user);
          }
        } else {
          updateUser(null);
        }
      } else {
        updateUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // On error, keep cached session if available (offline mode)
      const cachedSession = loadSession();
      if (cachedSession && cachedSession.user && cachedSession.user.role !== 'admin') {
        // Keep cached user but mark session as potentially stale
        setUser(cachedSession.user);
      } else {
        updateUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  // Initialize: check auth status on mount
  useEffect(() => {
    // Delay initial check slightly to ensure cookies are set after login
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, 100);
    return () => clearTimeout(timer);
  }, [checkAuthStatus]);

  // Periodic session validation (every 5 minutes)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      checkAuthStatus(false); // Always validate with server, don't use cached
    }, SESSION_VALIDATION_INTERVAL);

    return () => clearInterval(interval);
  }, [user, checkAuthStatus]);

  // Validate session on window focus (user returns to tab)
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        checkAuthStatus(false); // Validate with server on focus
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user, checkAuthStatus]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success && data.user) {
        // Only allow regular users (reject admin users)
        if (data.user.role === 'admin') {
          // Logout admin user immediately
          await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
          });
          throw new Error('Admin accounts cannot login through the frontend. Please use the admin panel.');
        }
        updateUser(data.user);
        // Wait a bit for cookie to be set, then verify session
        setTimeout(() => {
          checkAuthStatus(false);
        }, 200);
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      if (data.success && data.user) {
        updateUser(data.user);
      } else {
        throw new Error(data.message || 'Signup failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      updateUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear user state even if request fails
      updateUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

