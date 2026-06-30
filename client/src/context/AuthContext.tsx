import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "../types/auth";

interface AuthContextValue {
    user: User | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Decodes a JWT payload WITHOUT verifying its signature.
// This is safe to do on the frontend because we are only reading

function decodeToken(token: string): User | null {
    try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        return {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            name: decoded.name,
        };
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // On first load, it check if a token already exists in localStorage
   
    useEffect(() => {
        const storedToken = localStorage.getItem("deskline_token");
        if (storedToken) {
            const decodedUser = decodeToken(storedToken);
            if (decodedUser) {
                setToken(storedToken);
                setUser(decodedUser);
            } else {
                localStorage.removeItem("deskline_token");
            }
        }
        setIsLoading(false);
    }, []);

    function login(newToken: string) {
        const decodedUser = decodeToken(newToken);
        if (!decodedUser) return;
        localStorage.setItem("deskline_token", newToken);
        setToken(newToken);
        setUser(decodedUser);
    }

    function logout() {
        localStorage.removeItem("deskline_token");
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}