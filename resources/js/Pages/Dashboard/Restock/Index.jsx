import React, { useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import {
    IconCalendar,
    IconCircleCheck,
    IconCircleX,
    IconRefresh,
    IconSearch,
    IconTrophy,
    IconEye,
    IconX,
    IconInfoCircle,
    IconPackage,
    IconAlertTriangle,
    IconLoader2,
    IconShoppingCart,
    IconTrendingUp,
    IconCash,
} from "@tabler/icons-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (v = 0) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
    }).format(v);

const fmtNum = (v = 0, dec = 2) =>
    Number(v).toFixed(dec);

// ─── Rank Badge ───────────────────────────────────────────────────────────────
function RankBadge({ rank }) {
    if (rank === 1) return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-bold text-xs shadow-sm">🥇 #1</span>;
    if (rank === 2) return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-xs shadow-sm">🥈 #2</span>;
    if (rank === 3) return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold text-xs shadow-sm">🥉 #3</span>;
    return <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold text-xs">#{rank}</span>;
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RestockIndex() {
    const today = new Date().toISOString().slice(0, 10);
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    // Form state
    const [dateFrom, setDateFrom] = useState(monthAgo);
    const [dateTo, setDateTo] = useState(today);

    // Process state
    const [validating, setValidating] = useState(false);
    const [calculating, setCalculating] = useState(false);
    const [validation, setValidation] = useState(null); // { valid, message, total_trx, total_products }
    const [results, setResults] = useState(null);
    const [meta, setMeta] = useState(null);

    // ── Validate ───────────────────────────────────────────────────────────
    const handleValidate = async () => {
        setValidating(true);
        setValidation(null);
        setResults(null);
        try {
            const res = await axios.post(route("restock.validate"), {
                date_from: dateFrom,
                date_to: dateTo,
            });
            setValidation(res.data);
        } catch (err) {
            const msg = err.response?.data?.message ||
                Object.values(err.response?.data?.errors ?? {})[0]?.[0] ||
                "Terjadi kesalahan saat validasi.";
            setValidation({ valid: false, message: msg });
        } finally {
            setValidating(false);
        }
    };

    // ── Calculate ──────────────────────────────────────────────────────────
    const handleCalculate = async () => {
        setCalculating(true);
        setResults(null);
        try {
            const res = await axios.post(route("restock.calculate"), {
                date_from: dateFrom,
                date_to: dateTo,
            });
            setResults(res.data.results);
            setMeta(res.data);
        } catch (err) {
            const msg = err.response?.data?.message || "Gagal mengambil data produk terlaris.";
            setValidation({ valid: false, message: msg });
        } finally {
            setCalculating(false);
        }
    };

    const canCalculate = validation?.valid === true;

    return (
        <>
            <Head title="Laporan Produk Terlaris" />

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7b563f] to-[#5f3f2d] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#7b563f]/20">
                        <IconTrophy size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Laporan Produk Terlaris
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            Menampilkan produk yang paling banyak dibeli oleh pelanggan berdasarkan data penjualan
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {/* ── Panel Form ─────────────────────────────────────────── */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-5 flex items-center gap-2">
                        <IconSearch size={16} className="text-[#7b563f]" />
                        Parameter Tanggal
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 max-w-2xl">
                        {/* Dari Tanggal */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                                <IconCalendar size={12} />
                                Dari Tanggal
                            </label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => { setDateFrom(e.target.value); setValidation(null); setResults(null); }}
                                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#7b563f]/20 focus:border-[#7b563f] transition-colors outline-none"
                            />
                        </div>

                        {/* Sampai Tanggal */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                                <IconCalendar size={12} />
                                Sampai Tanggal
                            </label>
                            <input
                                type="date"
                                value={dateTo}
                                min={dateFrom}
                                onChange={(e) => { setDateTo(e.target.value); setValidation(null); setResults(null); }}
                                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#7b563f]/20 focus:border-[#7b563f] transition-colors outline-none"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-3">
                        {/* Tombol Cek Validasi */}
                        <button
                            onClick={handleValidate}
                            disabled={validating}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#7b563f] text-[#7b563f] dark:text-[#ead7bf] dark:border-[#7b563f] hover:bg-[#fbf4eb] dark:hover:bg-[#5f3f2d]/30 text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {validating ? (
                                <IconLoader2 size={16} className="animate-spin" />
                            ) : (
                                <IconCircleCheck size={16} />
                            )}
                            {validating ? "Memvalidasi..." : "Cek Validasi"}
                        </button>

                        {/* Tombol Proses Cek */}
                        <button
                            onClick={handleCalculate}
                            disabled={!canCalculate || calculating}
                            title={!canCalculate ? "Lakukan validasi terlebih dahulu" : ""}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${canCalculate && !calculating
                                    ? "bg-gradient-to-r from-[#7b563f] to-[#5f3f2d] hover:from-[#694733] hover:to-[#4e3725] text-white shadow-lg shadow-[#7b563f]/25"
                                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                                }`}
                        >
                            {calculating ? (
                                <IconLoader2 size={16} className="animate-spin" />
                            ) : (
                                <IconRefresh size={16} />
                            )}
                            {calculating ? "Memuat Data..." : "Cek"}
                        </button>
                    </div>
                </div>

                {/* ── Alert Banner ───────────────────────────────────────── */}
                {validation && (
                    <div
                        className={`flex items-start gap-3 p-4 rounded-2xl border text-sm font-medium ${validation.valid
                                ? "bg-green-50 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300"
                                : "bg-red-50 border-red-300 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300"
                            }`}
                    >
                        {validation.valid ? (
                            <IconCircleCheck size={20} className="flex-shrink-0 mt-0.5 text-green-500" />
                        ) : (
                            <IconCircleX size={20} className="flex-shrink-0 mt-0.5 text-red-500" />
                        )}
                        <div>
                            <p className="font-bold">{validation.valid ? "✅ Data valid dan siap diproses" : "❌ Validasi Gagal"}</p>
                            <p className="mt-0.5">{validation.message}</p>
                            {validation.valid && (
                                <p className="text-xs mt-1 opacity-80">
                                    Ditemukan {validation.total_trx} transaksi sukses.
                                    Klik tombol <strong>"Cek"</strong> di atas untuk memproses hasil ranking.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Tabel Hasil & Statistik ────────────────────────────── */}
                {results !== null && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        {/* Table Header */}
                        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <IconTrophy size={18} className="text-yellow-500" />
                                Hasil Ranking Produk Terlaris
                            </h2>
                            {meta && (
                                <span className="text-xs text-slate-400">
                                    Rentang: {meta.date_from} s/d {meta.date_to} ({meta.total_days} Hari)
                                </span>
                            )}
                        </div>

                        {results.length === 0 ? (
                            <div className="py-16 text-center">
                                <IconAlertTriangle size={36} className="mx-auto text-slate-300 mb-3" />
                                <p className="text-slate-500 font-medium">Tidak ada data penjualan pada rentang tanggal tersebut.</p>
                            </div>
                        ) : (
                            <>
                                {/* ── Ringkasan Statistik Skor/Penjualan ── */}
                                {(() => {
                                    const totalQty = results.reduce((sum, r) => sum + r.total_qty, 0);
                                    const totalRevenue = results.reduce((sum, r) => sum + r.total_revenue, 0);
                                    const totalTrx = validation?.total_trx || meta?.results?.reduce((sum, r) => sum + r.total_trx, 0) || 0;
                                    const avgQty = totalQty / results.length;

                                    return (
                                        <div className="px-6 pb-6 pt-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {/* Total Transaksi */}
                                            <div className="rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-4 text-center">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500 mb-1">Total Transaksi</p>
                                                <p className="text-2xl font-extrabold text-blue-700 dark:text-blue-400 font-sans">{totalTrx}</p>
                                                <p className="text-[10px] text-blue-400 mt-1">Transaksi Selesai</p>
                                            </div>
                                            {/* Total Qty Terjual */}
                                            <div className="rounded-xl bg-[#fdf6ec] dark:bg-[#5f3f2d]/10 border border-[#e8d5bc] dark:border-[#7b563f]/30 p-4 text-center">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#a07050] mb-1">Total Terjual</p>
                                                <p className="text-2xl font-extrabold text-[#7b563f] font-sans">{totalQty} unit</p>
                                                <p className="text-[10px] text-[#a07050] mt-1">Seluruh Produk</p>
                                            </div>
                                            {/* Total Omset */}
                                            <div className="rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 p-4 text-center">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-green-600 mb-1">Total Pendapatan</p>
                                                <p className="text-xl font-extrabold text-green-700 dark:text-green-400 font-sans truncate px-1">{fmt(totalRevenue)}</p>
                                                <p className="text-[10px] text-green-500 mt-1">Total Omset Penjualan</p>
                                            </div>
                                            {/* Rata-rata Qty per Produk */}
                                            <div className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 text-center">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Rata-rata Terjual</p>
                                                <p className="text-2xl font-extrabold text-slate-700 dark:text-slate-300 font-sans">{fmtNum(avgQty, 1)} unit</p>
                                                <p className="text-[10px] text-slate-400 mt-1">Per Jenis Produk</p>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Table View */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-800">
                                            <tr>
                                                <th className="px-4 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider w-12">No</th>
                                                <th className="px-4 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Produk</th>
                                                <th className="px-4 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
                                                <th className="px-4 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Total Terjual</th>
                                                <th className="px-4 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Kekerapan (Trx)</th>
                                                <th className="px-4 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Total Pendapatan</th>
                                                <th className="px-4 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Stok Saat Ini</th>
                                                <th className="px-4 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Ranking</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {results.map((r, i) => {
                                                // Calculate visual progress based on the maximum total_qty (first item is always max because we sorted descending)
                                                const maxQty = results[0]?.total_qty || 1;
                                                const barWidth = Math.min(100, (r.total_qty / maxQty) * 100);

                                                return (
                                                    <tr
                                                        key={r.product_id}
                                                        className={`transition-colors duration-150 ${r.rank === 1
                                                                ? "bg-yellow-50/40 dark:bg-yellow-900/5 hover:bg-yellow-50/70 dark:hover:bg-yellow-900/10"
                                                                : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                                                            }`}
                                                    >
                                                        <td className="px-4 py-3.5 text-center text-slate-400 text-xs font-medium">{i + 1}</td>
                                                        <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                                                            {r.product_name}
                                                        </td>
                                                        <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400">
                                                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium border border-slate-200/50 dark:border-slate-700/50">
                                                                {r.category}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3.5">
                                                            <div className="flex flex-col items-center gap-1">
                                                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                                                    {r.total_qty} unit
                                                                </span>
                                                                <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-gradient-to-r from-[#c8a87a] to-[#7b563f] rounded-full"
                                                                        style={{ width: `${barWidth}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3.5 text-center text-slate-600 dark:text-slate-400">
                                                            {r.total_trx} kali
                                                        </td>
                                                        <td className="px-4 py-3.5 text-right font-semibold text-slate-700 dark:text-slate-300">
                                                            {fmt(r.total_revenue)}
                                                        </td>
                                                        <td className="px-4 py-3.5 text-center">
                                                            <span className={`font-bold ${r.stock === 0 ? "text-red-500" : r.stock <= 5 ? "text-amber-500" : "text-slate-600 dark:text-slate-400"}`}>
                                                                {r.stock}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3.5 text-center">
                                                            <RankBadge rank={r.rank} />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

RestockIndex.layout = (page) => <DashboardLayout children={page} />;
