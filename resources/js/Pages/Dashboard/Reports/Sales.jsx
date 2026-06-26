import React, { useEffect, useMemo, useState } from "react";
import { Head, router } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import InputSelect from "@/Components/Dashboard/InputSelect";
import Pagination from "@/Components/Dashboard/Pagination";
import {
    IconCoin,
    IconDatabaseOff,
    IconDiscount2,
    IconReceipt2,
    IconShoppingBag,
    IconTrendingUp,
    IconFilter,
    IconX,
    IconSearch,
    IconPrinter,
} from "@tabler/icons-react";

// Summary Card Component
const SummaryCard = ({
    icon,
    title,
    value,
    description,
    gradient,
    onClick,
}) => (
    <div
        className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${gradient} text-white shadow-lg print:shadow-none print:bg-white print:text-black print:border print:border-slate-300`}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
            onClick
                ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onClick();
                      }
                  }
                : undefined
        }
    >
        <div className="absolute top-0 right-0 w-24 h-24 opacity-20 print:hidden">
            {React.cloneElement(icon, {
                size: 96,
                strokeWidth: 0.5,
                className: "transform translate-x-4 -translate-y-4",
            })}
        </div>
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-xl bg-white/20 print:bg-slate-100">
                    {React.cloneElement(icon, { size: 18 })}
                </div>
                <span className="text-sm font-medium opacity-90 print:opacity-100">
                    {title}
                </span>
            </div>
            <p className="text-2xl font-bold">{value}</p>
            {description ? (
                <p className="text-sm opacity-80 mt-1 print:opacity-100">
                    {description}
                </p>
            ) : null}
        </div>
    </div>
);

const defaultFilterState = {
    start_date: "",
    end_date: "",
    invoice: "",
    cashier_id: "",
    customer_id: "",
};

const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);

const castFilterString = (value) =>
    typeof value === "number" ? String(value) : value ?? "";

const Sales = ({
    transactions,
    summary,
    filters,
    cashiers,
    customers,
    soldItems = [],
}) => {
    const [showFilters, setShowFilters] = useState(false);
    const [showSoldItems, setShowSoldItems] = useState(false);
    const [filterData, setFilterData] = useState({
        ...defaultFilterState,
        start_date: castFilterString(filters?.start_date),
        end_date: castFilterString(filters?.end_date),
        invoice: castFilterString(filters?.invoice),
        cashier_id: castFilterString(filters?.cashier_id),
        customer_id: castFilterString(filters?.customer_id),
    });

    const cashierFromFilters = useMemo(
        () =>
            cashiers.find(
                (c) => castFilterString(c.id) === filterData.cashier_id
            ) ?? null,
        [cashiers, filterData.cashier_id]
    );

    const customerFromFilters = useMemo(
        () =>
            customers.find(
                (c) => castFilterString(c.id) === filterData.customer_id
            ) ?? null,
        [customers, filterData.customer_id]
    );

    const [selectedCashier, setSelectedCashier] = useState(cashierFromFilters);
    const [selectedCustomer, setSelectedCustomer] =
        useState(customerFromFilters);

    useEffect(
        () => setSelectedCashier(cashierFromFilters),
        [cashierFromFilters]
    );
    useEffect(
        () => setSelectedCustomer(customerFromFilters),
        [customerFromFilters]
    );
    useEffect(() => {
        setFilterData({
            ...defaultFilterState,
            start_date: castFilterString(filters?.start_date),
            end_date: castFilterString(filters?.end_date),
            invoice: castFilterString(filters?.invoice),
            cashier_id: castFilterString(filters?.cashier_id),
            customer_id: castFilterString(filters?.customer_id),
        });
    }, [filters]);

    const handleChange = (field, value) =>
        setFilterData((prev) => ({ ...prev, [field]: value }));

    const handleSelectCashier = (value) => {
        setSelectedCashier(value);
        handleChange("cashier_id", value ? String(value.id) : "");
    };

    const handleSelectCustomer = (value) => {
        setSelectedCustomer(value);
        handleChange("customer_id", value ? String(value.id) : "");
    };

    const applyFilters = (e) => {
        e.preventDefault();
        router.get(route("reports.sales.index"), filterData, {
            preserveScroll: true,
            preserveState: true,
        });
        setShowFilters(false);
    };

    const resetFilters = () => {
        setFilterData(defaultFilterState);
        setSelectedCashier(null);
        setSelectedCustomer(null);
        router.get(route("reports.sales.index"), defaultFilterState, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const rows = transactions?.data ?? [];
    const paginationLinks = transactions?.links ?? [];
    const currentPage = transactions?.current_page ?? 1;
    const perPage = transactions?.per_page
        ? Number(transactions?.per_page)
        : rows.length || 1;

    const hasActiveFilters =
        filterData.invoice ||
        filterData.start_date ||
        filterData.end_date ||
        filterData.cashier_id ||
        filterData.customer_id;

    const safeSummary = {
        orders_count: summary?.orders_count ?? 0,
        revenue_total: summary?.revenue_total ?? 0,
        discount_total: summary?.discount_total ?? 0,
        items_sold: summary?.items_sold ?? 0,
        profit_total: summary?.profit_total ?? 0,
        average_order: summary?.average_order ?? 0,
    };

    const summaryCards = [
        {
            title: "Pendapatan Bersih",
            value: formatCurrency(safeSummary.revenue_total),
            description: "",
            icon: <IconReceipt2 />,
            gradient: "from-[#8a5a3c] to-[#5c3b2a]",
        },
        {
            title: "Total Profit",
            value: formatCurrency(safeSummary.profit_total),
            description: "",
            icon: <IconCoin />,
            gradient: "from-[#a66b3d] to-[#7a4a2d]",
        },
        {
            title: "Item Terjual",
            value: safeSummary.items_sold.toLocaleString("id-ID"),
            description: `${safeSummary.orders_count} transaksi`,
            icon: <IconShoppingBag />,
            gradient: "from-[#b68558] to-[#8a5a3c]",
            onClick: () => setShowSoldItems(true),
        },
        {
            title: "Diskon Diberikan",
            value: formatCurrency(safeSummary.discount_total),
            description: "",
            icon: <IconDiscount2 />,
            gradient: "from-[#c69c6d] to-[#a9784a]",
        },
    ];

    return (
        <>
            <Head title="Laporan Penjualan" />

            {/* CSS khusus print */}
            <style>{`
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 12mm;
                    }

                    body {
                        background: white !important;
                    }

                    .no-print {
                        display: none !important;
                    }

                    .print-container {
                        padding: 0 !important;
                        margin: 0 !important;
                    }

                    .print-card {
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }

                    table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                        font-size: 12px !important;
                    }

                    thead {
                        display: table-header-group;
                    }

                    tr, td, th {
                        page-break-inside: avoid !important;
                    }

                    th, td {
                        border: 1px solid #cbd5e1 !important;
                        padding: 8px !important;
                    }

                    .print-title {
                        display: block !important;
                    }
                }
            `}</style>

            <div className="space-y-6 print-container">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <IconTrendingUp
                                size={28}
                                className="text-[#8a5a3c]"
                            />
                            Laporan Penjualan
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8a5a3c] hover:bg-[#6f4b36] text-white text-sm font-medium transition-colors"
                        >
                            <IconPrinter size={18} />
                            Print
                        </button>

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
                    </div>
                </div>

                {/* Header khusus print */}
                <div className="hidden print-title mb-6">
                    <h1 className="text-2xl font-bold text-black">
                        LAPORAN PENJUALAN
                    </h1>
                    <p className="text-sm text-black mt-1">
                        Tanggal Cetak:{" "}
                        {new Date().toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>

                    {(filters?.start_date || filters?.end_date) && (
                        <p className="text-sm text-black mt-1">
                            Periode: {filters?.start_date || "-"} s/d{" "}
                            {filters?.end_date || "-"}
                        </p>
                    )}

                    {filters?.invoice && (
                        <p className="text-sm text-black mt-1">
                            Invoice: {filters.invoice}
                        </p>
                    )}
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 print:grid-cols-2">
                    {summaryCards.map((card) => (
                        <div key={card.title} className="print-card">
                            <SummaryCard {...card} />
                        </div>
                    ))}
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 animate-slide-up no-print">
                        <form onSubmit={applyFilters}>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Invoice
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

                                <InputSelect
                                    label="Kasir"
                                    data={cashiers}
                                    selected={selectedCashier}
                                    setSelected={handleSelectCashier}
                                    placeholder="Semua kasir"
                                    searchable
                                />

                                <InputSelect
                                    label="Pelanggan"
                                    data={customers}
                                    selected={selectedCustomer}
                                    setSelected={handleSelectCustomer}
                                    placeholder="Semua pelanggan"
                                    searchable
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <IconX size={18} />
                                    </button>
                                )}

                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#8a5a3c] hover:bg-[#6f4b36] text-white font-medium transition-colors"
                                >
                                    <IconSearch size={18} />
                                    Terapkan
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Table */}
                {rows.length > 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden print:border print:border-slate-300 print:rounded-none">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                                        <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                                            No
                                        </th>
                                        <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                                            Invoice
                                        </th>
                                        <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                                            Tanggal
                                        </th>
                                        <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                                            Pelanggan
                                        </th>
                                        <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                                            Kasir
                                        </th>
                                        <th className="px-4 py-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                                            Item
                                        </th>
                                        <th className="px-4 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                                            Total
                                        </th>
                                        <th className="px-4 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                                            Profit
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {rows.map((trx, i) => (
                                        <tr
                                            key={trx.id}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                        >
                                            <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                {i +
                                                    1 +
                                                    (currentPage - 1) * perPage}
                                            </td>
                                            <td className="px-4 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                                                {trx.invoice}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                {trx.created_at}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                {trx.customer?.name ?? "-"}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                {trx.cashier?.name ?? "-"}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className="px-2 py-0.5 text-xs font-medium bg-[#f1e0cf] dark:bg-[#5c3b2a]/40 text-[#8a5a3c] dark:text-[#e7c9aa] rounded-full print:bg-transparent print:text-black print:px-0">
                                                    {trx.total_items ?? 0}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right text-sm font-semibold text-slate-900 dark:text-white">
                                                {formatCurrency(
                                                    trx.grand_total ?? 0
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-right text-sm font-semibold text-[#a66b3d] dark:text-[#e7c9aa] print:text-black">
                                                {formatCurrency(
                                                    trx.total_profit ?? 0
                                                )}
                                            </td>
                                        </tr>
                                    ))}

                                    {/* Footer Total */}
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 font-bold">
                                        <td
                                            colSpan={6}
                                            className="px-4 py-4 text-right text-sm text-slate-900 dark:text-white"
                                        >
                                            Total Pendapatan
                                        </td>
                                        <td className="px-4 py-4 text-right text-sm text-slate-900 dark:text-white print:text-black">
                                            {formatCurrency(
                                                safeSummary.revenue_total
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-right text-sm text-[#a66b3d] dark:text-[#e7c9aa] print:text-black">
                                            {formatCurrency(
                                                safeSummary.profit_total
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 no-print">
                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                            <IconDatabaseOff
                                size={32}
                                className="text-slate-400"
                            />
                        </div>
                        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-1">
                            Tidak Ada Data
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Tidak ada transaksi sesuai filter.
                        </p>
                    </div>
                )}

                {/* Pagination tidak ikut print */}
                <div className="no-print">
                    {paginationLinks.length > 3 && (
                        <Pagination links={paginationLinks} />
                    )}
                </div>

                {showSoldItems && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 no-print">
                        <div className="w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                        Daftar Item Terjual
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Semua produk yang sudah terjual pada periode ini
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowSoldItems(false)}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    <IconX size={20} />
                                </button>
                            </div>

                            <div className="max-h-[70vh] overflow-y-auto">
                                {soldItems.length > 0 ? (
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {soldItems.map((item, index) => (
                                            <div
                                                key={`${item.product_id}-${index}`}
                                                className="grid grid-cols-[56px_1fr_auto] gap-4 px-6 py-4 items-center"
                                            >
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5ebdf] text-[#8a5a3c] font-semibold">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-white">
                                                        {item.title}
                                                    </p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                                        {Number(
                                                            item.total_qty ?? 0
                                                        ).toLocaleString(
                                                            "id-ID"
                                                        )}{" "}
                                                        item terjual
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-[#8a5a3c] dark:text-[#e7c9aa]">
                                                        {formatCurrency(
                                                            item.total_amount ??
                                                                0
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        Belum ada item terjual pada filter ini.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

Sales.layout = (page) => <DashboardLayout children={page} />;

export default Sales;
