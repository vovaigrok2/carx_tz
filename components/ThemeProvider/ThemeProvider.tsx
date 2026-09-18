'use client';

import { useEffect } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const savedTheme = localStorage.getItem("app_theme");
        if (savedTheme === "dark") {
            document.documentElement.setAttribute("data-theme", "dark");
        } else {
            document.documentElement.removeAttribute("data-theme");
        }
    }, []);

    return <>{children}</>;
}