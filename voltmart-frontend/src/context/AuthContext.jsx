import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const AuthContext = createContext(null);

const STORAGE_KEY = "voltmart_auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user || null);
        setRole(parsed.role || null);
      } catch (error) {
        // Clear invalid persisted auth to avoid broken sessions.
        console.error("Failed to parse stored auth", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setLoading(false);
  }, []);

  const login = (userPayload) => {
    const nextRole = userPayload?.role || null;

    setUser(userPayload);
    setRole(nextRole);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user: userPayload, role: nextRole }),
    );
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = {
    user,
    role,
    isAuthenticated: Boolean(user),
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export function RequireAuth({ children, allowedRoles }) {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="vm-fullscreen-center">
        <div className="vm-spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    const redirectTo =
      role === "ADMIN" ? "/admin/dashboard" : "/cashier/billing";

    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
