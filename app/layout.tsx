'use client';

import { useState, useEffect } from "react";
import "./styles/globals.less";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    // Переключение темы
    const toggleTheme = () => {
        const nextTheme = theme === "light" ? "dark" : "light";
        setTheme(nextTheme);
        document.documentElement.setAttribute("data-theme", nextTheme);
    };

    return (
        <html lang="ru" data-theme={theme}>
            <body>
                <header style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem 2rem",
                    borderBottom: "1px solid var(--border-color)",
                    backgroundColor: "var(--card-bg)"
                }}>
                    <span style={{ fontWeight: "bold", fontSize: "1.2rem", color: "var(--accent)" }}>
                        TaskTracker
                    </span>
                    <button
                        onClick={toggleTheme}
                        style={{ padding: "0.5rem 1rem", backgroundColor: "transparent" }}
                        aria-label="Переключить тему"
                    >
                        {theme === "light" ? "🌙 Темная" : "☀️ Светлая"}
                    </button>
                </header>

                {children}
            </body>
        </html>
    );
}