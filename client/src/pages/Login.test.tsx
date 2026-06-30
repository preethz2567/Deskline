import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { Login } from "./Login";

function renderLogin() {
    return render(
        <MemoryRouter>
            <AuthProvider>
                <Login />
            </AuthProvider>
        </MemoryRouter>
    );
}

describe("Login form validation", () => {
    it("shows an inline error when submitting with an empty email", () => {
        renderLogin();

        const submitButton = screen.getByRole("button", { name: /sign in/i });
        fireEvent.click(submitButton);

        expect(screen.getByText("Email is required")).toBeInTheDocument();
    });

    it("shows an inline error when the email is invalid", () => {
        renderLogin();

        const emailInput = screen.getByLabelText("Email Address");
        fireEvent.change(emailInput, { target: { value: "not-an-email" } });

        const submitButton = screen.getByRole("button", { name: /sign in/i });
        fireEvent.click(submitButton);

        expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();
    });
});