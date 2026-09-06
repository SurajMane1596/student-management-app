import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/authApi";
import * as profileApi from "../api/profileApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;
    authApi.getSession().then((res) => {
      if (!mounted) return;
      if (res.ok) setUser(res.user);
      setIsInitializing(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await authApi.login(credentials);
    if (res.ok) setUser(res.user);
    return res;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (updates) => {
      if (!user) return { ok: false, error: "Not authenticated." };
      const res = await profileApi.updateProfile(user.clientId, updates);
      if (res.ok) setUser(res.user);
      return res;
    },
    [user]
  );

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, isInitializing, login, logout, updateProfile }),
    [user, isInitializing, login, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
