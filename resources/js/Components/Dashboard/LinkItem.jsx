import React from "react";
import { Link, usePage } from "@inertiajs/react";

export default function LinkItem({
    href,
    icon,
    access,
    title,
    sidebarOpen,
    ...props
}) {
    const { url } = usePage();
    const { auth } = usePage().props;
    const [hrefPath, hrefHash] = href.split("#");
    const currentHash =
        typeof window !== "undefined" ? window.location.hash : "";

    const isActive = hrefHash
        ? url.startsWith(hrefPath) && currentHash === `#${hrefHash}`
        : url.startsWith(href);
    const canAccess = auth.super === true || access === true;

    if (!canAccess) return null;

    const baseClasses = `
        flex items-center gap-3
        transition-all duration-200
        text-[#7e6653] dark:text-slate-400
    `;

    const activeClasses = isActive
        ? "bg-[#f3eadf] dark:bg-primary-950/50 text-[#6f4b36] dark:text-primary-400 border-l-[3px] border-[#a8835c]"
        : "hover:bg-[#f7efe6] dark:hover:bg-slate-800 hover:text-[#5c4131] dark:hover:text-slate-200 border-l-[3px] border-transparent";

    if (sidebarOpen) {
        return (
            <Link
                href={href}
                className={`${baseClasses} ${activeClasses} px-4 py-2.5 text-sm font-medium`}
                {...props}
            >
                <span
                    className={
                        isActive ? "text-[#8e6b49] dark:text-primary-400" : ""
                    }
                >
                    {icon}
                </span>
                <span className="truncate">{title}</span>
            </Link>
        );
    }

    // Collapsed sidebar
    return (
        <Link
            href={href}
            className={`
                w-full flex justify-center py-3
                transition-all duration-200
                ${
                    isActive
                        ? "text-[#8e6b49] dark:text-primary-400 bg-[#f3eadf] dark:bg-primary-950/50"
                        : "text-[#8f735e] dark:text-slate-400 hover:text-[#6f4b36] dark:hover:text-slate-200 hover:bg-[#f7efe6] dark:hover:bg-slate-800"
                }
            `}
            title={title}
            {...props}
        >
            {icon}
        </Link>
    );
}
