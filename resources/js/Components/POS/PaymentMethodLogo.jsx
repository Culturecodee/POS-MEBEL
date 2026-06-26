import React from "react";
import { IconBrandWhatsapp, IconCash } from "@tabler/icons-react";

const paymentLogoMap = {
    dana: "/images/payments/dana.svg",
    bank_bri: "/images/payments/bri.jfif",
    bank_bca: "/images/payments/bca.svg",
    bank_mandiri: "/images/payments/mandiri.svg",
    bank_bni: "/images/payments/bni.svg",
    midtrans: "/images/payments/midtrans.svg",
    xendit: "/images/payments/xendit.svg",
};

export default function PaymentMethodLogo({
    method,
    label,
    selected = false,
    className = "",
}) {
    if (method === "cash") {
        return (
            <div
                className={`flex items-center justify-center rounded-xl ${
                    selected
                        ? "bg-[#7b563f] text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300"
                } ${className}`}
            >
                <IconCash size={18} />
            </div>
        );
    }

    if (method === "whatsapp") {
        return (
            <div
                className={`flex items-center justify-center rounded-xl ${
                    selected
                        ? "bg-[#25d366] text-white"
                        : "bg-[#e8f7ee] text-[#1f8f4d] dark:bg-[#173826] dark:text-[#7ce2a4]"
                } ${className}`}
            >
                <IconBrandWhatsapp size={18} />
            </div>
        );
    }

    const logoSrc = paymentLogoMap[method];

    if (logoSrc) {
        return (
            <div
                className={`overflow-hidden rounded-xl border ${
                    selected
                        ? "border-[#dcc9b5] bg-white"
                        : "border-slate-200 bg-white dark:border-slate-700"
                } ${className}`}
            >
                <img
                    src={logoSrc}
                    alt={label}
                    className="h-full w-full object-contain p-1.5"
                />
            </div>
        );
    }

    return (
        <div
            className={`flex items-center justify-center rounded-xl border text-[10px] font-bold uppercase tracking-wide ${
                selected
                    ? "border-[#dcc9b5] bg-white text-[#7b563f]"
                    : "border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            } ${className}`}
        >
            {label}
        </div>
    );
}
