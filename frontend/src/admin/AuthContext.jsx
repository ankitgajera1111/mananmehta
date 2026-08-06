import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as api from '../lib/api';

const AuthContext = createContext(null);

/**
 * Admin session state.
 *
 * There is no token to hold: the JWT lives in an httpOnly cookie the browser
 * attaches automatically and JavaScript cannot read. "Am I logged in?" is
 * therefore a server question, answered by GET /admin/me on mount.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .fetchMe()
      .then((me) => !cancelled && setUser(me))
      .catch(() => !cancelled && setUser(null))
      .finally(() => !cancelled && setChecking(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    const me = await api.login(email, password);
    setUser(me);
    return me;
  }, []);

  const signOut = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      // Clear locally even if the request failed - the cookie may already be
      // expired, and leaving a dead session on screen helps nobody.
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, checking, signIn, signOut }),
    [user, checking, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside an <AuthProvider>');
  return ctx;
};
