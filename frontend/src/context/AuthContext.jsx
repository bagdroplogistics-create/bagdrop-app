import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AuthAPI, getStoredUser, getToken, setStoredUser, setToken } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [ready, setReady] = useState(false);

  // On boot, verify stored token against /auth/me
  useEffect(() => {
    const t = getToken();
    if (!t) { setReady(true); return; }
    AuthAPI.me()
      .then(({ user: fresh }) => {
        setUser(fresh);
        setStoredUser(fresh);
      })
      .catch(() => {
        setToken("");
        setStoredUser(null);
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  const login = useCallback((token, u) => {
    setToken(token);
    setStoredUser(u);
    setUser(u);
  }, []);

  const logout = useCallback(async () => {
    try { await AuthAPI.logout(); } catch (e) { /* ignore */ }
    setToken("");
    setStoredUser(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((u) => {
    setStoredUser(u);
    setUser(u);
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, login, logout, updateUser, isAuthed: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
