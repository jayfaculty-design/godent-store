import api from "@/lib/api";
import axios from "axios";
import {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Run on app load or refresh
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        // Trying with current token
        let res = await fetch("http://localhost:3000/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include", // including refresh cookie
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else if (res.status === 401) {
          // If expired i try refresh
          const refreshRes = await fetch("http://localhost:3000/auth/refresh", {
            method: "POST",
            credentials: "include", // sending refresh cookie
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();

            // saving new access token
            localStorage.setItem("token", refreshData.token);

            // Retrying /auth/me with new token
            res = await fetch("http://localhost:3000/auth/me", {
              headers: {
                Authorization: `Bearer ${refreshData.token}`,
              },
              credentials: "include",
            });

            if (res.ok) {
              const data = await res.json();
              setUser(data);
            } else {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Auth check failed", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // sign up
  const signup = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:3000/auth/signup", {
        username,
        email,
        password,
      });
      if (response.status === 200) {
        const loginRes = await axios.post(
          "http://localhost:3000/auth/login",
          {
            email,
            password,
          },
          { withCredentials: true }
        );

        if (loginRes.status === 200) {
          localStorage.setItem("token", loginRes.data.token);
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${loginRes.data.token}`;
          setUser(loginRes.data.user);
        }
      } else {
        throw new Error(response.data.message || "Sign up failed");
      }
    } catch (err) {
      console.log("Sign up failed", err);
      throw err;
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    const res = await axios.post(
      "http://localhost:3000/auth/login",
      { email, password },
      { withCredentials: true } // so refresh cookie is set
    );

    if (res.status === 200) {
      localStorage.setItem("token", res.data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
    } else {
      throw new Error(res.data.message || "Login failed");
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, loading, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
};
