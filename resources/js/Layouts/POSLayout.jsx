import React, { useState, useEffect } from "react";
import { usePage, Link } from "@inertiajs/react";
import { Toaster } from "react-hot-toast";
import { useTheme } from "@/Context/ThemeSwitcherContext";
import {
    IconHome,
    IconHistory,
    IconPackage,
    IconSun,
    IconMoon,
    IconLogout,
    IconMenu2,
    IconX,
} from "@tabler/icons-react";

export default function POSLayout({ children }) {
    const { auth } = usePage().props;
    const { darkMode, themeSwitcher } = useTheme();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const isCustomerView = Boolean(auth?.customer || auth?.regular);
    const dashboardRoute = isCustomerView
        ? `${route("products.index")}#home`
        : route("dashboard");
    const productRoute = isCustomerView
        ? `${route("products.index")}#produk`
        : route("transactions.index");
    const homeRoute = isCustomerView ? route("products.index") : route("dashboard");
    const brandLabel = isCustomerView ? "AISYAH DEKORASI" : "AISYAH DEKORASI";
    const roleLabel = isCustomerView ? "Customer" : "Kasir";

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f9f4ec] dark:bg-slate-950">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 h-16 flex items-center justify-between px-4 lg:px-6 bg-[#fffaf3]/95 dark:bg-slate-900 border-b border-[#eadbca] dark:border-slate-800 shadow-sm backdrop-blur">
                {/* Left Section - Logo & Time */}
                <div className="flex items-center gap-4 lg:gap-6">
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="lg:hidden p-2 rounded-lg hover:bg-[#f4eadf] dark:hover:bg-slate-800 transition-colors"
                    >
                        {showMobileMenu ? (
                            <IconX
                                size={22}
                                className="text-[#7e6653] dark:text-slate-400"
                            />
                        ) : (
                            <IconMenu2
                                size={22}
                                className="text-[#7e6653] dark:text-slate-400"
                            />
                        )}
                    </button>

                    {/* Logo */}
                    <Link
                        href={homeRoute}
                        className="flex items-center gap-2"
                    >
                        <img
                            src="/images/aisyah-logo.jpg"
                            alt="Aisyah Dekorasi"
                            className="h-8 w-8 rounded-lg object-cover ring-1 ring-[#e7d8c8]"
                        />
                        <span className="hidden sm:block text-lg font-bold text-[#5c4131] dark:text-white">
                            {brandLabel}
                        </span>
                    </Link>

                    {/* Divider */}
                    <div className="hidden md:block w-px h-8 bg-[#e4d3c2] dark:bg-slate-700" />

                    {/* Time & Date */}
                    <div className="hidden md:flex items-center gap-3">
                        <div className="text-2xl font-semibold text-[#5c4131] dark:text-white tabular-nums">
                            {formatTime(currentTime)}
                        </div>
                        <div className="text-sm text-[#9a836f] dark:text-slate-400">
                            {formatDate(currentTime)}
                        </div>
                    </div>
                </div>

                {/* Right Section - Actions & User */}
                <div className="flex items-center gap-2 lg:gap-3">
                    {/* Quick Actions */}
                    <nav className="hidden lg:flex items-center gap-1">
                        <Link
                            href={dashboardRoute}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#7e6653] hover:text-[#5c4131] hover:bg-[#f4eadf] dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
                        >
                            <IconHome size={18} />
                            <span>Dashboard</span>
                        </Link>
                        {isCustomerView ? (
                            <Link
                                href={productRoute}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#7e6653] hover:text-[#5c4131] hover:bg-[#f4eadf] dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
                            >
                                <IconPackage size={18} />
                                <span>Produk</span>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("transactions.history")}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#7e6653] hover:text-[#5c4131] hover:bg-[#f4eadf] dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
                                >
                                    <IconHistory size={18} />
                                    <span>Riwayat</span>
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Divider */}
                    <div className="hidden lg:block w-px h-8 bg-[#e4d3c2] dark:bg-slate-700" />

                    {/* Theme Toggle */}
                    <button
                        onClick={themeSwitcher}
                        className="p-2.5 rounded-lg hover:bg-[#f4eadf] dark:hover:bg-slate-800 transition-colors min-w-touch min-h-touch flex items-center justify-center"
                        title={darkMode ? "Light Mode" : "Dark Mode"}
                    >
                        {darkMode ? (
                            <IconSun size={20} className="text-amber-500" />
                        ) : (
                            <IconMoon size={20} className="text-[#7e6653]" />
                        )}
                    </button>

                    {/* User Info */}
                    <div className="flex items-center gap-3 pl-2 lg:pl-3 border-l border-[#e4d3c2] dark:border-slate-700">
                        <div className="text-right">
                            <p className="text-sm font-medium text-[#5c4131] dark:text-slate-200">
                                {auth.user.name}
                            </p>
                            <p className="text-xs text-[#9a836f] dark:text-slate-400">
                                {roleLabel}
                            </p>
                        </div>
                    </div>

                    {/* Logout */}
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="hidden lg:flex p-2.5 rounded-lg text-[#7e6653] hover:text-[#8a4f35] hover:bg-[#f6e8de] dark:hover:bg-[#6a3f2d]/40 transition-colors min-w-touch min-h-touch items-center justify-center"
                        title="Logout"
                    >
                        <IconLogout size={20} />
                    </Link>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {showMobileMenu && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/50"
                    onClick={() => setShowMobileMenu(false)}
                >
                    <div
                        className="absolute top-16 left-0 right-0 bg-[#fffaf3] dark:bg-slate-900 border-b border-[#eadbca] dark:border-slate-800 shadow-lg animate-slide-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <nav className="p-4 space-y-2">
                            <Link
                                href={dashboardRoute}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#6f4b36] hover:bg-[#f4eadf] dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                            >
                                <IconHome size={20} />
                                <span className="font-medium">Dashboard</span>
                            </Link>
                            {isCustomerView ? (
                                <Link
                                    href={productRoute}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#6f4b36] hover:bg-[#f4eadf] dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <IconPackage size={20} />
                                    <span className="font-medium">Produk</span>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route("transactions.history")}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#6f4b36] hover:bg-[#f4eadf] dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <IconHistory size={20} />
                                        <span className="font-medium">
                                            Riwayat Transaksi
                                        </span>
                                    </Link>
                                </>
                            )}
                            <hr className="border-[#eadbca] dark:border-slate-700" />
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#8a4f35] hover:bg-[#f6e8de] dark:hover:bg-[#6a3f2d]/40 transition-colors w-full"
                            >
                                <IconLogout size={20} />
                                <span className="font-medium">Keluar</span>
                            </Link>
                        </nav>
                    </div>
                </div>
            )}

            {/* Main Content - Full Height */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden">
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
                        },
                    }}
                />
                {children}
            </main>
        </div>
    );
}
