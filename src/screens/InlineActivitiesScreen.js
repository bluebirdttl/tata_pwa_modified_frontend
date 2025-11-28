import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../config"
import PageLayout from "../components/PageLayout"
import { theme } from "../utils/theme"

export default function InlineActivitiesScreen({ onLogout }) {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)

    // Data State
    const [projects, setProjects] = useState([])
    const [filteredProjects, setFilteredProjects] = useState([])
    const [loading, setLoading] = useState(true)

    // Filter State
    const [statusFilter, setStatusFilter] = useState("All")
    const [expandedProjectId, setExpandedProjectId] = useState(null)

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user")
        if (!storedUser) {
            navigate("/")
            return
        }
        setUser(JSON.parse(storedUser))
        fetchProjects()
    }, [navigate])

    const fetchProjects = async () => {
        try {
            const res = await fetch(`${API_URL}/api/projects`)
            if (res.ok) {
                const data = await res.json()
                setProjects(data)
                setFilteredProjects(data)
            }
        } catch (err) {
            console.error("Failed to fetch projects", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (statusFilter === "All") {
            setFilteredProjects(projects)
        } else {
            setFilteredProjects(projects.filter(p => p.status === statusFilter))
        }
    }, [statusFilter, projects])

    const styles = {
        controls: {
            marginBottom: "24px",
            display: "flex",
            gap: "12px",
            alignItems: "center",
            background: theme.colors.surface,
            padding: "16px",
            borderRadius: theme.borderRadius.lg,
            boxShadow: theme.shadows.card,
            border: `1px solid ${theme.colors.border}`,
        },
        label: {
            fontWeight: "600",
            color: theme.colors.text.primary,
        },
        select: {
            padding: "8px 12px",
            borderRadius: theme.borderRadius.sm,
            border: `1px solid ${theme.colors.border}`,
            fontSize: "14px",
            outline: "none",
            cursor: "pointer",
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px",
        },
        card: (status) => {
            let borderColor = theme.colors.border
            let borderTopColor = theme.colors.border

            if (status === "Open") {
                borderTopColor = theme.colors.success // Green
            } else if (status === "Ongoing") {
                borderTopColor = theme.colors.warning // Yellow
            } else if (status === "Closed") {
                borderTopColor = "#9ca3af" // Grey
            }

            return {
                background: theme.colors.surface,
                borderRadius: theme.borderRadius.lg,
                boxShadow: theme.shadows.card,
                border: `1px solid ${borderColor}`,
                borderTop: `4px solid ${borderTopColor}`,
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                gap: "12px",
                transition: "transform 0.2s ease",
                cursor: "pointer",
            }
        },
        cardTitle: {
            fontSize: "18px",
            fontWeight: "700",
            color: theme.colors.text.primary,
            margin: 0,
        },
        cardSubtitle: {
            fontSize: "13px",
            color: theme.colors.text.secondary,
            marginBottom: "8px",
        },
        tag: {
            display: "inline-block",
            padding: "4px 8px",
            background: theme.colors.background,
            borderRadius: "4px",
            fontSize: "12px",
            color: theme.colors.text.secondary,
            marginRight: "6px",
            marginBottom: "6px",
        },
        description: {
            fontSize: "14px",
            color: theme.colors.text.primary,
            lineHeight: "1.5",
        },
        footer: {
            marginTop: "auto",
            paddingTop: "12px",
            borderTop: `1px solid ${theme.colors.border}`,
            fontSize: "12px",
            color: theme.colors.text.secondary,
            display: "flex",
            justifyContent: "space-between",
        }
    }

    return (
        <PageLayout user={user} title="Inline Activities" onLogout={onLogout}>
            <div style={styles.controls}>
                <span style={styles.label}>Filter by Status:</span>
                <select style={styles.select} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="All">All Projects</option>
                    <option value="Open">Open</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Closed">Closed</option>
                </select>
            </div>

            {loading ? (
                <div>Loading activities...</div>
            ) : filteredProjects.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: theme.colors.text.secondary }}>
                    No activities found matching your criteria.
                </div>
            ) : (
                <div style={styles.grid}>
                    {filteredProjects.map((p, i) => (
                        <div
                            key={i}
                            style={styles.card(p.status)}
                            onClick={() => setExpandedProjectId(expandedProjectId === p.id ? null : p.id)}
                        >
                            <div>
                                <h3 style={styles.cardTitle}>{p.project_name}</h3>
                                <div style={styles.cardSubtitle}>Led by {p.leader_name}</div>
                            </div>

                            {expandedProjectId === p.id && (
                                <div style={styles.description}>{p.description}</div>
                            )}

                            <div>
                                {(Array.isArray(p.required_skills) ? p.required_skills : JSON.parse(p.required_skills || "[]")).map((s, idx) => (
                                    s.trim() && <span key={idx} style={styles.tag}>{s.trim()}</span>
                                ))}
                            </div>

                            <div style={styles.footer}>
                                <span>Ends: {p.end_date}</span>
                                <span style={{ fontWeight: "600" }}>{p.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </PageLayout>
    )
}
