import { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";

const AuthContext = createContext();

// ─── Forced logout overlay ─────────────────────────────────────────────────────
// Rendered inside the provider so it sits above everything in the app.
function ForceLogoutOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay so the browser paints the element before we trigger the fade-in
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  // After the animation, navigate to the home / landing page
  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => {
        window.location.replace("/");
      }, 2200); // 2.2 s — enough time for the animation to play out
      return () => clearTimeout(t);
    }
  }, [visible]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 60%, #16213e 100%)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease",
        fontFamily: "'Inter', sans-serif",
        textAlign: "center",
        padding: "32px",
      }}
    >
      {/* Animated lock icon */}
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "36px",
          marginBottom: "28px",
          boxShadow: "0 0 40px rgba(139, 92, 246, 0.4)",
          animation: "pulse 1.5s ease infinite",
        }}
      >
        🔒
      </div>

      <h2
        style={{
          color: "white",
          fontSize: "24px",
          fontWeight: "800",
          letterSpacing: "-0.5px",
          margin: "0 0 12px",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
        }}
      >
        Signed out from all devices
      </h2>

      <p
        style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: "15px",
          margin: "0 0 32px",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s",
        }}
      >
        Your session has been securely terminated.
        <br />
        Redirecting you to the home page…
      </p>

      {/* Progress bar */}
      <div
        style={{
          width: "220px",
          height: "3px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "999px",
          overflow: "hidden",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.4s ease 0.8s",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
            borderRadius: "999px",
            width: visible ? "100%" : "0%",
            transition: "width 2s linear 0.8s",
          }}
        />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.4); }
          50%  { box-shadow: 0 0 60px rgba(139, 92, 246, 0.7); }
        }
      `}</style>
    </div>
  );
}

// ─── Auth Provider ──────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const s = localStorage.getItem("token");
    return !s || s === "null" || s === "undefined" ? null : s;
  });

  const [refreshToken, setRefreshToken] = useState(() => {
    const s = localStorage.getItem("refreshToken");
    return !s || s === "null" || s === "undefined" ? null : s;
  });

  const [user, setUser] = useState(() => {
    const s = localStorage.getItem("token");
    if (s && s !== "null" && s !== "undefined") {
      try { return JSON.parse(atob(s.split(".")[1])); } catch { return null; }
    }
    return null;
  });

  // initialized: true once we've resolved auth state from localStorage
  const [initialized, setInitialized] = useState(false);

  // forceLoggedOut: triggers the full-screen animated overlay
  const [forceLoggedOut, setForceLoggedOut] = useState(false);

  useEffect(() => { setInitialized(true); }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      try { setUser(JSON.parse(atob(token.split(".")[1]))); } catch { setUser(null); }
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  useEffect(() => {
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    else localStorage.removeItem("refreshToken");
  }, [refreshToken]);

  const login = (data) => {
    setToken(data.token);
    if (data.refreshToken) setRefreshToken(data.refreshToken);
  };

  /**
   * Wipe all auth state.
   * @param {boolean} showOverlay – if true, shows the animated "logged out" screen
   *   before redirecting to the landing page. Use this for remote/forced logouts.
   */
  const clearTokens = (showOverlay = false) => {
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    if (showOverlay) {
      setForceLoggedOut(true); // The overlay handles the redirect after its animation
    }
  };

  const logout = async () => {
    const currentToken = token;
    const currentRefresh = refreshToken;
    // Clear state immediately so the UI responds at once
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    // Fire and forget — errors are non-fatal
    try {
      await axios.post("/api/auth/logout", { refreshToken: currentRefresh }, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const logoutAll = async () => {
    const currentToken = token;
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    try {
      await axios.post("/api/auth/logout-all", {}, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
    } catch (err) {
      console.error("Logout all error:", err);
    }
  };

  // ── Interceptor & heartbeat refs ──────────────────────────────────────────────
  const isRefreshing = useRef(false);
  const failedQueue = useRef([]);
  const tokenRef = useRef(token);
  const refreshTokenRef = useRef(refreshToken);

  useEffect(() => {
    tokenRef.current = token;
    refreshTokenRef.current = refreshToken;
  }, [token, refreshToken]);

  const processQueue = (error, newToken = null) => {
    failedQueue.current.forEach(p => error ? p.reject(error) : p.resolve(newToken));
    failedQueue.current = [];
  };

  // ── Axios interceptors ────────────────────────────────────────────────────────
  useEffect(() => {
    const reqInterceptor = axios.interceptors.request.use(
      (config) => {
        if (tokenRef.current && !config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${tokenRef.current}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const resInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing.current) {
            return new Promise((resolve, reject) => {
              failedQueue.current.push({ resolve, reject });
            }).then(tok => {
              originalRequest.headers["Authorization"] = "Bearer " + tok;
              return axios(originalRequest);
            }).catch(err => Promise.reject(err));
          }

          originalRequest._retry = true;
          isRefreshing.current = true;
          const rToken = refreshTokenRef.current;

          if (!rToken) {
            // No refresh token — this is a remote/forced session termination
            clearTokens(true);
            return Promise.reject(error);
          }

          try {
            const res = await axios.post(
              "/api/auth/refresh",
              { refreshToken: rToken },
              {
                transformRequest: [(data, headers) => {
                  delete headers["Authorization"];
                  return JSON.stringify(data);
                }],
                headers: { "Content-Type": "application/json" }
              }
            );
            setToken(res.data.token);
            setRefreshToken(res.data.refreshToken);
            originalRequest.headers["Authorization"] = "Bearer " + res.data.token;
            processQueue(null, res.data.token);
            return axios(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);
            // Refresh token was revoked (logoutAll from another device)
            clearTokens(true);
            return Promise.reject(refreshError);
          } finally {
            isRefreshing.current = false;
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    };
  }, []);

  // ── Heartbeat: ping /api/auth/verify every 30 s while logged in ───────────────
  // This is what silently detects a remote "Logout All" without the user clicking anything.
  useEffect(() => {
    if (!token) return; // Only poll when we think we're logged in

    const interval = setInterval(async () => {
      try {
        await axios.get("/api/auth/verify");
        // 200 OK — session still valid, nothing to do
      } catch {
        // The interceptor will handle the 401: it will try to refresh, fail,
        // and call clearTokens(true) which shows the overlay and redirects.
      }
    }, 30_000); // 30 seconds

    return () => clearInterval(interval);
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, refreshToken, initialized, login, logout, logoutAll }}>
      {/* Overlay mounts on top of everything when a remote logout is detected */}
      {forceLoggedOut && <ForceLogoutOverlay />}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
