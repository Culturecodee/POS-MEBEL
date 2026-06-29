import React, { useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import {
    IconCalendar,
    IconTarget,
    IconPercentage,
    IconCircleCheck,
    IconCircleX,
    IconRefresh,
    IconSearch,
    IconTrophy,
    IconChartBar,
    IconEye,
    IconX,
    IconInfoCircle,
    IconPackage,
    IconAlertTriangle,
    IconLoader2,
} from "@tabler/icons-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (v = 0) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
    }).format(v);

const fmtNum = (v = 0, dec = 4) =>
    Number(v).toFixed(dec);

const CRITERIA_LABELS = [
    { key: "C1", label: "Total Penjualan (qty)", type: "BENEFIT" },
    { key: "C2", label: "Stok Saat Ini (unit)", type: "COST" },
    { key: "C3", label: "Hari Stok Tersisa", type: "COST" },
    { key: "C4", label: "Profit per Unit (Rp)", type: "BENEFIT" },
];
const WEIGHTS = [0.35, 0.30, 0.20, 0.15];

// ─── Detail Modal (redesign sesuai referensi) ───────────────────────────────
function TopsisDetailModal({ product, onClose }) {
    if (!product) return null;
    const d = product.detail;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">

                {/* ── Header ── */}
                <div className="flex items-start justify-between px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-0.5">
                            Detail Perhitungan TOPSIS
                        </p>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                            {product.product_name}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
                    >
                        <IconX size={16} />
                    </button>
                </div>

                {/* ── Summary strip: Ranking / Skor / Qty ── */}
                <div className="flex divide-x divide-slate-100 dark:divide-slate-800 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                    <div className="flex-1 py-3 text-center">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Ranking</p>
                        <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-0.5">
                            #{product.rank}
                        </p>
                    </div>
                    <div className="flex-1 py-3 text-center">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Skor C_i</p>
                        <p className="text-xl font-extrabold text-[#7b563f] mt-0.5">
                            {fmtNum(d.score, 4)}
                        </p>
                    </div>
                    <div className="flex-1 py-3 text-center">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Qty Rekomendasi</p>
                        <p className={`text-xl font-extrabold mt-0.5 ${product.qty_restock > 0 ? "text-orange-500" : "text-green-600"}`}>
                            {product.qty_restock > 0 ? `+${product.qty_restock}` : "Cukup"}
                        </p>
                    </div>
                </div>

                {/* ── Scrollable body ── */}
                <div className="flex-1 overflow-y-auto">

                    {/* Tabel Kriteria */}
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                                <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Kriteria</th>
                                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-500">Nilai Asli</th>
                                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-500">
                                    Normalisasi
                                    <br /><span className="font-normal text-[10px] text-slate-400">(r)</span>
                                </th>
                                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-500">
                                    Terbobot
                                    <br /><span className="font-normal text-[10px] text-slate-400">(y)</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {CRITERIA_LABELS.map((c, j) => (
                                <tr key={j} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                                    <td className="px-4 py-3">
                                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            {c.label.split(" (")[0]}
                                        </p>
                                        <p className={`text-[10px] mt-0.5 font-medium ${c.type === "BENEFIT" ? "text-green-600" : "text-red-500"}`}>
                                            {c.type.toLowerCase()}, w={WEIGHTS[j].toFixed(2)}
                                        </p>
                                    </td>
                                    <td className="px-3 py-3 text-right font-mono text-xs text-slate-600 dark:text-slate-400">
                                        {fmtNum(d.criteria_raw[j], 2)}
                                    </td>
                                    <td className="px-3 py-3 text-right font-mono text-xs text-slate-600 dark:text-slate-400">
                                        {fmtNum(d.criteria_normalized[j], 4)}
                                    </td>
                                    <td className="px-3 py-3 text-right font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">
                                        {fmtNum(d.criteria_weighted[j], 4)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* D+ dan D- berdampingan */}
                    <div className="mx-4 mt-4 mb-3 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                                Jarak ke ideal positif (D⁺)
                            </p>
                            <p className="text-2xl font-bold font-mono text-slate-800 dark:text-white">
                                {fmtNum(d.d_plus, 4)}
                            </p>
                        </div>
                        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                                Jarak ke ideal negatif (D⁻)
                            </p>
                            <p className="text-2xl font-bold font-mono text-slate-800 dark:text-white">
                                {fmtNum(d.d_minus, 4)}
                            </p>
                        </div>
                    </div>

                    {/* Rumus C_i */}
                    <div className="mx-4 mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-mono text-slate-600 dark:text-slate-300 leading-relaxed">
                            C_i = D⁻ ÷ (D⁺ + D⁻) = {fmtNum(d.d_minus, 4)} ÷ ({fmtNum(d.d_plus, 4)} + {fmtNum(d.d_minus, 4)}) ={" "}
                            <span className="font-extrabold text-[#7b563f]">{fmtNum(d.score, 4)}</span>
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1.5">
                            Skor mendekati 1 = sangat perlu restock · Mendekati 0 = stok aman
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}


// ─── Rank Badge ───────────────────────────────────────────────────────────────
function RankBadge({ rank }) {
    if (rank === 1) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-bold text-xs">🥇 #1</span>;
    if (rank === 2) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 font-bold text-xs">🥈 #2</span>;
    if (rank === 3) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 font-bold text-xs">🥉 #3</span>;
    return <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold text-xs">#{rank}</span>;
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RestockIndex() {
    const today = new Date().toISOString().slice(0, 10);
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    // Form state
    const [dateFrom, setDateFrom]       = useState(monthAgo);
    const [dateTo, setDateTo]           = useState(today);
    const [targetDays, setTargetDays]   = useState(30);
    const [buffer, setBuffer]           = useState(10);

    // Process state
    const [validating, setValidating]   = useState(false);
    const [calculating, setCalculating] = useState(false);
    const [validation, setValidation]   = useState(null); // { valid, message, total_trx, total_products }
    const [results, setResults]         = useState(null);
    const [meta, setMeta]               = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // ── Validate ───────────────────────────────────────────────────────────
    const handleValidate = async () => {
        setValidating(true);
        setValidation(null);
        setResults(null);
        try {
            const res = await axios.post(route("restock.validate"), {
                date_from: dateFrom,
                date_to:   dateTo,
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
                date_from:   dateFrom,
                date_to:     dateTo,
                target_days: targetDays,
                buffer:      buffer,
            });
            setResults(res.data.results);
            setMeta(res.data);
        } catch (err) {
            const msg = err.response?.data?.message || "Gagal menghitung TOPSIS.";
            setValidation({ valid: false, message: msg });
        } finally {
            setCalculating(false);
        }
    };

    const canCalculate = validation?.valid === true;

    return (
        <>
            <Head title="Restock Prioritas — TOPSIS" />

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7b563f] to-[#5f3f2d] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#7b563f]/20">
                        <IconPackage size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Prioritas Restock Produk
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            Metode TOPSIS — Ranking prioritas produk yang perlu direstok berdasarkan data penjualan
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {/* ── Panel Form ─────────────────────────────────────────── */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-5 flex items-center gap-2">
                        <IconSearch size={16} className="text-[#7b563f]" />
                        Parameter Input
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
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

                        {/* Target Hari Stok */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                                <IconTarget size={12} />
                                Target Hari Stok
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="1"
                                    value={targetDays}
                                    onChange={(e) => setTargetDays(Number(e.target.value))}
                                    className="w-full h-10 px-3 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#7b563f]/20 focus:border-[#7b563f] transition-colors outline-none"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">hari</span>
                            </div>
                        </div>

                        {/* Buffer */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                                <IconPercentage size={12} />
                                Buffer Pengaman
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={buffer}
                                    onChange={(e) => setBuffer(Number(e.target.value))}
                                    className="w-full h-10 px-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#7b563f]/20 focus:border-[#7b563f] transition-colors outline-none"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</span>
                            </div>
                        </div>
                    </div>

                    {/* Info bobot */}
                    <div className="mb-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                            <IconInfoCircle size={12} />
                            Bobot Kriteria TOPSIS yang Digunakan:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {CRITERIA_LABELS.map((c, j) => (
                                <span key={j} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                                    <span className="text-[#7b563f]">{c.key}</span> {c.label}:{" "}
                                    <span className="text-[#7b563f]">{(WEIGHTS[j] * 100).toFixed(0)}%</span>
                                    <span className={`ml-1 text-[9px] ${c.type === "BENEFIT" ? "text-green-500" : "text-red-500"}`}>
                                        ({c.type})
                                    </span>
                                </span>
                            ))}
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

                        {/* Tombol Hitung TOPSIS */}
                        <button
                            onClick={handleCalculate}
                            disabled={!canCalculate || calculating}
                            title={!canCalculate ? "Lakukan validasi terlebih dahulu" : ""}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                canCalculate && !calculating
                                    ? "bg-gradient-to-r from-[#7b563f] to-[#5f3f2d] hover:from-[#694733] hover:to-[#4e3725] text-white shadow-lg shadow-[#7b563f]/25"
                                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                            }`}
                        >
                            {calculating ? (
                                <IconLoader2 size={16} className="animate-spin" />
                            ) : (
                                <IconRefresh size={16} />
                            )}
                            {calculating ? "Menghitung..." : "Cek (Hitung TOPSIS)"}
                        </button>
                    </div>
                </div>

                {/* ── Alert Banner ───────────────────────────────────────── */}
                {validation && (
                    <div
                        className={`flex items-start gap-3 p-4 rounded-2xl border text-sm font-medium ${
                            validation.valid
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
                            <p className="font-bold">{validation.valid ? "✅ Data Valid" : "❌ Validasi Gagal"}</p>
                            <p className="mt-0.5">{validation.message}</p>
                            {validation.valid && (
                                <p className="text-xs mt-1 opacity-80">
                                    {validation.total_trx} transaksi · {validation.total_products} produk unik.
                                    Klik <strong>"Cek (Hitung TOPSIS)"</strong> untuk melihat ranking.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Tabel Hasil ────────────────────────────────────────── */}
                {results !== null && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        {/* Table Header */}
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <IconTrophy size={18} className="text-yellow-500" />
                                Hasil Ranking Prioritas Restock
                            </h2>
                            {meta && (
                                <span className="text-xs text-slate-400">
                                    {meta.date_from} s/d {meta.date_to} · {results.length} produk
                                </span>
                            )}
                        </div>

                        {results.length === 0 ? (
                            <div className="py-16 text-center">
                                <IconAlertTriangle size={36} className="mx-auto text-slate-300 mb-3" />
                                <p className="text-slate-500 font-medium">Tidak ada data yang bisa dihitung.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 dark:bg-slate-800">
                                        <tr>
                                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider w-12">No</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Produk</th>
                                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Total Jual</th>
                                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Stok</th>
                                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Hari Stok</th>
                                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Skor C_i</th>
                                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Qty Restock</th>
                                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Ranking</th>
                                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Detail</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {results.map((r, i) => (
                                            <tr
                                                key={r.product_id}
                                                className={`transition-colors ${
                                                    r.rank === 1
                                                        ? "bg-yellow-50/60 dark:bg-yellow-900/10"
                                                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                                }`}
                                            >
                                                <td className="px-4 py-3 text-center text-slate-400 text-xs">{i + 1}</td>
                                                <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                                                    {r.product_name}
                                                </td>
                                                <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">
                                                    {r.total_qty} unit
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`font-bold ${r.stock === 0 ? "text-red-500" : r.stock <= 5 ? "text-amber-500" : "text-slate-600 dark:text-slate-400"}`}>
                                                        {r.stock}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`text-xs font-semibold ${r.stock_days < 7 ? "text-red-600" : r.stock_days < 14 ? "text-amber-600" : "text-slate-500"}`}>
                                                        {r.stock_days === 9999 ? "∞" : `${r.stock_days} hr`}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <span className="font-mono font-bold text-[#7b563f] dark:text-[#ead7bf]">
                                                            {fmtNum(r.score, 4)}
                                                        </span>
                                                        <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-[#c8a87a] to-[#7b563f] rounded-full"
                                                                style={{ width: `${Math.min(100, r.score * 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {r.qty_restock > 0 ? (
                                                        <span className="px-2.5 py-1 rounded-full bg-[#fdf0e6] dark:bg-[#5f3f2d]/40 text-[#7b563f] dark:text-[#ead7bf] text-xs font-bold">
                                                            +{r.qty_restock} unit
                                                        </span>
                                                    ) : (
                                                        <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                                            Cukup
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <RankBadge rank={r.rank} />
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() => setSelectedProduct(r)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#f5ebdf] dark:hover:bg-[#5f3f2d]/40 text-slate-600 dark:text-slate-300 hover:text-[#7b563f] text-xs font-semibold transition-colors"
                                                    >
                                                        <IconEye size={13} />
                                                        Detail
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Keterangan */}
                        {results.length > 0 && (
                            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                                <p className="font-semibold text-slate-600 dark:text-slate-300">📖 Keterangan:</p>
                                <p>• <strong>Skor C_i</strong>: Mendekati 1 = sangat butuh restock. Mendekati 0 = stok masih aman.</p>
                                <p>• <strong>Qty Restock</strong>: Estimasi unit yang perlu ditambah = max(0, ⌈Target_hari × avg_per_hari × (1 + buffer%) − stok⌉)</p>
                                <p>• <strong>Hari Stok</strong>: Estimasi berapa hari stok tersisa berdasarkan laju penjualan rata-rata harian.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedProduct && (
                <TopsisDetailModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </>
    );
}

RestockIndex.layout = (page) => <DashboardLayout children={page} />;
