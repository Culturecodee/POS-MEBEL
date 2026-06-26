import React, { useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, Link } from "@inertiajs/react";
import {
    IconArrowLeft,
    IconCategory,
    IconPackage,
    IconPhoto,
} from "@tabler/icons-react";
import { getProductImageUrl } from "@/Utils/imageUrl";

function CategoryProductImage({ product }) {
    const [hasError, setHasError] = useState(false);
    const imageSrc =
        !hasError && product.image ? getProductImageUrl(product.image) : null;

    if (!imageSrc) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-[#f5ede3]">
                <IconPhoto size={34} className="text-[#b89f88]" />
            </div>
        );
    }

    return (
        <img
            src={imageSrc}
            alt={product.title}
            className="h-full w-full object-contain bg-[#f8f3ec] p-3"
            loading="lazy"
            onError={() => setHasError(true)}
        />
    );
}

export default function Show({ category }) {
    const products = category.products || [];

    return (
        <>
            <Head title={`Kategori - ${category.name}`} />

            <div className="space-y-6">
                <div>
                    <Link
                        href={route("categories.index")}
                        className="mb-3 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#8a5a3c]"
                    >
                        <IconArrowLeft size={16} />
                        Kembali ke Kategori
                    </Link>
                    <div className="rounded-[28px] border border-[#eadbca] bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5ede3] text-[#8a5a3c]">
                                    <IconCategory size={28} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b29d89]">
                                        Detail Kategori
                                    </p>
                                    <h1 className="mt-1 text-3xl font-bold text-[#5c4131] dark:text-white">
                                        {category.name}
                                    </h1>
                                    <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
                                        {category.description ||
                                            "Kategori ini menampilkan daftar produk yang terhubung di dalamnya."}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-[#fbf5ed] px-5 py-4 text-left dark:bg-slate-800/70">
                                <p className="text-[11px] uppercase tracking-[0.18em] text-[#b29d89]">
                                    Total Produk
                                </p>
                                <p className="mt-1 text-2xl font-bold text-[#7b563f] dark:text-[#ead7bf]">
                                    {products.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="overflow-hidden rounded-[24px] border border-[#eadbca] bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                            >
                                <Link
                                    href={route("products.show", {
                                        product: product.id,
                                        gallery: 1,
                                        category_id: category.id,
                                        category_name: category.name,
                                    })}
                                    className="block"
                                >
                                    <div className="flex h-64 items-center justify-center overflow-hidden bg-[#f8f3ec] transition hover:bg-[#f2e7d8]">
                                        <CategoryProductImage product={product} />
                                    </div>
                                </Link>
                                <div className="space-y-3 p-4">
                                    <div className="flex items-center gap-2 text-[#8a5a3c]">
                                        <IconPackage size={18} />
                                        <p className="text-sm font-semibold">
                                            Nama Produk
                                        </p>
                                    </div>
                                    <div className="rounded-2xl bg-[#fbf5ed] px-4 py-3 dark:bg-slate-800/70">
                                        <Link
                                            href={route("products.show", {
                                                product: product.id,
                                                gallery: 1,
                                                category_id: category.id,
                                                category_name: category.name,
                                            })}
                                            className="text-base font-semibold text-[#5c4131] hover:text-[#8a5a3c] dark:text-slate-100"
                                        >
                                            {product.title}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-[24px] border border-[#eadbca] bg-white py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f5ede3] text-[#8a5a3c]">
                            <IconPackage size={30} />
                        </div>
                        <h3 className="text-lg font-semibold text-[#5c4131] dark:text-slate-100">
                            Belum Ada Produk di Kategori Ini
                        </h3>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Tambahkan produk ke kategori ini agar gambar dan nama produknya muncul di sini.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}

Show.layout = (page) => <DashboardLayout children={page} />;
