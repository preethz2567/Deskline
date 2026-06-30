import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface Ticket {
    id: number;
    ownerId: number;
    title: string;
    status: string;
}

export function Admin() {
    const { token, logout } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchAllTickets() {
            try {
                const response = await axios.get("http://localhost:4000/tickets/all", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTickets(response.data);
            } catch {
                setError("Could not load tickets. Check your connection and try again.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchAllTickets();
    }, [token]);

    const openCount = tickets.filter(t => t.status === "open").length;
    const closedCount = tickets.filter(t => t.status === "closed").length;
    const uniqueUsers = new Set(tickets.map(t => t.ownerId)).size;

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
                <span className="navbar-section">Admin Dashboard</span>

                <div className="navbar-spacer" />

                <div className="navbar-user">
                    <div className="navbar-user-info">
                        <div className="navbar-user-name">Administrator</div>
                        <div className="navbar-user-role">admin</div>
                    </div>
                    <button id="admin-logout-btn" onClick={logout} className="btn-logout">
                        Sign Out
                    </button>
                </div>
            </nav>

            {/* ── Content ── */}
            <main className="page-content">
                <div className="page-heading">
                    <p className="page-heading-eyebrow">Administration</p>
                    <h1 className="page-heading-title">All Support Tickets</h1>
                    <p className="page-heading-sub">
                        Global view of every ticket across all users and accounts.
                    </p>
                </div>

                {/* Stats row */}
                {!isLoading && !error && (
                    <div className="stats-row">
                        <div className="stat-card stat-card-accent">
                            <div className="stat-card-value">{tickets.length}</div>
                            <div className="stat-card-label">Total Tickets</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card-value">{openCount}</div>
                            <div className="stat-card-label">Open</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card-value">{closedCount}</div>
                            <div className="stat-card-label">Closed</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card-value">{uniqueUsers}</div>
                            <div className="stat-card-label">Users</div>
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
                        <p className="empty-state-title">No tickets in the system</p>
                        <p className="empty-state-sub">Tickets will appear here once users start submitting them.</p>
                    </div>
                )}

                {!isLoading && !error && tickets.length > 0 && (
                    <div className="data-table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Owner ID</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((t) => (
                                    <tr key={t.id}>
                                        <td className="col-id">#{t.id}</td>
                                        <td className="col-title">{t.title}</td>
                                        <td>User {t.ownerId}</td>
                                        <td>
                                            <span className={`status-badge status-${t.status}`}>
                                                {t.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}