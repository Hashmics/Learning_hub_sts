import { createContext, useContext, useEffect, useState } from "react";
import { getMe, loginUser, registerUser } from "../services/authService";

const AuthContext = createContext(null);

const TOKEN_KEY = "learnhub_token";
const USER_KEY = "learnhub_user";

function readStoredUser() {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw);
    } catch (error) {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(readStoredUser);
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

    const saveSession = (data) => {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
    };

    const updateUser = (nextUser) => {
        localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
        setUser(nextUser);
    };

    const register = async (form) => {
        const data = await registerUser(form);
        saveSession(data);
        return data;
    };

    const login = async (form) => {
        const data = await loginUser(form);
        saveSession(data);
        return data;
    };

    useEffect(() => {
        if (!token) {
            return;
        }

        let cancelled = false;

        getMe(token)
            .then((data) => {
                if (cancelled) {
                    return;
                }
                localStorage.setItem(USER_KEY, JSON.stringify(data.user));
                setUser(data.user);
            })
            .catch((error) => {
                if (!cancelled && error.response?.status === 401) {
                    logout();
                }
            });

        return () => {
            cancelled = true;
        };
    }, [token]);

    return (
        <AuthContext.Provider value={{ user, token, register, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function dashboardPath(role) {
    if (role === "admin") {
        return "/dashboard/admin";
    }

    if (role === "instructor") {
        return "/dashboard/instructor";
    }

    return "/dashboard/student";
}

export function useAuth() {
    return useContext(AuthContext);
}
