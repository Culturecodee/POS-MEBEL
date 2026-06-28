import React, { useEffect, useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Toaster, toast } from "react-hot-toast";
import {
    IconArrowLeft,
    IconBrandWhatsapp,
    IconPrinter,
    IconExternalLink,
    IconReceipt,
    IconFileInvoice,
    IconCircleCheck,
    IconInfoCircle,
    IconX,
} from "@tabler/icons-react";
import ThermalReceipt, {
    ThermalReceipt58mm,
} from "@/Components/Receipt/ThermalReceipt";
import PaymentMethodLogo from "@/Components/POS/PaymentMethodLogo";
import { paymentMethodLabels } from "@/Utils/paymentMethods";

export default function Print({ transaction }) {
    const { errors, flash } = usePage().props;
    const [printMode, setPrintMode] = useState("invoice"); // 'invoice' | 'thermal80' | 'thermal58'
    const [showDebugModal, setShowDebugModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (errors && Object.keys(errors).length > 0) {
            Object.values(errors).forEach((err) => {
                toast.error(err);
            });
        }
    }, [flash, errors]);

    const formatPrice = (price = 0) =>
        Number(price || 0).toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        });

    const formatDateTime = (value) =>
        new Date(value).toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    const items = transaction?.details ?? [];

    const paymentMethodKey = (
        transaction?.payment_method || "cash"
    ).toLowerCase();
    const paymentMethodLabel =
        paymentMethodLabels[paymentMethodKey] ?? "Tunai";
    const isDirectPayment = [
        "cash",
        "dana",
        "bank_bri",
        "bank_bca",
        "bank_mandiri",
        "bank_bni",
    ].includes(paymentMethodKey);

    const paymentStatuses = {
        paid: "Lunas",
        pending: "Menunggu",
        failed: "Gagal",
        expired: "Kedaluwarsa",
    };
    const paymentStatusKey = (transaction?.payment_status || "").toLowerCase();
    const paymentStatusLabel =
        paymentStatuses[paymentStatusKey] ??
        (paymentMethodKey === "cash" ? "Lunas" : "Menunggu");

    const statusColors = {
        paid: "bg-[#f3e7d9] text-[#7b563f] dark:bg-[#5f3f2d]/30 dark:text-[#ead7bf]",
        pending:
            "bg-[#fbf4eb] text-[#8c6141] dark:bg-[#6f4b36]/25 dark:text-[#e2bd8d]",
        failed: "bg-[#f6e8de] text-[#8a4f35] dark:bg-[#6a3f2d]/40 dark:text-[#e3b79f]",
        expired:
            "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
    };
    const paymentStatusColor =
        statusColors[paymentStatusKey] ?? statusColors.paid;

    const isNonCash = paymentMethodKey !== "cash";
    const showPaymentLink = isNonCash && transaction.payment_url;

    useEffect(() => {
        if (paymentMethodKey === "whatsapp" && transaction.payment_url) {
            window.open(transaction.payment_url, "_blank", "noopener,noreferrer");
        }
    }, [paymentMethodKey, transaction.payment_url]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Head title="Invoice Penjualan" />
            <Toaster position="top-right" />

            <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-8 px-4 print:bg-white print:p-0">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
                        <Link
                            href={route("transactions.index")}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <IconArrowLeft size={18} />
                            Kembali ke kasir
                        </Link>

                        <div className="flex items-center gap-2">
                            {/* Print Mode Selector */}
                            <div className="flex bg-slate-200 dark:bg-slate-800 rounded-xl p-1">
                                <button
                                    onClick={() => setPrintMode("invoice")}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${printMode === "invoice"
                                            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow"
                                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                                        }`}
                                >
                                    <IconFileInvoice
                                        size={16}
                                        className="inline mr-1"
                                    />
                                    Invoice
                                </button>
                                <button
                                    onClick={() => setPrintMode("thermal80")}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${printMode === "thermal80"
                                            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow"
                                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                                        }`}
                                >
                                    <IconReceipt
                                        size={16}
                                        className="inline mr-1"
                                    />
                                    Struk 80mm
                                </button>
                                <button
                                    onClick={() => setPrintMode("thermal58")}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${printMode === "thermal58"
                                            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow"
                                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                                        }`}
                                >
                                    <IconReceipt
                                        size={16}
                                        className="inline mr-1"
                                    />
                                    Struk 58mm
                                </button>
                            </div>

                            {showPaymentLink && (
                                <a
                                    href={transaction.payment_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#dcc9b5] dark:border-[#6f4b36] text-sm font-semibold text-[#7b563f] dark:text-[#ead7bf] hover:bg-[#fbf4eb] dark:hover:bg-[#5f3f2d]/30 transition-colors"
                                >
                                    {paymentMethodKey === "whatsapp" ? (
                                        <IconBrandWhatsapp size={18} />
                                    ) : (
                                        <IconExternalLink size={18} />
                                    )}
                                    {paymentMethodKey === "whatsapp"
                                        ? "Kirim ke WhatsApp"
                                        : "Pembayaran"}
                                </a>
                            )}

                            <button
                                type="button"
                                onClick={handlePrint}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7b563f] hover:bg-[#694733] text-sm font-semibold text-white shadow-lg shadow-[#7b563f]/30 transition-colors"
                            >
                                <IconPrinter size={18} />
                                Cetak
                            </button>
                        </div>
                    </div>

                    {/* Status Alert Banners */}
                    {transaction.status === "pending" && (
                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-250 dark:border-amber-900/50 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
                            <div className="space-y-1">
                                <h4 className="text-base font-bold text-amber-800 dark:text-amber-400">
                                    Transaksi Ini Masih Pending (Menunggu Validasi)
                                </h4>
                                <p className="text-xs text-amber-700 dark:text-amber-500">
                                    Silakan lakukan pengecekan kesesuaian barang, kuantitas, harga, dan fisik barang. Jika sudah sesuai, klik tombol di sebelah kanan untuk memotong stok secara resmi.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowConfirmModal(true)}
                                className="w-full md:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors whitespace-nowrap flex items-center justify-center gap-2"
                            >
                                <IconCircleCheck size={18} />
                                Selesaikan Transaksi
                            </button>
                        </div>
                    )}

                    {transaction.status === "success" && (
                        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900/50 rounded-2xl p-5 print:hidden">
                            <h4 className="text-base font-bold text-emerald-800 dark:text-emerald-400">
                                Transaksi Sukses & Valid
                            </h4>
                            <p className="text-xs text-emerald-700 dark:text-emerald-505 mt-1">
                                Transaksi ini telah berhasil divalidasi dan stok mebel telah dipotong secara resmi di database.
                            </p>
                        </div>
                    )}

                    {transaction.status === "rejected" && (
                        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-250 dark:border-rose-900/50 rounded-2xl p-5 print:hidden">
                            <h4 className="text-base font-bold text-rose-800 dark:text-rose-400">
                                Transaksi Ditolak / Gagal Validasi
                            </h4>
                            <p className="text-xs text-rose-700 dark:text-rose-505 mt-1">
                                Transaksi ini ditolak karena validasi stok gagal (sisa stok mebel di database lebih kecil dari kuantitas pesanan). Silakan buat transaksi baru.
                            </p>
                        </div>
                    )}

                    {/* Thermal Receipt Preview */}
                    {(printMode === "thermal80" ||
                        printMode === "thermal58") && (
                            <div className="flex justify-center print:block">
                                <div className="bg-white rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl p-4 print:shadow-none print:border-0 print:p-0 print:rounded-none">
                                    {printMode === "thermal80" ? (
                                        <ThermalReceipt
                                            transaction={transaction}
                                            storeName="Aisyah Dekorasi"
                                            storeAddress="Jl. RA Kardinah"
                                            storePhone="0895403630602"
                                        />
                                    ) : (
                                        <ThermalReceipt58mm
                                            transaction={transaction}
                                            storeName="Aisyah Dekorasi"
                                            storePhone="0895403630602"
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                    {/* Invoice View */}
                    {printMode === "invoice" && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl print:shadow-none print:border-slate-300">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-[#7b563f] to-[#5f3f2d] px-6 py-6 text-white print:bg-slate-100 print:text-slate-900">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <IconReceipt size={24} />
                                            <span className="text-sm font-medium opacity-90 print:opacity-100">
                                                INVOICE
                                            </span>
                                        </div>
                                        <p className="text-2xl font-bold">
                                            {transaction.invoice}
                                        </p>
                                        <p className="text-sm opacity-80 print:opacity-100 mt-1">
                                            {formatDateTime(
                                                transaction.created_at
                                            )}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <span
                                            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${paymentStatusColor}`}
                                        >
                                            {paymentStatusLabel}
                                        </span>
                                        <div className="mt-2 inline-flex items-center gap-2 rounded-xl bg-white/15 px-3 py-1.5 print:bg-white">
                                            <PaymentMethodLogo
                                                method={paymentMethodKey}
                                                label={paymentMethodLabel}
                                                className="h-8 w-8"
                                            />
                                            <p className="text-sm opacity-80 print:opacity-100">
                                                {paymentMethodLabel}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid md:grid-cols-2 gap-6 px-6 py-6 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                                        Pelanggan
                                    </p>
                                    <p className="text-base font-semibold text-slate-900 dark:text-white">
                                        {transaction.customer?.name ?? "Umum"}
                                    </p>
                                    {transaction.customer?.address && (
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {transaction.customer.address}
                                        </p>
                                    )}
                                    {transaction.customer?.phone && (
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {transaction.customer.phone}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                                        Kasir
                                    </p>
                                    <p className="text-base font-semibold text-slate-900 dark:text-white">
                                        {transaction.cashier?.name ?? "-"}
                                    </p>
                                </div>
                            </div>

                            {/* Items Table */}
                            <div className="px-6 py-6">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-slate-800">
                                            <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                                Produk
                                            </th>
                                            <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                                Harga
                                            </th>
                                            <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                                Qty
                                            </th>
                                            <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                                Subtotal
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {items.map((item, index) => {
                                            const quantity =
                                                Number(item.qty) || 1;
                                            const subtotal =
                                                Number(item.price) || 0;
                                            const unitPrice =
                                                subtotal / quantity;

                                            return (
                                                <tr key={item.id ?? index}>
                                                    <td className="py-3">
                                                        <p className="font-medium text-slate-900 dark:text-white">
                                                            {
                                                                item.product
                                                                    ?.title
                                                            }
                                                        </p>
                                                    </td>
                                                    <td className="py-3 text-right text-slate-600 dark:text-slate-400">
                                                        {formatPrice(unitPrice)}
                                                    </td>
                                                    <td className="py-3 text-center text-slate-600 dark:text-slate-400">
                                                        {quantity}
                                                    </td>
                                                    <td className="py-3 text-right font-semibold text-slate-900 dark:text-white">
                                                        {formatPrice(subtotal)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-6">
                                <div className="max-w-xs ml-auto space-y-2 text-sm">
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                        <span>Subtotal</span>
                                        <span>
                                            {formatPrice(
                                                transaction.grand_total +
                                                (transaction.discount || 0)
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                        <span>Diskon</span>
                                        <span>
                                            -{" "}
                                            {formatPrice(transaction.discount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                                        <span>Total</span>
                                        <span>
                                            {formatPrice(
                                                transaction.grand_total
                                            )}
                                        </span>
                                    </div>
                                    {isDirectPayment && (
                                        <>
                                            <div className="flex justify-between text-slate-600 dark:text-slate-400 pt-2">
                                                <span>Bayar</span>
                                                <span>
                                                    {formatPrice(
                                                        transaction.cash
                                                    )}
                                                </span>
                                            </div>
                                            {Number(transaction.change) > 0 && (
                                                <div className="flex justify-between text-[#8c6141] dark:text-[#e2bd8d] font-medium">
                                                    <span>Kembali</span>
                                                    <span>
                                                        {formatPrice(
                                                            transaction.change
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 text-center border-t border-slate-100 dark:border-slate-800">
                                <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                    Terima kasih telah berbelanja
                                </p>
                            </div>

                            {transaction.status === "pending" && (
                                <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-3 print:hidden">
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmModal(true)}
                                        className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 animate-pulse"
                                    >
                                        <IconCircleCheck size={20} />
                                        <span>Selesaikan Transaksi</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowDebugModal(true)}
                                        className="w-full sm:w-auto px-5 py-3.5 bg-slate-200 hover:bg-slate-350 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
                                    >
                                        <IconInfoCircle size={20} />
                                        <span>Detail Validasi</span>
                                    </button>
                                </div>
                            )}

                            {/* Developer Debug Modal */}
                            {showDebugModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:hidden">
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-[fadeIn_0.2s_ease-out]">
                                        
                                        {/* Modal Header */}
                                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-955/20">
                                            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                                <IconInfoCircle className="text-amber-500" size={22} />
                                                <h3 className="font-bold text-base">Rincian Validasi & Logika Development</h3>
                                            </div>
                                            <button 
                                                onClick={() => setShowDebugModal(false)}
                                                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                <IconX size={20} />
                                            </button>
                                        </div>

                                        {/* Modal Content */}
                                        <div className="p-6 overflow-y-auto space-y-6 text-sm">
                                            
                                            {/* Request Details Section */}
                                            <div className="space-y-3 text-left">
                                                <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                                    Informasi API Request
                                                </h4>
                                                <div className="bg-slate-50 dark:bg-slate-950/20 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 space-y-2 font-mono text-xs">
                                                    <div className="grid grid-cols-4 gap-1">
                                                        <span className="text-slate-400">Endpoint:</span>
                                                        <span className="col-span-3 break-all select-all font-bold text-slate-700 dark:text-slate-300">
                                                            {route("transactions.validate", transaction.id)}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-4 gap-1">
                                                        <span className="text-slate-400">Method:</span>
                                                        <span className="col-span-3 font-bold text-emerald-600 dark:text-emerald-400">POST</span>
                                                    </div>
                                                    <div className="grid grid-cols-4 gap-1">
                                                        <span className="text-slate-400">Headers:</span>
                                                        <span className="col-span-3 text-slate-500">
                                                            {"{ Accept: 'application/json', X-CSRF-TOKEN: '...' }"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Stock Deduction Audit */}
                                            <div className="space-y-3 text-left">
                                                <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                                    Audit Perubahan Stok Barang
                                                </h4>
                                                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                                                    <table className="w-full text-left border-collapse text-xs">
                                                        <thead>
                                                            <tr className="bg-slate-50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-medium">
                                                                <th className="p-3">Produk</th>
                                                                <th className="p-3 text-center">Stok Awal</th>
                                                                <th className="p-3 text-center">Qty Jual</th>
                                                                <th className="p-3 text-center">Stok Akhir</th>
                                                                <th className="p-3 text-center">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                            {transaction.details.map((detail, idx) => {
                                                                const sisaStok = (detail.product?.stock ?? 0) - detail.qty;
                                                                const isStockValid = sisaStok >= 0;
                                                                return (
                                                                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                                                                        <td className="p-3">
                                                                            <div className="font-medium text-slate-800 dark:text-slate-200">
                                                                                {detail.product?.title || "Produk Tidak Ditemukan"}
                                                                            </div>
                                                                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                                                                ID: {detail.product?.id || detail.product_id} | Barcode: {detail.product?.barcode || "-"}
                                                                            </div>
                                                                        </td>
                                                                        <td className="p-3 text-center font-mono text-slate-600 dark:text-slate-400">
                                                                            {detail.product?.stock ?? 0}
                                                                        </td>
                                                                        <td className="p-3 text-center font-mono font-bold text-amber-600">
                                                                            -{detail.qty}
                                                                        </td>
                                                                        <td className="p-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                                                                            {sisaStok}
                                                                        </td>
                                                                        <td className="p-3 text-center">
                                                                            {isStockValid ? (
                                                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30">
                                                                                    Stok Aman
                                                                                </span>
                                                                            ) : (
                                                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30">
                                                                                    Stok Kurang
                                                                                </span>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            {/* Raw Transaction Object Section */}
                                            <div className="space-y-3 text-left">
                                                <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                                    Raw JSON Data (Model Transaksi)
                                                </h4>
                                                <pre className="bg-slate-950 text-emerald-400 p-4 rounded-2xl overflow-auto max-h-48 text-[11px] font-mono select-all">
                                                    {JSON.stringify(transaction, null, 2)}
                                                </pre>
                                            </div>
                                        </div>

                                        {/* Modal Footer */}
                                        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setShowDebugModal(false)}
                                                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                                            >
                                                Tutup
                                            </button>
                                        </div>
                                    </div>
                                    </div>
                            )}

                            {/* Confirmation Modal */}
                            {showConfirmModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:hidden">
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col p-6 animate-[fadeIn_0.2s_ease-out] text-center">
                                        
                                        {/* Header Warning Icon */}
                                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30 mb-4">
                                            <IconCircleCheck size={28} />
                                        </div>

                                        {/* Title & Description */}
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
                                            Selesaikan Transaksi & Potong Stok
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
                                            Apakah Anda yakin ingin memvalidasi transaksi ini dan memotong stok barang secara resmi di database?
                                        </p>

                                        {/* Items Preview */}
                                        <div className="bg-slate-50 dark:bg-slate-950/20 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 text-left text-xs mb-6 max-h-32 overflow-y-auto space-y-2">
                                            <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
                                                Rincian Pemotongan Stok:
                                            </div>
                                            {transaction.details.map((detail, idx) => (
                                                <div key={idx} className="flex justify-between items-center gap-4">
                                                    <span className="font-medium text-slate-700 dark:text-slate-350 truncate flex-1">
                                                        {detail.product?.title || "Produk"}
                                                    </span>
                                                    <span className="font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap font-mono">
                                                        -{detail.qty} Pcs
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmModal(false)}
                                                className="flex-1 py-3 px-4 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl transition-colors text-sm"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowConfirmModal(false);
                                                    router.post(route("transactions.validate", transaction.id), {}, {
                                                        preserveScroll: true,
                                                    });
                                                }}
                                                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors text-sm"
                                            >
                                                Ya, Selesaikan
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
