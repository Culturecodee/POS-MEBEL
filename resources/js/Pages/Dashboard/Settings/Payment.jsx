import React, { useEffect } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import Input from "@/Components/Dashboard/Input";
import {
    IconCreditCard,
    IconDeviceFloppy,
    IconCash,
} from "@tabler/icons-react";
import toast from "react-hot-toast";

export default function Payment({ setting, supportedGateways = [] }) {
    const { flash } = usePage().props;

    const { data, setData, put, errors, processing } = useForm({
        default_gateway: setting?.default_gateway ?? "cash",
        whatsapp_company_number: setting?.whatsapp_company_number ?? "",
        midtrans_enabled: setting?.midtrans_enabled ?? false,
        midtrans_server_key: setting?.midtrans_server_key ?? "",
        midtrans_client_key: setting?.midtrans_client_key ?? "",
        midtrans_production: setting?.midtrans_production ?? false,
        xendit_enabled: setting?.xendit_enabled ?? false,
        xendit_secret_key: setting?.xendit_secret_key ?? "",
        xendit_public_key: setting?.xendit_public_key ?? "",
        xendit_production: setting?.xendit_production ?? false,
    });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("settings.payments.update"), { preserveScroll: true });
    };

    const isGatewaySelectable = (gateway) => {
        if (gateway === "cash") return true;
        if (gateway === "whatsapp") return Boolean(data.whatsapp_company_number);
        if (gateway === "midtrans") return data.midtrans_enabled;
        if (gateway === "xendit") return data.xendit_enabled;
        return false;
    };

    return (
        <>
            <Head title="Pengaturan Payment" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <IconCreditCard size={28} className="text-[#8a5a3c]" />
                    Pengaturan Payment Gateway
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                        <IconCash size={18} />
                        Gateway Default
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Gateway pembayaran default yang digunakan kasir saat
                        membuka halaman transaksi.
                    </p>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Pilih Gateway
                        </label>
                        <select
                            value={data.default_gateway}
                            onChange={(e) =>
                                setData("default_gateway", e.target.value)
                            }
                            className="w-full h-11 px-4 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-[#8a5a3c]/20 focus:border-[#8a5a3c] transition-all"
                        >
                            {supportedGateways.map((gw) => (
                                <option
                                    key={gw.value}
                                    value={gw.value}
                                    disabled={!isGatewaySelectable(gw.value)}
                                >
                                    {gw.label}
                                    {!isGatewaySelectable(gw.value) &&
                                        " (nonaktif)"}
                                </option>
                            ))}
                        </select>
                        {errors?.default_gateway && (
                            <small className="text-xs text-[#9b5c43] mt-1">
                                {errors.default_gateway}
                            </small>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                        <IconCash size={18} />
                        WhatsApp Perusahaan
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Nomor ini dipakai untuk membuka pesanan transaksi ke WhatsApp perusahaan.
                    </p>
                    <Input
                        label="Nomor WhatsApp"
                        type="text"
                        value={data.whatsapp_company_number}
                        onChange={(e) =>
                            setData("whatsapp_company_number", e.target.value)
                        }
                        errors={errors?.whatsapp_company_number}
                        placeholder="6281234567890"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#8a5a3c] hover:bg-[#6f4b36] text-white font-medium transition-colors disabled:opacity-50"
                    >
                        <IconDeviceFloppy size={18} />
                        {processing ? "Menyimpan..." : "Simpan Konfigurasi"}
                    </button>
                </div>
            </form>
        </>
    );
}

Payment.layout = (page) => <DashboardLayout children={page} />;
