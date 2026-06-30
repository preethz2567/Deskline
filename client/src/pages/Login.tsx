import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginRequest } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { isValidEmail } from "../utils/validateEmail";

interface LocationState {
    from?: { pathname: string };
}

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    function validate(): boolean {
        const newErrors: { email?: string; password?: string } = {};

        if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Enter a valid email address";
    }

        if (!password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setServerError(null);

        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const { token } = await loginRequest(email, password);
            login(token);

            const state = location.state as LocationState | null;
            const redirectTo = state?.from?.pathname || "/";
            navigate(redirectTo, { replace: true });
        } catch {
            setServerError("Invalid email or password. Please check your credentials.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="login-page">

            {/* ── Left: Branding Panel ── */}
            <div className="login-branding">
                <div className="branding-logo">
                    <div className="branding-logo-mark">
                        <svg viewBox="0 0 24 24">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                    <span className="branding-logo-text">Deskline</span>
                </div>

                <div className="branding-main">
                    <p className="branding-tag">Support Operations Platform</p>
                    <h1 className="branding-headline">
                        Resolve faster.<br />
                        <span>Stay in control.</span>
                    </h1>
                    <p className="branding-desc">
                        A unified workspace for your support team — track every ticket,
                        manage every request, and never let anything fall through the cracks.
                    </p>
                </div>

                <div className="branding-stats">
                    <div>
                        <div className="branding-stat-value">100%</div>
                        <div className="branding-stat-label">Visibility</div>
                    </div>
                    <div>
                        <div className="branding-stat-value">Real-time</div>
                        <div className="branding-stat-label">Updates</div>
                    </div>
                    <div>
                        <div className="branding-stat-value">Zero</div>
                        <div className="branding-stat-label">Missed tickets</div>
                    </div>
                </div>
            </div>

            {/* ── Right: Form Panel ── */}
            <div className="login-form-panel">
                <div className="login-form-inner">
                    <div className="login-form-header">
                        <p className="login-form-eyebrow">Secure Access</p>
                        <h2 className="login-form-title">Sign in to Deskline</h2>
                        <p className="login-form-sub">Enter your credentials to access your workspace.</p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="field-group">
                            <label className="field-label" htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                className="field-input"
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                aria-invalid={errors.email ? "true" : "false"}
                                aria-describedby={errors.email ? "email-error" : undefined}
                                placeholder="you@company.com"
                                autoComplete="email"
                            />
                            {errors.email && (
                                <p id="email-error" role="alert" className="field-error">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="field-group">
                            <label className="field-label" htmlFor="password">Password</label>
                            <input
                                id="password"
                                className="field-input"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                aria-invalid={errors.password ? "true" : "false"}
                                aria-describedby={errors.password ? "password-error" : undefined}
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                            {errors.password && (
                                <p id="password-error" role="alert" className="field-error">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {serverError && (
                            <div className="server-error-box" role="alert">
                                {serverError}
                            </div>
                        )}

                        <button
                            id="login-submit"
                            type="submit"
                            className="btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <span className="btn-spinner" aria-hidden="true" />}
                            {isSubmitting ? "Authenticating…" : "Sign In"}
                        </button>
                    </form>

                    <div className="login-hint">
                        <p className="login-hint-title">Demo Credentials</p>
                        <div className="login-hint-row">
                            <strong>Admin —</strong> admin@deskline.com / adminpass123
                        </div>
                        <div className="login-hint-row">
                            <strong>User —</strong> user@deskline.com / userpass123
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}