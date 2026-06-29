import React, { useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import Pagination from "@/Components/Dashboard/Pagination";
import { getProductImageUrl } from "@/Utils/imageUrl";
import {
    IconAlertTriangle,
    IconBox,
    IconDatabaseOff,
    IconPhoto,
    IconSearch,
    IconStack2,
    IconX,
} from "@tabler/icons-react";

const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
    }).format(value);

const SummaryCard = ({ icon, title, value, description, gradient }) => (
    <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 text-white shadow-lg`}
    >
        <div className="absolute right-0 top-0 opacity-15">
            {React.cloneElement(icon, {
                size: 92,
                strokeWidth: 0.8,
                className: "translate-x-4 -translate-y-4",
            })}
        </div>
        <div className="relative z-10">
            <div className="mb-2 flex items-center gap-2">
                <div className="rounded-xl bg-white/20 p-2">
                    {React.cloneElement(icon, { size: 18 })}
                </div>
                <span className="text-sm font-medium opacity-90">{title}</span>
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="mt-1 text-sm opacity-80">{description}</p>
        </div>
    </div>
);

function ProductImage({ product }) {
    const [hasError, setHasError] = useState(false);
    const imageSrc =
        !hasError && product.image ? getProductImageUrl(product.image) : null;

    if (!imageSrc) {
        return (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5ede3] text-[#b89f88]">
                <IconPhoto size={24} />
            </div>
        );
    }

    return (
        <img
            src={imageSrc}
            alt={product.title}
            className="h-14 w-14 rounded-2xl bg-[#f8f3ec] object-cover"
            onError={() => setHasError(true)}
        />
    );
}

const Inventory = ({ products, filters, summary }) => {
    const [search, setSearch] = useState(filters?.search ?? "");

    useEffect(() => {
        setSearch(filters?.search ?? "");
    }, [filters?.search]);

    const applyFilters = (event) => {
        event.preventDefault();
        router.get(
            route("reports.inventory.index"),
            { search },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            }
        );
    };

    const resetFilters = () => {
        setSearch("");
        router.get(
            route("reports.inventory.index"),
            { search: "" },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            }
        );
    };

    const rows = products?.data ?? [];
    const paginationLinks = products?.links ?? [];
    const currentPage = products?.current_page ?? 1;
    const perPage = products?.per_page
        ? Number(products.per_page)
        : rows.length || 1;

    const cards = [
        {
            title: "Total Produk",
            value: summary?.total_products ?? 0,
            description: "Jumlah data produk aktif",
            icon: <IconBox />,
            gradient: "from-[#8a5a3c] to-[#5c3b2a]",
        },
        {
            title: "Total Stok",
            value: (summary?.total_stock ?? 0).toLocaleString("id-ID"),
            description: "Akumulasi seluruh persediaan",
            icon: <IconStack2 />,
            gradient: "from-[#a66b3d] to-[#7a4a2d]",
        },
        {
            title: "Stok Menipis",
            value: summary?.low_stock_products ?? 0,
            description: "Produk dengan stok 1 sampai 5",
            icon: <IconAlertTriangle />,
            gradient: "from-[#c28b52] to-[#9d6738]",
        },
        {
            title: "Stok Habis",
            value: summary?.out_of_stock_products ?? 0,
            description: "Produk yang perlu segera diisi",
            icon: <IconDatabaseOff />,
            gradient: "from-[#b0563f] to-[#8c412d]",
        },
    ];

    return (
        <>
            <Head title="Laporan Persediaan" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                            <IconBox size={28} className="text-[#8a5a3c]" />
                            Laporan Persediaan
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Pantau stok produk dan cari persediaan dengan cepat.
                        </p>
                    </div>

                    <form
                        onSubmit={applyFilters}
                        className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row"
                    >
                        <div className="relative min-w-[280px]">
                            <IconSearch
                                size={18}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Cari nama produk"
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 focus:border-[#8a5a3c] focus:outline-none focus:ring-2 focus:ring-[#8a5a3c]/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                            />
                        </div>
                        <button
                            type="submit"
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#8a5a3c] px-5 text-sm font-medium text-white transition hover:bg-[#6f4b36]"
                        >
                            <IconSearch size={18} />
                            Cari
                        </button>
                        {search && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                <IconX size={18} />
                            </button>
                        )}
                    </form>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {cards.map((card) => (
                        <SummaryCard key={card.title} {...card} />
                    ))}
                </div>

                {rows.length > 0 ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            No
                                        </th>
                                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Produk
                                        </th>
                                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Kategori
                                        </th>
                                        <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Harga Jual
                                        </th>
                                        <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Stok
                                        </th>
                                        <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {rows.map((product, index) => {
                                        const stock = Number(product.stock ?? 0);
                                        const status =
                                            stock <= 0
                                                ? {
                                                      label: "Stok Habis",
                                                      className:
                                                          "bg-[#f9e1d8] text-[#a14c36]",
                                                  }
                                                : stock <= 5
                                                  ? {
                                                        label: "Stok Menipis",
                                                        className:
                                                            "bg-[#f8ead6] text-[#9a663a]",
                                                    }
                                                  : {
                                                        label: "Tersedia",
                                                        className:
                                                            "bg-[#efe3d2] text-[#7b563f]",
                                                    };

                                        return (
                                            <tr
                                                key={product.id}
                                                className="hover:bg-slate-50 dark:hover:bg-slate-800/40"
                                            >
                                                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                    {index + 1 + (currentPage - 1) * perPage}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <ProductImage product={product} />
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                                {product.title}
                                                            </p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                ID Produk #{product.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                    {product.category?.name ?? "-"}
                                                </td>
                                                <td className="px-4 py-4 text-right text-sm font-semibold text-slate-900 dark:text-white">
                                                    {formatCurrency(product.sell_price)}
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className="inline-flex rounded-full bg-[#f1e0cf] px-3 py-1 text-xs font-semibold text-[#8a5a3c]">
                                                        {stock} barang
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                                                    >
                                                        {status.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                            <IconDatabaseOff
                                size={32}
                                className="text-slate-400"
                            />
                        </div>
                        <h3 className="mb-1 text-lg font-medium text-slate-800 dark:text-slate-200">
                            Produk Tidak Ditemukan
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Coba gunakan kata kunci lain untuk mencari persediaan produk.
                        </p>
                    </div>
                )}

                {paginationLinks.length > 3 && (
                    <Pagination links={paginationLinks} />
                )}
            </div>
        </>
    );
};

Inventory.layout = (page) => <DashboardLayout children={page} />;

export default Inventory;
