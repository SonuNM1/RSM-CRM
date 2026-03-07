import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "@/api/auth.api";
import { toast } from "sonner";
import api from "@/api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (window.location.pathname.startsWith("/login")) {
        setLoading(false);
        return;
      }

      try {
        await api.post("/api/auth/refresh") ; 
        const res = await getMe();
        setUser(res.data.user);
      } catch (error) {
        setUser(null);

        if (error?.response?.status === 401) {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  // listen for logout event 

  useEffect(() => {
    const handleForceLogout = () => setUser(null);
    window.addEventListener("auth:logout", handleForceLogout);
    return () => window.removeEventListener("auth:logout", handleForceLogout);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
};
