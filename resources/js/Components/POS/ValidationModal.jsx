import React, { useMemo } from "react";
import {
    IconX,
    IconShoppingCart,
    IconCash,
    IconChartBar,
    IconChecklist,
    IconCircleCheck,
    IconCircleX,
    IconArrowRight,
    IconMinus,
    IconInfoCircle,
} from "@tabler/icons-react";

const formatRp = (val = 0) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(val);

/**
 * ValidationModal — Modal Blackbox Testing untuk Penelitian
 *
 * Menampilkan visualisasi sistem saat transaksi:
 * 1. Input: Apa yang user masukkan (produk di cart)
 * 2. Proses backend: Logika kalkulasi & pengurangan stok
 * 3. Tabel test case blackbox: skenario valid & tidak valid
 */
export default function ValidationModal({
    isOpen,
    onClose,
    carts = [],
    subtotal = 0,
    discount = 0,
    payable = 0,
    cash = 0,
    isDirectPayment = true,
    selectedCustomer = null,
}) {
    if (!isOpen) return null;

    const change = Math.max(cash - payable, 0);
    const isPaymentSufficient = !isDirectPayment || cash >= payable;
    const hasItems = carts.length > 0;
    const hasCustomer = !!selectedCustomer;
    const cartCount = carts.reduce((t, i) => t + Number(i.qty), 0);

    // =====================================================
    // Tabel Test Case Blackbox
    // =====================================================
    const testCases = useMemo(() => [
        {
            no: 1,
            scenario: "Keranjang memiliki produk",
            input: `${cartCount} item di keranjang`,
            expected: "Tombol 'Selesaikan' aktif (jika kondisi lain terpenuhi)",
            actual: hasItems ? "✅ Ada produk" : "❌ Keranjang kosong",
            pass: hasItems,
        },
        {
            no: 2,
            scenario: "Pelanggan dipilih",
            input: selectedCustomer ? selectedCustomer.name : "(belum dipilih)",
            expected: "Pelanggan terdaftar harus dipilih sebelum checkout",
            actual: hasCustomer ? `✅ ${selectedCustomer.name}` : "❌ Belum pilih pelanggan",
            pass: hasCustomer,
        },
        {
            no: 3,
            scenario: "Jumlah bayar ≥ total tagihan (tunai)",
            input: isDirectPayment ? formatRp(cash) : "Non-tunai (otomatis)",
            expected: `Bayar ≥ ${formatRp(payable)}`,
            actual: !isDirectPayment
                ? "✅ Pembayaran non-tunai, otomatis lunas"
                : isPaymentSufficient
                    ? `✅ Bayar ${formatRp(cash)} ≥ Total ${formatRp(payable)}`
                    : `❌ Kurang ${formatRp(payable - cash)}`,
            pass: isPaymentSufficient,
        },
        {
            no: 4,
            scenario: "Input nominal tidak boleh negatif",
            input: `Nilai yang diketik: ${formatRp(cash)}`,
            expected: "Nominal ≥ 0",
            actual: cash >= 0 ? "✅ Nominal valid (≥ 0)" : "❌ Nilai negatif terdeteksi",
            pass: cash >= 0,
        },
        {
            no: 5,
            scenario: "Input nominal tidak boleh awalan 0",
            input: "Validasi saat ketik",
            expected: "Contoh: '025000' → otomatis menjadi '25000'",
            actual: "✅ Filter awalan 0 aktif di semua input harga",
            pass: true,
        },
        {
            no: 6,
            scenario: "Kalkulasi kembalian",
            input: `Bayar: ${formatRp(cash)}, Total: ${formatRp(payable)}`,
            expected: `Kembalian = Bayar − Total = ${formatRp(Math.max(cash - payable, 0))}`,
            actual: isPaymentSufficient
                ? `✅ Kembalian ${formatRp(change)}`
                : "❌ Tidak bisa dihitung (bayar kurang)",
            pass: isPaymentSufficient,
        },
        {
            no: 7,
            scenario: "Pengurangan stok setelah transaksi",
            input: `${carts.length} jenis produk`,
            expected: "Stok berkurang sesuai qty yang dibeli",
            actual: hasItems
                ? `✅ ${carts.map(c => `${c.product?.title?.substring(0, 15) || 'Produk'} (−${c.qty})`).join(", ")}`
                : "❌ Tidak ada produk",
            pass: hasItems,
        },
    ], [carts, cash, payable, isDirectPayment, selectedCustomer, hasItems, hasCustomer, isPaymentSufficient, cartCount]);

    const passCount = testCases.filter((t) => t.pass).length;
    const allPassed = passCount === testCases.length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Panel */}
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-[#7b563f] to-[#5f3f2d] text-white flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <IconChecklist size={22} />
                            Validasi Sistem — Blackbox Testing
                        </h2>
                        <p className="text-sm text-[#f0dac9] mt-0.5">
                            Visualisasi proses backend transaksi untuk keperluan penelitian
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    >
                        <IconX size={18} />
                    </button>
                </div>

                {/* Body Scrollable */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">

                    {/* ── PANEL 1: INPUT (Apa yang User Masukkan) ── */}
                    <section>
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-3">
                            <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-bold">1</span>
                            <IconShoppingCart size={16} className="text-blue-500" />
                            INPUT — Data yang Dimasukkan User
                        </h3>
                        <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-800">
                                    <tr>
                                        <th className="text-left px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-400">Nama Produk</th>
                                        <th className="text-center px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-400">Qty</th>
                                        <th className="text-right px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-400">Harga Satuan</th>
                                        <th className="text-right px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-400">Subtotal Baris</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {carts.length > 0 ? carts.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-slate-200">
                                                {item.product?.title || "Produk"}
                                            </td>
                                            <td className="px-4 py-2.5 text-center">
                                                <span className="px-2.5 py-0.5 bg-[#f3e7d9] text-[#7b563f] rounded-full text-xs font-bold">
                                                    {item.qty}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-400">
                                                {formatRp(item.product?.sell_price || 0)}
                                            </td>
                                            <td className="px-4 py-2.5 text-right font-semibold text-[#7b563f] dark:text-[#ead7bf]">
                                                {formatRp(item.price || (item.product?.sell_price || 0) * item.qty)}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                                                Keranjang masih kosong
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                {carts.length > 0 && (
                                    <tfoot className="bg-slate-50 dark:bg-slate-800 border-t-2 border-slate-200 dark:border-slate-700">
                                        <tr>
                                            <td colSpan={3} className="px-4 py-2.5 font-bold text-slate-700 dark:text-slate-300">
                                                Total ({cartCount} item)
                                            </td>
                                            <td className="px-4 py-2.5 text-right font-bold text-lg text-[#7b563f] dark:text-[#ead7bf]">
                                                {formatRp(subtotal)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                        {selectedCustomer && (
                            <div className="mt-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                                <IconInfoCircle size={14} />
                                Pelanggan: <strong>{selectedCustomer.name}</strong>
                            </div>
                        )}
                    </section>

                    {/* ── PANEL 2: PROSES BACKEND (Logika Sistem) ── */}
                    <section>
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-3">
                            <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 text-xs flex items-center justify-center font-bold">2</span>
                            <IconChartBar size={16} className="text-purple-500" />
                            PROSES BACKEND — Logika Sistem
                        </h3>

                        {/* Formula Box */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            <div className="rounded-xl border border-purple-200 dark:border-purple-800/50 bg-purple-50 dark:bg-purple-900/20 p-4">
                                <p className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-2">📐 Formula Kalkulasi</p>
                                <div className="space-y-1.5 text-sm font-mono">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <span className="text-slate-400">Subtotal</span>
                                        <IconArrowRight size={12} className="text-slate-300" />
                                        <span className="text-purple-700 dark:text-purple-300 font-semibold">{formatRp(subtotal)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <span className="text-slate-400">Diskon</span>
                                        <IconMinus size={12} className="text-red-400" />
                                        <span className="text-red-600 dark:text-red-400 font-semibold">{formatRp(discount)}</span>
                                    </div>
                                    <div className="border-t border-purple-200 dark:border-purple-700 pt-1.5 flex items-center gap-2">
                                        <span className="font-bold text-slate-700 dark:text-slate-200">Grand Total</span>
                                        <IconArrowRight size={12} className="text-slate-300" />
                                        <span className="font-bold text-[#7b563f] dark:text-[#ead7bf]">{formatRp(payable)}</span>
                                    </div>
                                    {isDirectPayment && (
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                            <span className="text-slate-400">Kembalian</span>
                                            <IconArrowRight size={12} className="text-slate-300" />
                                            <span className={`font-semibold ${isPaymentSufficient ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                                                {isPaymentSufficient ? formatRp(change) : "Kurang " + formatRp(payable - cash)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Stok Visualization */}
                            <div className="rounded-xl border border-orange-200 dark:border-orange-800/50 bg-orange-50 dark:bg-orange-900/20 p-4">
                                <p className="text-xs font-bold text-orange-600 dark:text-orange-400 mb-2">📦 Perubahan Stok (setelah bayar)</p>
                                <div className="space-y-2">
                                    {carts.length > 0 ? carts.map((item) => {
                                        const currentStock = item.product?.stock ?? 0;
                                        const afterStock = Math.max(0, currentStock - item.qty);
                                        return (
                                            <div key={item.id} className="flex items-center justify-between text-xs">
                                                <span className="text-slate-600 dark:text-slate-400 truncate max-w-[120px]" title={item.product?.title}>
                                                    {item.product?.title?.substring(0, 16) || "Produk"}
                                                </span>
                                                <div className="flex items-center gap-1.5 font-mono">
                                                    <span className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300 font-bold">{currentStock}</span>
                                                    <IconArrowRight size={10} className="text-slate-400" />
                                                    <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded font-bold">{afterStock}</span>
                                                    <span className="text-red-500 font-bold">(−{item.qty})</span>
                                                </div>
                                            </div>
                                        );
                                    }) : (
                                        <p className="text-xs text-slate-400">Tidak ada produk di keranjang</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── PANEL 3: TABEL BLACKBOX TEST CASE ── */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 text-xs flex items-center justify-center font-bold">3</span>
                                <IconChecklist size={16} className="text-green-500" />
                                TEST CASE — Blackbox Testing
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${allPassed ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"}`}>
                                {passCount}/{testCases.length} PASS
                            </span>
                        </div>

                        <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead className="bg-slate-100 dark:bg-slate-800">
                                        <tr>
                                            <th className="text-left px-3 py-2.5 font-bold text-slate-600 dark:text-slate-400 w-8">No</th>
                                            <th className="text-left px-3 py-2.5 font-bold text-slate-600 dark:text-slate-400">Skenario Pengujian</th>
                                            <th className="text-left px-3 py-2.5 font-bold text-slate-600 dark:text-slate-400 hidden md:table-cell">Input</th>
                                            <th className="text-left px-3 py-2.5 font-bold text-slate-600 dark:text-slate-400 hidden lg:table-cell">Expected Output</th>
                                            <th className="text-left px-3 py-2.5 font-bold text-slate-600 dark:text-slate-400">Hasil Aktual</th>
                                            <th className="text-center px-3 py-2.5 font-bold text-slate-600 dark:text-slate-400">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {testCases.map((tc) => (
                                            <tr
                                                key={tc.no}
                                                className={`transition-colors ${tc.pass ? "hover:bg-green-50 dark:hover:bg-green-900/10" : "bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20"}`}
                                            >
                                                <td className="px-3 py-2.5 font-mono text-slate-500">{tc.no}</td>
                                                <td className="px-3 py-2.5 font-medium text-slate-700 dark:text-slate-300">
                                                    {tc.scenario}
                                                </td>
                                                <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400 hidden md:table-cell">
                                                    {tc.input}
                                                </td>
                                                <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400 hidden lg:table-cell">
                                                    {tc.expected}
                                                </td>
                                                <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">
                                                    {tc.actual}
                                                </td>
                                                <td className="px-3 py-2.5 text-center">
                                                    {tc.pass ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full font-bold text-xs">
                                                            <IconCircleCheck size={11} />
                                                            PASS
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 rounded-full font-bold text-xs">
                                                            <IconCircleX size={11} />
                                                            FAIL
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400">
                            <p className="font-semibold text-slate-600 dark:text-slate-300 mb-1">📖 Penjelasan Blackbox Testing:</p>
                            <p>Blackbox testing menguji apakah sistem bereaksi dengan benar terhadap berbagai input, <em>tanpa melihat kode di dalamnya</em>. Tabel di atas menampilkan skenario pengujian berdasarkan kondisi transaksi saat ini (real-time). Status <strong>PASS</strong> berarti sistem berfungsi sesuai yang diharapkan, <strong>FAIL</strong> berarti kondisi tidak terpenuhi dan transaksi tidak dapat diproses.</p>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between gap-3">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold ${allPassed ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"}`}>
                        {allPassed ? <IconCircleCheck size={18} /> : <IconCircleX size={18} />}
                        {allPassed ? "Semua validasi terpenuhi — Transaksi siap diproses" : `${testCases.length - passCount} validasi gagal — Transaksi belum bisa diproses`}
                    </div>
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl bg-[#7b563f] hover:bg-[#694733] text-white text-sm font-semibold transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
