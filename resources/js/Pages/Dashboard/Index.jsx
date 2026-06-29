import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    IconBox,
    IconCategory,
    IconMoneybag,
    IconUsers,
    IconCoin,
    IconReceipt,
    IconTrendingUp,
    IconShoppingCart,
    IconClock,
} from "@tabler/icons-react";

const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
    }).format(value);

function StatCard({ title, value, subtitle, icon: Icon, gradient, href }) {
    const CardComponent = href ? Link : "div";

    return (
        <CardComponent
            {...(href ? { href } : {})}
            className={`relative min-w-[150px] flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${gradient} p-3.5 text-white shadow-lg sm:min-w-0 sm:rounded-2xl sm:p-5`}
        >
            <div className="absolute right-0 top-0 h-20 w-20 opacity-20 sm:h-32 sm:w-32">
                <Icon
                    size={96}
                    strokeWidth={0.5}
                    className="translate-x-6 -translate-y-6 transform sm:translate-x-8 sm:-translate-y-8"
                />
            </div>

            <div className="relative z-10">
                <div className="mb-2 flex items-center gap-2 sm:mb-3">
                    <div className="rounded-lg bg-white/20 p-1.5 sm:rounded-xl sm:p-2">
                        <Icon size={16} strokeWidth={1.5} className="sm:hidden" />
                        <Icon size={20} strokeWidth={1.5} className="hidden sm:block" />
                    </div>
                    <span className="text-[11px] font-medium leading-4 opacity-90 sm:text-sm">
                        {title}
                    </span>
                </div>

                <p className="text-base font-bold leading-5 sm:text-3xl">
                    {value}
                </p>
                {subtitle && (
                    <p className="mt-1 text-[10px] leading-4 opacity-80 sm:mt-2 sm:text-sm">
                        {subtitle}
                    </p>
                )}
                {href && (
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/85 sm:mt-3 sm:text-xs sm:tracking-[0.18em]">
                        Buka halaman
                    </p>
                )}
            </div>
        </CardComponent>
    );
}

function InfoCard({ title, value, icon: Icon, href }) {
    const CardComponent = href ? Link : "div";

    return (
        <CardComponent
            {...(href ? { href } : {})}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {title}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                        {value}
                    </p>
                    {href && (
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a5a3c] dark:text-[#e7c9aa]">
                            Buka halaman
                        </p>
                    )}
                </div>
                <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
                    <Icon
                        size={24}
                        className="text-slate-600 dark:text-slate-400"
                        strokeWidth={1.5}
                    />
                </div>
            </div>
        </CardComponent>
    );
}

export default function Dashboard({
    totalCategories,
    totalProducts,
    totalTransactions,
    totalUsers,
    totalRevenue,
    totalProfit,
    averageOrder,
    todayTransactions,
    recentTransactions = [],
}) {
    const { auth } = usePage().props;
    const permissions = auth?.permissions || {};
    const canOpenReports = Boolean(permissions["reports-access"]);
    const canOpenProfits = Boolean(permissions["profits-access"]);
    const canOpenTransactions = Boolean(permissions["transactions-access"]);
    const canOpenCategories = Boolean(permissions["categories-access"]);
    const canOpenProducts = Boolean(permissions["products-access"]);
    const canOpenUsers = Boolean(permissions["users-access"]);

    return (
        <>
            <Head title="Dashboard" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Dashboard
                        </h1>
                    </div>
                    <Link
                        href={route("transactions.index")}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#8a5a3c] px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-[#8a5a3c]/30 transition-colors hover:bg-[#6f4b36]"
                    >
                        <IconShoppingCart size={18} />
                        <span>Transaksi Baru</span>
                    </Link>
                </div>

                <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
                    <StatCard
                        title="Total Pendapatan"
                        value={formatCurrency(totalRevenue)}
                        subtitle="Akumulasi semua transaksi"
                        icon={IconCoin}
                        gradient="from-[#8a5a3c] to-[#5c3b2a]"
                        href={canOpenReports ? route("reports.sales.index") : null}
                    />
                    <StatCard
                        title="Total Profit"
                        value={formatCurrency(totalProfit)}
                        subtitle="Profit bersih"
                        icon={IconTrendingUp}
                        gradient="from-[#a66b3d] to-[#7a4a2d]"
                        href={canOpenProfits ? route("reports.profits.index") : null}
                    />
                    <StatCard
                        title="Rata-Rata Order"
                        value={formatCurrency(averageOrder)}
                        subtitle="Per transaksi"
                        icon={IconReceipt}
                        gradient="from-[#b68558] to-[#8a5a3c]"
                        href={canOpenTransactions ? route("transactions.history") : null}
                    />
                    <StatCard
                        title="Transaksi Hari Ini"
                        value={todayTransactions}
                        subtitle="Transaksi"
                        icon={IconClock}
                        gradient="from-[#c69c6d] to-[#a9784a]"
                        href={canOpenTransactions ? route("transactions.history") : null}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <InfoCard
                        title="Total Kategori"
                        value={totalCategories}
                        icon={IconCategory}
                        href={canOpenCategories ? route("categories.index") : null}
                    />
                    <InfoCard
                        title="Total Produk"
                        value={totalProducts}
                        icon={IconBox}
                        href={canOpenProducts ? route("products.index") : null}
                    />
                    <InfoCard
                        title="Total Transaksi"
                        value={totalTransactions}
                        icon={IconMoneybag}
                        href={canOpenTransactions ? route("transactions.history") : null}
                    />
                    <InfoCard
                        title="Total Pengguna"
                        value={totalUsers}
                        icon={IconUsers}
                        href={canOpenUsers ? route("users.index") : null}
                    />
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                    <div className="border-b border-slate-100 p-5 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-[#f1e0cf] p-2 dark:bg-[#5c3b2a]/30">
                                <IconReceipt
                                    size={18}
                                    className="text-[#8a5a3c] dark:text-[#e7c9aa]"
                                />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                    Transaksi Terbaru
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    5 transaksi terakhir
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-5">
                        {recentTransactions.length > 0 ? (
                            <div className="space-y-3">
                                {recentTransactions.map((trx, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                {trx.invoice}
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-500">
                                                {trx.date} • {trx.customer}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                Kasir: {trx.cashier}
                                            </p>
                                        </div>
                                        <p className="text-sm font-bold text-[#8a5a3c] dark:text-[#e7c9aa]">
                                            {formatCurrency(trx.total)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex h-32 items-center justify-center text-sm text-slate-400 dark:text-slate-500">
                                Belum ada transaksi
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page) => <DashboardLayout children={page} />;
