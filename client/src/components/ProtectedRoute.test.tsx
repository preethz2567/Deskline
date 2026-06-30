import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";

function TestApp() {
    return (
        <MemoryRouter initialEntries={["/protected"]}>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<div>Login Page</div>} />
                    <Route
                        path="/protected"
                        element={
                            <ProtectedRoute>
                                <div>Secret Content</div>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </MemoryRouter>
    );
}

describe("ProtectedRoute", () => {
    it("redirects to /login when there is no authenticated user", async () => {
        render(<TestApp />);


        const loginText = await screen.findByText("Login Page");
        expect(loginText).toBeInTheDocument();
        expect(screen.queryByText("Secret Content")).not.toBeInTheDocument();
    });
});