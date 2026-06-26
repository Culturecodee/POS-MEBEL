import React from "react";
import { usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { IconHome, IconLogout, IconMenu2, IconMoon, IconSun } from "@tabler/icons-react";
import Menu from "@/Utils/Menu";
import Notification from "@/Components/Dashboard/Notification";

export default function Navbar({
    toggleSidebar,
    toggleMobileSidebar,
    themeSwitcher,
    darkMode,
}) {
    const { auth } = usePage().props;
    const menuNavigation = Menu();

    // Get current page title
    const links = menuNavigation.flatMap((item) => item.details);
    const sublinks = links
        .filter((item) => item.hasOwnProperty("subdetails"))
        .flatMap((item) => item.subdetails);

    const getCurrentTitle = () => {
        for (const link of links) {
            if (link.hasOwnProperty("subdetails")) {
                const activeSublink = sublinks.find((s) => s.active);
                if (activeSublink) return activeSublink.title;
            } else if (link.active) {
                return link.title;
            }
        }
        return auth?.customer ? "" : "Dashboard";
    };

    const currentTitle = getCurrentTitle();
    const dashboardRoute =
        auth?.customer || auth?.regular
            ? `${route("products.index")}#home`
            : route("dashboard");

    return (
        <header
            className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 md:px-6
            bg-[#fffaf3]/95 dark:bg-slate-900
            border-b border-[#eadbca] dark:border-slate-800
            backdrop-blur
            transition-colors duration-200"
        >
            {/* Left Section */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleMobileSidebar}
                    className="md:hidden p-2 rounded-lg text-[#8f735e] hover:text-[#6f4b36] hover:bg-[#f4eadf] dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                    title="Buka Menu"
                >
                    <IconMenu2 size={20} strokeWidth={1.5} />
                </button>

                {/* Sidebar Toggle */}
                <button
                    onClick={toggleSidebar}
                    className="hidden md:flex p-2 rounded-lg text-[#8f735e] hover:text-[#6f4b36] hover:bg-[#f4eadf] dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                    title="Toggle Sidebar"
                >
                    <IconMenu2 size={20} strokeWidth={1.5} />
                </button>

                {/* Mobile Logo */}
                <div className="md:hidden flex items-center gap-2">
                    <img
                        src="/images/aisyah-logo.jpg"
                        alt="Aisyah Dekorasi"
                        className="h-7 w-7 rounded-lg object-cover ring-1 ring-[#e7d8c8]"
                    />
                    <span className="text-sm font-bold text-[#5c4131] dark:text-white">
                        Aisyah Dekorasi
                    </span>
                </div>

                {/* Current Page Title */}
                {currentTitle && (
                    <div className="hidden md:flex items-center">
                        <div className="w-px h-6 bg-[#e4d3c2] dark:bg-slate-700 mr-4" />
                        <h1 className="text-base font-semibold text-[#5c4131] dark:text-slate-200">
                            {currentTitle}
                        </h1>
                    </div>
                )}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
                <Link
                    href={dashboardRoute}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#eadbca] bg-[#fff6ec] px-3 py-2.5 text-sm font-medium text-[#8f735e] hover:bg-[#f4eadf] hover:text-[#6f4b36] dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                    title="Dashboard"
                >
                    <IconHome size={18} strokeWidth={1.6} />
                    <span className="hidden sm:inline">Dashboard</span>
                </Link>

                {/* Theme Toggle */}
                <button
                    onClick={themeSwitcher}
                    className="p-2.5 rounded-xl text-[#8f735e] hover:text-[#6f4b36] hover:bg-[#f4eadf] dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                    title={darkMode ? "Light Mode" : "Dark Mode"}
                >
                    {darkMode ? (
                        <IconSun
                            size={20}
                            strokeWidth={1.5}
                            className="text-amber-500"
                        />
                    ) : (
                        <IconMoon size={20} strokeWidth={1.5} />
                    )}
                </button>

                {/* Notifications */}
                <Notification />

                <div className="hidden sm:flex items-center gap-2 rounded-xl border border-[#eadbca] bg-[#fff6ec] px-3 py-2 dark:border-slate-700 dark:bg-slate-800/80">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-[#5c4131] dark:text-slate-200">
                            {auth.user.name}
                        </p>
                        <p className="text-xs text-[#9a836f] dark:text-slate-400">
                            Akun Aktif
                        </p>
                    </div>
                </div>

                <Link
                    href={route("logout")}
                    method="post"
                    as="button"
                    className="flex items-center justify-center rounded-xl border border-[#eadbca] bg-[#fff6ec] p-2.5 text-[#8f735e] hover:bg-[#f4eadf] hover:text-[#6f4b36] dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                    title="Logout"
                >
                    <IconLogout size={18} strokeWidth={1.6} />
                </Link>
            </div>
        </header>
    );
}
