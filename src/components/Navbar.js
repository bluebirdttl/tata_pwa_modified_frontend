import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

export default function Navbar({ user, onLogout, title = "Employee Dashboard" }) {
    const navigate = useNavigate()
    const [profileOpen, setProfileOpen] = useState(false)
    const profileRef = useRef(null)

    // mobile detection
    const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth <= 900 : false)
    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth <= 900)
        window.addEventListener("resize", onResize)
        return () => window.removeEventListener("resize", onResize)
    }, [])

    // close profile dropdown on outside click / ESC
    useEffect(() => {
        function handleOutside(e) {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false)
            }
        }
        function handleEsc(e) {
            if (e.key === "Escape") setProfileOpen(false)
        }
        document.addEventListener("mousedown", handleOutside)
        document.addEventListener("keydown", handleEsc)
        return () => {
            document.removeEventListener("mousedown", handleOutside)
            document.removeEventListener("keydown", handleEsc)
        }
    }, [])

    const getInitials = (name) => {
        if (!name) return "U"
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
    }

    const getInitialsColor = (nm) => {
        const colors = ["#0072bc", "#d32f2f", "#2e7d32", "#f57c00", "#7b1fa2"]
        const n = (nm || " ").toString()
        let hash = 0
        for (let i = 0; i < n.length; i++) {
            hash = n.charCodeAt(i) + ((hash << 5) - hash)
        }
        return colors[Math.abs(hash) % colors.length]
    }

    const profileName = (user && (user.name || "")) || "User"
    const profileInitials = getInitials(profileName)
    const profileBg = getInitialsColor(profileName)

    const handleLogoClick = () => {
        if ((user?.role_type || "").trim().toLowerCase() === "manager") {
            navigate("/home")
        } else {
            navigate("/details")
        }
    }
    const styles = {
        header: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(90deg, #016db9 0%, #0078d4 100%)", // Consistent with Detail/Profile
            color: "white",
            padding: isMobile ? "10px 12px" : "12px 16px",
            borderRadius: "8px",
            marginBottom: "16px",
            gap: "12px",
        },
        titleRow: { display: "flex", alignItems: "center", gap: 12, flex: 1 },
        title: { margin: 0, fontSize: isMobile ? 18 : 20, fontWeight: "600" },
        rightArea: { display: "flex", alignItems: "center", gap: "12px" },
        profileButton: {
            width: isMobile ? 40 : 44,
            height: isMobile ? 40 : 44,
            borderRadius: "50%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: "2px solid rgba(255,255,255,0.12)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
            userSelect: "none",
            background: profileBg,
        },
        profileInitials: {
            color: "white",
            fontWeight: 700,
            fontSize: isMobile ? 14 : 16,
            lineHeight: 1,
        },
        profileMenu: {
            position: "absolute",
            right: 0,
            top: isMobile ? 50 : 54,
            background: "white",
            borderRadius: 8,
            boxShadow: "0 8px 28px rgba(2,6,23,0.12)",
            minWidth: 160,
            zIndex: 60,
            overflow: "hidden",
            border: "1px solid #e9eef6",
        },
        profileMenuItem: {
            padding: "10px 12px",
            cursor: "pointer",
            fontSize: 14,
            color: "#0b5fa5",
            display: "flex",
            alignItems: "center",
            gap: 8,
        },
    }

    return (
        <header style={styles.header}>
            <div style={styles.titleRow}>
                <img
                    src="/Logo/MainLogo.png"
                    alt="Main Logo"
                    style={{ height: isMobile ? 40 : 50, marginRight: 12, objectFit: "contain", background: "white", borderRadius: 4, cursor: "pointer" }}
                    onClick={handleLogoClick}
                />
                <h1 style={styles.title}>{title}</h1>
            </div>

            <div style={styles.rightArea}>
                <div
                    onClick={() => alert("you have received the following notification")}
                    style={{ marginRight: 16, cursor: "pointer", display: "flex", alignItems: "center", color: "white" }}
                    title="Notifications"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                </div>

                <div style={{ position: "relative" }} ref={profileRef}>
                    <div
                        onClick={(e) => {
                            e.stopPropagation()
                            setProfileOpen((s) => !s)
                        }}
                        role="button"
                        aria-haspopup="true"
                        aria-expanded={profileOpen}
                        style={styles.profileButton}
                        title={profileName}
                    >
                        <span style={styles.profileInitials}>{profileInitials}</span>
                    </div>

                    {profileOpen && (
                        <div style={styles.profileMenu} role="menu" aria-label="Profile menu">
                            <div
                                onClick={() => {
                                    setProfileOpen(false)
                                    navigate("/profile")
                                }}
                                style={styles.profileMenuItem}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f8ff")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                                <span style={{ width: 18, textAlign: "center" }}>👤</span>
                                <span>Profile</span>
                            </div>

                            {(user?.role_type || "").trim().toLowerCase() !== "manager" && (
                                <div
                                    onClick={() => {
                                        setProfileOpen(false)
                                        navigate("/details")
                                    }}
                                    style={styles.profileMenuItem}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f8ff")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                >
                                    <span style={{ width: 18, textAlign: "center" }}>📋</span>
                                    <span>Details</span>
                                </div>
                            )}

                            <div
                                onClick={() => {
                                    setProfileOpen(false)
                                    window.open("https://forms.office.com/Pages/ResponsePage.aspx?id=YHed29djiE-ZJ_q-RG4jYu30tAiE4QZGndZ48sb8fWhUOTAxN0RFT0RCRzVXUDZYWEc1RUhORE1RSi4u&fswReload=1&fswNavStart=1764070424016", "_blank")
                                }}
                                style={styles.profileMenuItem}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f8ff")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                                <span style={{ width: 18, textAlign: "center" }}>💬</span>
                                <span>Feedback</span>
                            </div>

                            <div
                                onClick={() => {
                                    setProfileOpen(false)
                                    navigate("/reset-password")
                                }}
                                style={styles.profileMenuItem}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f8ff")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                                <span style={{ width: 18, textAlign: "center" }}>🔑</span>
                                <span>Reset Password</span>
                            </div>

                            <div
                                onClick={() => {
                                    setProfileOpen(false)
                                    onLogout && onLogout()
                                }}
                                style={styles.profileMenuItem}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f8ff")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                                <span style={{ width: 18, textAlign: "center" }}>🔒</span>
                                <span>Logout</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
