import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  confirmSignUp as amplifyConfirmSignUp,
  resendSignUpCode,
  signOut as amplifySignOut,
  getCurrentUser,
  fetchAuthSession,
  type AuthUser,
} from "aws-amplify/auth";

interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ needsConfirmation: boolean }>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const u = await getCurrentUser();
      setUser(u);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const signIn: AuthCtx["signIn"] = async (email, password) => {
    await amplifySignIn({ username: email, password });
    await refresh();
  };

  const signUp: AuthCtx["signUp"] = async (email, password) => {
    const res = await amplifySignUp({
      username: email,
      password,
      options: { userAttributes: { email } },
    });
    return { needsConfirmation: !res.isSignUpComplete };
  };

  const confirmSignUp: AuthCtx["confirmSignUp"] = async (email, code) => {
    await amplifyConfirmSignUp({ username: email, confirmationCode: code });
  };

  const resendCode: AuthCtx["resendCode"] = async (email) => {
    await resendSignUpCode({ username: email });
  };

  const signOut: AuthCtx["signOut"] = async () => {
    await amplifySignOut();
    setUser(null);
  };

  const getAccessToken: AuthCtx["getAccessToken"] = async () => {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.accessToken?.toString() ?? null;
    } catch {
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, confirmSignUp, resendCode, signOut, getAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
