import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface Ticket {
    id: number;
    ownerId: number;
    title: string;
    status: string;
}

export function Tickets() {
    const { token, user, logout } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTickets() {
            try {
                const response = await axios.get("http://localhost:4000/tickets", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTickets(response.data);
            } catch {
                setError("Could not load your tickets. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchTickets();
    }, [token]);

    const openCount = tickets.filter(t => t.status === "open").length;
    const closedCount = tickets.filter(t => t.status === "closed").length;

    return (
        <div className="app-shell">
            {/* ── Navbar ── */}
            <nav className="navbar">
                <a href="/" className="navbar-brand">
                    <div className="navbar-logo-mark">
                        <svg viewBox="0 0 24 24">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                    <span className="navbar-brand-text">Deskline</span>
                </a>
                <div className="navbar-divider" />
                <span className="navbar-section">My Tickets</span>

                <div className="navbar-spacer" />

                <div className="navbar-user">
                    {user && (
                        <div className="navbar-user-info">
                            <div className="navbar-user-name">{user.name}</div>
                            <div className="navbar-user-role">{user.role}</div>
                        </div>
                    )}
                    <button id="logout-btn" onClick={logout} className="btn-logout">
                        Sign Out
                    </button>
                </div>
            </nav>

            {/* ── Content ── */}
            <main className="page-content">
                <div className="page-heading">
                    <p className="page-heading-eyebrow">Workspace</p>
                    <h1 className="page-heading-title">My Tickets</h1>
                    <p className="page-heading-sub">
                        Track the status of all your submitted support requests.
                    </p>
                </div>

                {/* Stats row */}
                {!isLoading && !error && (
                    <div className="stats-row">
                        <div className="stat-card stat-card-accent">
                            <div className="stat-card-value">{tickets.length}</div>
                            <div className="stat-card-label">Total</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card-value">{openCount}</div>
                            <div className="stat-card-label">Open</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card-value">{closedCount}</div>
                            <div className="stat-card-label">Closed</div>
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className="status-row" role="status">
                        Loading tickets…
                    </div>
                )}

                {error && (
                    <div className="error-row" role="alert">
                        {error}
                    </div>
                )}

                {!isLoading && !error && tickets.length === 0 && (
                    <div className="empty-state">
                        <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="empty-state-title">No tickets yet</p>
                        <p className="empty-state-sub">Your support requests will appear here once submitted.</p>
                    </div>
                )}

                {!isLoading && !error && tickets.length > 0 && (
                    <ul className="ticket-list">
                        {tickets.map((t) => (
                            <li key={t.id} className="ticket-row">
                                <div>
                                    <div className="ticket-row-title">{t.title}</div>
                                    <div className="ticket-row-meta">Ticket #{t.id}</div>
                                </div>
                                <span className={`status-badge status-${t.status}`}>
                                    {t.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}

                {user?.role === "admin" && (
                    <div className="info-block">
                        You have administrator access —{" "}
                        <a href="/admin">open the Admin Dashboard</a> to view tickets across all users.
                    </div>
                )}
            </main>
        </div>
    );
}