import React, { useMemo } from "react";
import {
    IconReceipt,
    IconArrowRight,
    IconCheck,
    IconAlertCircle,
} from "@tabler/icons-react";
import PaymentMethodLogo from "./PaymentMethodLogo";
import { manualPaymentOptions } from "@/Utils/paymentMethods";

const formatPrice = (value = 0) =>
    value.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
    });

const directPaymentMethods = [
    "cash",
    ...manualPaymentOptions.map((option) => option.value),
];

// Quick Amount Button
function QuickAmountButton({ amount, onClick, isSelected }) {
    return (
        <button
            type="button"
            onClick={() => onClick(amount)}
            className={`
                flex-1 py-3 px-2 rounded-xl text-sm font-semibold
                transition-all duration-200 min-h-touch
                ${
                    isSelected
                        ? "bg-[#7b563f] text-white shadow-md shadow-[#7b563f]/30"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                }
            `}
        >
            {formatPrice(amount)}
        </button>
    );
}

// Payment Method Card
function PaymentMethodCard({ method, isSelected, onClick }) {
    return (
        <button
            type="button"
            onClick={() => onClick(method.value)}
            className={`
                w-full p-3 rounded-xl text-left transition-all duration-200
                border-2 flex items-center gap-3
                ${
                    isSelected
                        ? "border-[#7b563f] bg-[#fbf4eb] dark:bg-[#5f3f2d]/30"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900"
                }
            `}
        >
            <PaymentMethodLogo
                method={method.value}
                label={method.label}
                selected={isSelected}
                className="h-10 w-10 flex-shrink-0"
            />
            <div className="flex-1">
                <p
                    className={`text-sm font-semibold ${
                        isSelected
                            ? "text-[#7b563f] dark:text-[#ead7bf]"
                            : "text-slate-800 dark:text-slate-200"
                    }`}
                >
                    {method.label}
                </p>
                {method.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {method.description}
                    </p>
                )}
            </div>
            {isSelected && (
                <div className="w-6 h-6 rounded-full bg-[#7b563f] text-white flex items-center justify-center">
                    <IconCheck size={14} />
                </div>
            )}
        </button>
    );
}

// Main PaymentPanel Component
export default function PaymentPanel({
    subtotal = 0,
    discount = 0,
    discountInput = "",
    onDiscountChange,
    cash = 0,
    cashInput = "",
    onCashChange,
    paymentMethod = "cash",
    onPaymentMethodChange,
    paymentOptions = [],
    onSubmit,
    isSubmitting = false,
    hasItems = false,
    selectedCustomer = null,
    className = "",
}) {
    // Quick amount options
    const quickAmounts = [10000, 20000, 50000, 100000];

    // Calculations
    const payable = Math.max(subtotal - discount, 0);
    const isDirectPayment = directPaymentMethods.includes(paymentMethod);
    const change = isDirectPayment ? Math.max(cash - payable, 0) : 0;
    const remaining = isDirectPayment ? Math.max(payable - cash, 0) : 0;

    // Validation
    const canSubmit =
        hasItems &&
        selectedCustomer &&
        (isDirectPayment ? cash >= payable : true) &&
        !isSubmitting;

    // Submit label
    const submitLabel = useMemo(() => {
        if (!hasItems) return "Keranjang Kosong";
        if (!selectedCustomer) return "Pilih Pelanggan";
        if (isDirectPayment && remaining > 0)
            return `Kurang ${formatPrice(remaining)}`;
        return "Selesaikan Transaksi";
    }, [hasItems, selectedCustomer, isDirectPayment, remaining]);

    return (
        <div className={`flex flex-col h-full ${className}`}>
            {/* Header */}
            <div className="flex items-center gap-2 p-4 border-b border-slate-200 dark:border-slate-800">
                <IconReceipt
                    size={20}
                    className="text-slate-600 dark:text-slate-400"
                />
                <h2 className="text-base font-semibold text-slate-800 dark:text-white">
                    Pembayaran
                </h2>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
                {/* Summary */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">
                            Subtotal
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                            {formatPrice(subtotal)}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">
                            Diskon
                        </span>
                        <span className="font-medium text-[#8a4f35] dark:text-[#e3b79f]">
                            - {formatPrice(discount)}
                        </span>
                    </div>
                    <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />
                    <div className="flex justify-between">
                        <span className="text-base font-semibold text-slate-800 dark:text-white">
                            Total
                        </span>
                        <span className="text-xl font-bold text-[#7b563f] dark:text-[#ead7bf]">
                            {formatPrice(payable)}
                        </span>
                    </div>
                </div>

                {/* Discount Input */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Diskon (Rp)
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={discountInput}
                        onChange={(e) =>
                            onDiscountChange(
                                e.target.value.replace(/[^\d]/g, "")
                            )
                        }
                        placeholder="0"
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700
                            bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200
                            focus:ring-2 focus:ring-[#7b563f]/20 focus:border-[#7b563f]
                            transition-all text-base"
                    />
                </div>

                {/* Payment Method */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Metode Pembayaran
                    </label>
                    <div className="space-y-2">
                        {paymentOptions.map((method) => (
                            <PaymentMethodCard
                                key={method.value}
                                method={method}
                                isSelected={paymentMethod === method.value}
                                onClick={onPaymentMethodChange}
                            />
                        ))}
                    </div>
                </div>

                {/* Cash Input (only for cash payment) */}
                {isDirectPayment && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Jumlah Bayar (Rp)
                        </label>

                        {/* Quick Amounts */}
                        <div className="flex gap-2 mb-3">
                            {quickAmounts.map((amount) => (
                                <QuickAmountButton
                                    key={amount}
                                    amount={amount}
                                    onClick={(a) => onCashChange(String(a))}
                                    isSelected={cash === amount}
                                />
                            ))}
                        </div>

                        {/* Cash Input */}
                        <input
                            type="text"
                            inputMode="numeric"
                            value={cashInput}
                            onChange={(e) =>
                                onCashChange(
                                    e.target.value.replace(/[^\d]/g, "")
                                )
                            }
                            placeholder="0"
                            className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700
                                bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200
                                focus:ring-2 focus:ring-[#7b563f]/20 focus:border-[#7b563f]
                                transition-all text-lg font-semibold text-center"
                        />

                        {/* Change Display */}
                        <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                    Kembalian
                                </span>
                                <span
                                    className={`text-lg font-bold ${
                                        change > 0
                                            ? "text-[#8c6141]"
                                            : "text-slate-400"
                                    }`}
                                >
                                    {formatPrice(change)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Non-cash payment info */}
                {!isDirectPayment && (
                    <div className="p-3 rounded-xl bg-[#fbf4eb] dark:bg-[#6f4b36]/25 border border-[#e2c8ab] dark:border-[#7c563e]">
                        <div className="flex gap-2">
                            <IconAlertCircle
                                size={18}
                                className="text-[#a06d46] flex-shrink-0 mt-0.5"
                            />
                            <p className="text-sm text-[#8c6141] dark:text-[#e2bd8d]">
                                Tautan pembayaran akan muncul di halaman invoice
                                setelah transaksi dibuat.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={!canSubmit}
                    className={`
                        w-full h-14 rounded-xl text-base font-semibold
                        flex items-center justify-center gap-2
                        transition-all duration-200
                        ${
                            canSubmit
                                ? "bg-gradient-to-r from-[#7b563f] to-[#5f3f2d] hover:from-[#694733] hover:to-[#553827] text-white shadow-lg shadow-[#7b563f]/30 hover:shadow-xl hover:shadow-[#7b563f]/40 active:scale-[0.98]"
                                : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                        }
                    `}
                >
                    {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <span>{submitLabel}</span>
                            {canSubmit && <IconArrowRight size={20} />}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

// Export sub-components
PaymentPanel.QuickAmountButton = QuickAmountButton;
PaymentPanel.PaymentMethodCard = PaymentMethodCard;
