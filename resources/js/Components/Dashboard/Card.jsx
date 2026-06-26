import React from "react";

export default function Card({
    icon,
    title,
    children,
    footer,
    className,
    form,
}) {
    const CardWrapper = form ? "form" : "div";
    const wrapperProps = form ? { onSubmit: form } : {};

    return (
        <CardWrapper {...wrapperProps}>
            {/* Header */}
            <div
                className={`px-5 py-4 rounded-t-2xl border border-b-0 ${className} bg-[#fffaf3] dark:bg-slate-900 border-[#e7d8c5] dark:border-slate-800`}
            >
                <div className="flex items-center gap-2.5">
                    {icon && (
                        <div className="w-8 h-8 rounded-lg bg-[#f3eadf] dark:bg-primary-900/50 flex items-center justify-center text-[#8e6b49] dark:text-primary-400">
                            {icon}
                        </div>
                    )}
                    <h3 className="font-semibold text-base text-[#5c4131] dark:text-slate-200">
                        {title}
                    </h3>
                </div>
            </div>

            {/* Content */}
            <div className="bg-[#fffdf9] dark:bg-slate-900 px-5 py-5 border-x border-[#e7d8c5] dark:border-slate-800">
                {children}
            </div>

            {/* Footer */}
            {footer && (
                <div
                    className={`px-5 py-4 rounded-b-2xl border border-t-0 ${className} bg-[#f7efe6] dark:bg-slate-800/50 border-[#e7d8c5] dark:border-slate-800`}
                >
                    {footer}
                </div>
            )}
        </CardWrapper>
    );
}
