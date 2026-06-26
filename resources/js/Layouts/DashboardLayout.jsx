import React, { useEffect, useState } from "react";
import Sidebar from "@/Components/Dashboard/Sidebar";
import Navbar from "@/Components/Dashboard/Navbar";
import { Toaster } from "react-hot-toast";
import { useTheme } from "@/Context/ThemeSwitcherContext";

export default function AppLayout({ children }) {
    const { darkMode, themeSwitcher } = useTheme();

    const [sidebarOpen, setSidebarOpen] = useState(
        localStorage.getItem("sidebarOpen") === "true"
    );
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem("sidebarOpen", sidebarOpen);
    }, [sidebarOpen]);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const toggleMobileSidebar = () => setMobileSidebarOpen((prev) => !prev);
    const closeMobileSidebar = () => setMobileSidebarOpen(false);

    return (
        <div className="min-h-screen flex bg-[#f9f4ec] dark:bg-slate-950 transition-colors duration-200">
            {mobileSidebarOpen && (
                <button
                    type="button"
                    aria-label="Tutup menu"
                    className="fixed inset-0 z-40 bg-[#2b211c]/45 backdrop-blur-[1px] md:hidden"
                    onClick={closeMobileSidebar}
                />
            )}

            <Sidebar
                sidebarOpen={sidebarOpen}
                mobileOpen={mobileSidebarOpen}
                onCloseMobile={closeMobileSidebar}
            />
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <Navbar
                    toggleSidebar={toggleSidebar}
                    toggleMobileSidebar={toggleMobileSidebar}
                    themeSwitcher={themeSwitcher}
                    darkMode={darkMode}
                />
                <main className="flex-1 overflow-y-auto">
                    <div className="w-full px-4 py-6 pb-20 md:px-6 md:pb-6 lg:px-8">
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                className: "text-sm",
                                duration: 3000,
                                style: {
                                    background: darkMode ? "#2b211c" : "#fffaf3",
                                    color: darkMode ? "#f6ecdd" : "#5c4131",
                                    border: `1px solid ${
                                        darkMode ? "#6f4b36" : "#e2d1c0"
                                    }`,
                                    borderRadius: "12px",
                                },
                            }}
                        />
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
