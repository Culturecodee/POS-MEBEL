import React, { useEffect, useState } from "react";
import { Head, router, Link } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import Button from "@/Components/Dashboard/Button";
import Table from "@/Components/Dashboard/Table";
import Pagination from "@/Components/Dashboard/Pagination";
import {
    IconDatabaseOff,
    IconSearch,
    IconHistory,
    IconCalendar,
    IconReceipt,
    IconPrinter,
    IconFilter,
    IconX,
    IconCircleCheck,
} from "@tabler/icons-react";

const defaultFilters = {
    invoice: "",
    start_date: "",
    end_date: "",
};

const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);

const History = ({ transactions, filters }) => {
    const [filterData, setFilterData] = useState({
        ...defaultFilters,
        ...filters,
    });
    const [showFilters, setShowFilters] = useState(false);
    const [confirmModal, setConfirmModal] = useState(null); // stores transaction object to confirm

    useEffect(() => {
        setFilterData({
            ...defaultFilters,
            ...filters,
        });
    }, [filters]);

    const handleChange = (field, value) => {
        setFilterData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const applyFilters = (event) => {
        event.preventDefault();
        router.get(route("transactions.history"), filterData, {
            preserveScroll: true,
            preserveState: true,
        });
        setShowFilters(false);
    };

    const resetFilters = () => {
        setFilterData(defaultFilters);
        router.get(route("transactions.history"), defaultFilters, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const rows = transactions?.data ?? [];
    const links = transactions?.links ?? [];
    const currentPage = transactions?.current_page ?? 1;
    const perPage = transactions?.per_page
        ? Number(transactions?.per_page)
        : rows.length || 1;

    const hasActiveFilters =
        filterData.invoice || filterData.start_date || filterData.end_date;

    return (
        <>
            <Head title="Riwayat Transaksi" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <IconHistory
                                size={28}
                                className="text-[#8a5a3c]"
                            />
                            Riwayat Transaksi
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {transactions?.total || 0} transaksi tercatat
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                                showFilters || hasActiveFilters
                                    ? "bg-[#f5ebdf] border-[#dcc1a6] text-[#8a5a3c] dark:bg-[#5c3b2a]/30 dark:border-[#8a5a3c] dark:text-[#e7c9aa]"
                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            }`}
                        >
                            <IconFilter size={18} />
                            <span>Filter</span>
                            {hasActiveFilters && (
                                <span className="w-2 h-2 rounded-full bg-[#8a5a3c]"></span>
                            )}
                        </button>
                        <Link
                            href={route("transactions.index")}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8a5a3c] hover:bg-[#6f4b36] text-white text-sm font-medium transition-colors shadow-lg shadow-[#8a5a3c]/30"
                        >
                            <IconReceipt size={18} />
                            <span>Transaksi Baru</span>
                        </Link>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 animate-slide-up">
                        <form onSubmit={applyFilters}>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Nomor Invoice
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="TRX-..."
                                        value={filterData.invoice}
                                        onChange={(e) =>
                                            handleChange(
                                                "invoice",
                                                e.target.value
                                            )
                                        }
                                        className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-[#8a5a3c]/20 focus:border-[#8a5a3c] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Tanggal Mulai
                                    </label>
                                    <input
                                        type="date"
                                        value={filterData.start_date}
                                        onChange={(e) =>
                                            handleChange(
                                                "start_date",
                                                e.target.value
                                            )
                                        }
                                        className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#8a5a3c]/20 focus:border-[#8a5a3c] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Tanggal Akhir
                                    </label>
                                    <input
                                        type="date"
                                        value={filterData.end_date}
                                        onChange={(e) =>
                                            handleChange(
                                                "end_date",
                                                e.target.value
                                            )
                                        }
                                        className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#8a5a3c]/20 focus:border-[#8a5a3c] transition-all"
                                    />
                                </div>
                                <div className="flex items-end gap-2">
                                    <button
                                        type="submit"
                                        className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#8a5a3c] hover:bg-[#6f4b36] text-white font-medium transition-colors"
                                    >
                                        <IconSearch size={18} />
                                        <span>Cari</span>
                                    </button>
                                    {hasActiveFilters && (
                                        <button
                                            type="button"
                                            onClick={resetFilters}
                                            className="h-11 px-4 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <IconX size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {/* Transaction List */}
                {rows.length > 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800">
                                        <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            No
                                        </th>
                                        <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Invoice
                                        </th>
                                        <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Tanggal
                                        </th>
                                        <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Kasir
                                        </th>
                                        <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Pelanggan
                                        </th>
                                        <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Sumber
                                        </th>
                                        <th className="px-4 py-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Item
                                        </th>
                                        <th className="px-4 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-4 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Profit
                                        </th>
                                        <th className="px-4 py-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-4 py-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {rows.map((transaction, index) => (
                                        <tr
                                            key={transaction.id}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                        >
                                            <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                {index +
                                                    1 +
                                                    (currentPage - 1) * perPage}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                    {transaction.invoice}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                {transaction.created_at}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                {transaction.cashier?.name ??
                                                    "-"}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
                                                    {transaction.customer
                                                        ?.name ?? "Umum"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                {transaction.order_source ===
                                                "customer" ? (
                                                    <div className="space-y-1">
                                                        <span className="inline-flex rounded-full bg-[#f1e0cf] px-2 py-1 text-xs font-medium text-[#8a5a3c]">
                                                            Pesanan Customer
                                                        </span>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {transaction
                                                                .ordered_by_user
                                                                ?.name ?? "-"}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                        Kasir
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className="px-2 py-1 text-xs font-medium bg-[#f1e0cf] dark:bg-[#5c3b2a]/40 text-[#8a5a3c] dark:text-[#e7c9aa] rounded-full">
                                                    {transaction.total_items ??
                                                        0}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right text-sm font-semibold text-slate-900 dark:text-white">
                                                {formatCurrency(
                                                    transaction.grand_total ?? 0
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-right text-sm font-semibold text-[#a66b3d] dark:text-[#e7c9aa]">
                                                {formatCurrency(
                                                    transaction.total_profit ??
                                                        0
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                {transaction.status === "success" && (
                                                    <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
                                                        Sukses
                                                    </span>
                                                )}
                                                {transaction.status === "pending" && (
                                                    <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 animate-pulse">
                                                        Pending
                                                    </span>
                                                )}
                                                {transaction.status === "rejected" && (
                                                    <span className="inline-flex rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-800 dark:bg-rose-950/30 dark:text-rose-400">
                                                        Ditolak
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {transaction.status === "pending" && (
                                                        <button
                                                            onClick={() => setConfirmModal(transaction)}
                                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
                                                            title="Validasi Transaksi"
                                                        >
                                                            <IconCircleCheck size={13} />
                                                            Validasi
                                                        </button>
                                                    )}
                                                    <Link
                                                        href={route(
                                                            "transactions.print",
                                                            transaction.invoice
                                                        )}
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-[#8a5a3c] hover:bg-[#f5ebdf] dark:hover:bg-[#5c3b2a]/30 transition-colors"
                                                        title="Cetak Struk"
                                                    >
                                                        <IconPrinter size={18} />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                            <IconDatabaseOff
                                size={32}
                                className="text-slate-400"
                                strokeWidth={1.5}
                            />
                        </div>
                        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-1">
                            Belum Ada Transaksi
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {hasActiveFilters
                                ? "Tidak ada transaksi sesuai filter."
                                : "Transaksi akan muncul di sini."}
                        </p>
                    </div>
                )}

                {links.length > 3 && <Pagination links={links} />}
            </div>

        {/* Validation Confirmation Modal */}
        {confirmModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col p-6 text-center">

                    {/* Icon */}
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30 mb-4">
                        <IconCircleCheck size={28} />
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                        Validasi Transaksi
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                        Tindakan ini akan memotong stok barang secara resmi di database.
                    </p>

                    {/* Transaction Summary */}
                    <div className="bg-slate-50 dark:bg-slate-950/20 rounded-2xl p-3.5 border border-slate-100 dark:border-slate-800 text-left text-xs mb-5 space-y-1.5">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Invoice</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">{confirmModal.invoice}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Pelanggan</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">{confirmModal.customer?.name || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Total</span>
                            <span className="font-bold text-[#8a5a3c]">
                                {formatCurrency(confirmModal.grand_total ?? confirmModal.total_price)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Item</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">{confirmModal.total_items ?? confirmModal.details?.length ?? "-"} produk</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setConfirmModal(null)}
                            className="flex-1 py-2.5 px-4 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl transition-colors text-sm"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                router.post(route("transactions.validate", confirmModal.id), {}, {
                                    preserveScroll: true,
                                    onFinish: () => setConfirmModal(null),
                                });
                            }}
                            className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors text-sm flex items-center justify-center gap-1.5"
                        >
                            <IconCircleCheck size={16} />
                            Ya, Validasi
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

History.layout = (page) => <DashboardLayout children={page} />;

export default History;
