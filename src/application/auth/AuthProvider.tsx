import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SessionUser } from "../../domain/models";
import { userManager, type User } from "../../infrastructure/auth/oidc";
import { toSessionUser } from "./session";
import { tokenProvider } from "../../infrastructure/auth/tokenProvider";

interface AuthContextValue {
  isInitialized: boolean;
  isAuthenticated: boolean;
  session: SessionUser | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: {children: ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [session, setSession] = useState<SessionUser | null>(null);

  useEffect(() => {
    let cancelled = false;

    const refresh = (user: User | null) => {
      if (cancelled) return;
      if (user && !user.expired) {
        const next = toSessionUser(user);
        tokenProvider.setAccessToken(next.accessToken);
        setSession(next);
      } else {
        tokenProvider.setAccessToken(null);
        setSession(null);
      }
      setInitialized(true);
    };

    const onLoaded = (loaded: User) => refresh(loaded);
    const onUnloaded = () => refresh(null);

    userManager.events.addUserLoaded(onLoaded);
    userManager.events.addUserUnloaded(onUnloaded);

    tokenProvider.setUnauthorizedHandler(() => {
      void userManager.removeUser().then(() => userManager.signinRedirect());
    });

    void userManager.getUser().then((user) => refresh(user && !user.expired ? user : null));

    return () => {
      cancelled = true;
      userManager.events.removeUserLoaded(onLoaded);
      userManager.events.removeUserUnloaded(onUnloaded);
      tokenProvider.setUnauthorizedHandler(null);
    };
  }, []);

  const login = useCallback(() => userManager.signinRedirect(), []);
  const logout = useCallback(() => userManager.signoutRedirect(), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isInitialized: initialized,
      isAuthenticated: session !== null,
      session,
      login,
      logout,
    }),
    [initialized, session, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return context;
}
