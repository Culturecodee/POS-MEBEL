import React from "react";
import { usePage } from "@inertiajs/react";
import { IconX } from "@tabler/icons-react";
import LinkItem from "@/Components/Dashboard/LinkItem";
import LinkItemDropdown from "@/Components/Dashboard/LinkItemDropdown";
import Menu from "@/Utils/Menu";

export default function Sidebar({ sidebarOpen, mobileOpen, onCloseMobile }) {
    const { auth } = usePage().props;
    const menuNavigation = Menu();
    const isExpanded = mobileOpen || sidebarOpen;

    return (
        <div
            className={`
            fixed inset-y-0 left-0 z-50 flex min-h-screen flex-col
            w-[280px] md:w-auto
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
            ${sidebarOpen ? "md:w-[260px]" : "md:w-[80px]"}
            md:static md:translate-x-0
            border-r border-[#eadbca] dark:border-slate-800
            bg-[#fffaf3] dark:bg-slate-900
            transition-all duration-300 ease-in-out
        `}
        >
            {/* Logo */}
            <div className="flex h-16 items-center justify-between border-b border-[#f0e4d7] px-4 dark:border-slate-800 md:justify-center md:px-0">
                {isExpanded ? (
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/aisyah-logo.jpg"
                            alt="Aisyah Dekorasi"
                            className="h-10 w-10 rounded-lg object-cover shadow-sm ring-1 ring-[#e7d8c8]"
                        />
                        <span className="text-base font-bold text-[#5c4131] dark:text-white">
                            Aisyah Dekorasi
                        </span>
                    </div>
                ) : (
                    <img
                        src="/images/aisyah-logo.jpg"
                        alt="Aisyah Dekorasi"
                        className="h-10 w-10 rounded-lg object-cover shadow-sm ring-1 ring-[#e7d8c8]"
                    />
                )}

                <button
                    type="button"
                    aria-label="Tutup sidebar"
                    onClick={onCloseMobile}
                    className="rounded-lg p-2 text-[#8f735e] hover:bg-[#f4eadf] md:hidden"
                >
                    <IconX size={20} />
                </button>
            </div>

            {/* User Info */}
            <div
                className={`
                p-3 border-b border-[#f0e4d7] dark:border-slate-800
                ${
                    isExpanded
                        ? "flex items-center gap-3"
                        : "flex justify-center"
                }
            `}
            >
                <img
                    src={
                        auth.user.avatar ||
                        `https://ui-avatars.com/api/?name=${auth.user.name}&background=a8835c&color=fff`
                    }
                    className={`rounded-full ring-2 ring-[#f3e7da] dark:ring-slate-800 ${
                        isExpanded ? "w-10 h-10" : "w-8 h-8"
                    }`}
                    alt={auth.user.name}
                />
                {isExpanded && (
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#5c4131] dark:text-slate-200 truncate">
                            {auth.user.name}
                        </p>
                        <p className="text-xs text-[#9a836f] dark:text-slate-400 truncate">
                            {auth.user.email}
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin">
                {menuNavigation.map((section, index) => {
                    const hasPermission = section.details.some(
                        (detail) => detail.permissions === true
                    );
                    if (!hasPermission) return null;

                    return (
                        <div key={index} className="mb-2">
                            {/* Section Title */}
                            {isExpanded && (
                                <div className="px-4 py-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#b29d89] dark:text-slate-600">
                                        {section.title}
                                    </span>
                                </div>
                            )}

                            {/* Menu Items */}
                            <div
                                className={
                                    isExpanded
                                        ? ""
                                        : "flex flex-col items-center"
                                }
                            >
                                {section.details.map((detail, idx) => {
                                    if (!detail.permissions) return null;

                                    if (detail.hasOwnProperty("subdetails")) {
                                        return (
                                            <LinkItemDropdown
                                                key={idx}
                                                title={detail.title}
                                                icon={detail.icon}
                                                data={detail.subdetails}
                                                access={detail.permissions}
                                                sidebarOpen={isExpanded}
                                            />
                                        );
                                    }

                                    return (
                                        <LinkItem
                                            key={idx}
                                            title={detail.title}
                                            icon={detail.icon}
                                            href={detail.href}
                                            access={detail.permissions}
                                            sidebarOpen={isExpanded}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </nav>

            {/* Version/Footer */}
        </div>
    );
}
