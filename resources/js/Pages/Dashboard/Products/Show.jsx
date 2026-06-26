import React, { useMemo, useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    IconArrowLeft,
    IconBrandWhatsapp,
    IconCategory,
    IconCurrencyDollar,
    IconPackage,
    IconPhoto,
} from "@tabler/icons-react";
import { getProductImageUrl } from "@/Utils/imageUrl";

const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);

const normalizeWhatsAppNumber = (value = "") => {
    const digits = String(value).replace(/\D/g, "");

    if (!digits) {
        return "";
    }

    if (digits.startsWith("0")) {
        return `62${digits.slice(1)}`;
    }

    if (digits.startsWith("62")) {
        return digits;
    }

    return digits;
};

const buildProductWhatsAppLink = (whatsappNumber, product) => {
    const normalizedNumber = normalizeWhatsAppNumber(whatsappNumber);

    if (!normalizedNumber) {
        return null;
    }

    const message = [
        "Halo Admin Aisyah Dekorasi Jepara, saya ingin menanyakan produk berikut.",
        "",
        `Nama Produk: ${product.title}`,
        `Kategori: ${product.category?.name || "-"}`,
        `Harga Jual: ${formatCurrency(product.sell_price)}`,
        `Stok: ${product.stock} barang`,
    ].join("\n");

    return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`;
};

export default function Show({ product, galleryOnly = false, backCategory = null }) {
    const { auth, settings } = usePage().props;
    const isRegularUser = Boolean(auth?.regular);
    const backLink = backCategory?.id
        ? route("categories.show", backCategory.id)
        : route("products.index");
    const backLabel = backCategory?.id ? "Kembali ke Kategori" : "Kembali ke Produk";
    const whatsappLink = buildProductWhatsAppLink(
        settings?.whatsapp_company_number || "",
        product
    );
    const galleryImages = useMemo(() => {
        const mainImage = product.image
            ? [{ id: "main", image: product.image }]
            : [];

        return [
            ...mainImage,
            ...(product.images || []).map((image) => ({
                id: image.id,
                image: image.image,
            })),
        ];
    }, [product]);
    const [activeImage, setActiveImage] = useState(
        galleryImages[0]?.image ?? null
    );

    if (galleryOnly || isRegularUser) {
        return (
            <>
                <Head title={`Galeri Produk - ${product.title}`} />

                <div className="space-y-6">
                    <div>
                        <Link
                            href={backLink}
                            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#8a5a3c] mb-3"
                        >
                            <IconArrowLeft size={16} />
                            {backLabel}
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {product.title}
                        </h1>
                    </div>

                    <div className="overflow-hidden rounded-[28px] border border-[#eadbca] bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex min-h-[420px] items-center justify-center bg-[#f8f3ec] p-4">
                            {activeImage ? (
                                <img
                                    src={getProductImageUrl(activeImage)}
                                    alt={product.title}
                                    className="max-h-[70vh] w-full object-contain"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center">
                                    <IconPhoto
                                        size={56}
                                        className="text-[#b89f88]"
                                    />
                                </div>
                            )}
                        </div>

                        {galleryImages.length > 1 && (
                            <div className="grid grid-cols-2 gap-3 border-t border-[#eadbca] p-4 sm:grid-cols-3 lg:grid-cols-5 dark:border-slate-800">
                                {galleryImages.map((image) => (
                                    <button
                                        key={image.id}
                                        type="button"
                                        onClick={() => setActiveImage(image.image)}
                                        className={`flex h-28 items-center justify-center overflow-hidden rounded-2xl border bg-[#f8f3ec] p-2 transition-all ${
                                            activeImage === image.image
                                                ? "border-[#7b563f] ring-2 ring-[#7b563f]/20"
                                                : "border-slate-200 dark:border-slate-700"
                                        }`}
                                    >
                                        <img
                                            src={getProductImageUrl(image.image)}
                                            alt={product.title}
                                            className="max-h-full w-full object-contain"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {whatsappLink && (
                        <div>
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1fb85a]"
                            >
                                <IconBrandWhatsapp size={18} />
                                Chat dengan Admin
                            </a>
                        </div>
                    )}
                </div>
            </>
        );
    }

    return (
        <>
            <Head title={`Detail Produk - ${product.title}`} />

            <div className="space-y-6">
                <div>
                    <Link
                        href={backLink}
                        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#8a5a3c] mb-3"
                    >
                        <IconArrowLeft size={16} />
                        {backLabel}
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Detail Produk
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Informasi lengkap produk yang dipilih.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
                    <div className="overflow-hidden rounded-[28px] border border-[#eadbca] bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="aspect-square bg-[#f5ede3]">
                            {activeImage ? (
                                <img
                                    src={getProductImageUrl(activeImage)}
                                    alt={product.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center">
                                    <IconPhoto
                                        size={56}
                                        className="text-[#b89f88]"
                                    />
                                </div>
                            )}
                        </div>
                        {galleryImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-3 border-t border-[#eadbca] p-4 dark:border-slate-800">
                                {galleryImages.map((image) => (
                                    <button
                                        key={image.id}
                                        type="button"
                                        onClick={() => setActiveImage(image.image)}
                                        className={`overflow-hidden rounded-xl border transition-all ${
                                            activeImage === image.image
                                                ? "border-[#7b563f] ring-2 ring-[#7b563f]/20"
                                                : "border-slate-200 dark:border-slate-700"
                                        }`}
                                    >
                                        <img
                                            src={getProductImageUrl(image.image)}
                                            alt={product.title}
                                            className="h-20 w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-5">
                        <div className="rounded-[28px] border border-[#eadbca] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <span className="inline-flex items-center gap-2 rounded-full bg-[#f6ecdd] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7b563f]">
                                        <IconCategory size={14} />
                                        {product.category?.name || "Produk"}
                                    </span>
                                    <h2 className="mt-4 text-3xl font-bold text-[#5c4131] dark:text-white">
                                        {product.title}
                                    </h2>
                                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                        {product.description}
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-[#fbf5ed] px-5 py-4 text-left dark:bg-slate-800/70">
                                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#b29d89]">
                                        HARGA
                                    </p>
                                    <p className="mt-1 text-2xl font-bold text-[#7b563f] dark:text-[#ead7bf]">
                                        {formatCurrency(product.sell_price)}
                                    </p>
                                    {isRegularUser && whatsappLink && (
                                        <a
                                            href={whatsappLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1fb85a]"
                                        >
                                            <IconBrandWhatsapp size={15} />
                                            Chat dengan Admin
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={`grid grid-cols-1 gap-4 ${isRegularUser ? "md:grid-cols-1" : "md:grid-cols-2"}`}>
                            <div className="rounded-2xl border border-[#eadbca] bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex items-center gap-2 text-[#7b563f]">
                                    <IconPackage size={18} />
                                    <p className="text-sm font-semibold">
                                        Stok Tersedia
                                    </p>
                                </div>
                                <p className="mt-3 text-base font-medium text-slate-800 dark:text-slate-200">
                                    {product.stock} barang
                                </p>
                            </div>

                            {!isRegularUser && (
                                <div className="rounded-2xl border border-[#eadbca] bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                    <div className="flex items-center gap-2 text-[#7b563f]">
                                        <IconCurrencyDollar size={18} />
                                        <p className="text-sm font-semibold">
                                            Harga Beli
                                        </p>
                                    </div>
                                    <p className="mt-3 text-base font-medium text-slate-800 dark:text-slate-200">
                                        {formatCurrency(product.buy_price)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = (page) => <DashboardLayout children={page} />;
