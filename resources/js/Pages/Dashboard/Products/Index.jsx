import React, { useEffect, useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import Button from "@/Components/Dashboard/Button";
import {
    IconArrowLeft,
    IconArrowRight,
    IconBrandInstagram,
    IconBrandWhatsapp,
    IconCirclePlus,
    IconClockHour4,
    IconCrown,
    IconDatabaseOff,
    IconLayoutGrid,
    IconList,
    IconMapPin,
    IconPackage,
    IconPencilCog,
    IconPhoto,
    IconSearch,
    IconSparkles,
    IconTrash,
} from "@tabler/icons-react";
import Search from "@/Components/Dashboard/Search";
import Table from "@/Components/Dashboard/Table";
import Pagination from "@/Components/Dashboard/Pagination";
import { getProductImageUrl } from "@/Utils/imageUrl";

const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
    }).format(value);

const normalizeWhatsAppNumber = (value = "") => {
    const digits = String(value).replace(/\D/g, "");

    if (!digits) {
        return "";
    }

    if (digits.startsWith("0")) {
        return `62${digits.slice(1)}`;
    }

    if (digits.startsWith("62")) {
        return digits;
    }

    return digits;
};

const formatWhatsAppDisplay = (value = "") => {
    const normalized = normalizeWhatsAppNumber(value);

    if (!normalized) {
        return "Belum diatur";
    }

    if (normalized.startsWith("62")) {
        return `+${normalized}`;
    }

    return normalized;
};

const buildProductWhatsAppLink = (whatsappNumber, product) => {
    const normalizedNumber = normalizeWhatsAppNumber(whatsappNumber);

    if (!normalizedNumber) {
        return null;
    }

    const message = [
        "Halo Admin Aisyah Dekorasi Jepara, saya ingin menanyakan produk berikut.",
        "",
        `Nama Produk: ${product.title}`,
        `Kategori: ${product.category?.name || "-"}`,
        `Harga Jual: ${formatCurrency(product.sell_price)}`,
        `Stok: ${product.stock} barang`,
    ].join("\n");

    return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`;
};

function ProductImage({ product, className = "" }) {
    const [hasError, setHasError] = useState(false);
    const imageSrc = !hasError && product.image
        ? getProductImageUrl(product.image)
        : null;

    if (!imageSrc) {
        return (
            <div
                className={`flex items-center justify-center bg-[#f5ede3] ${className}`}
            >
                <IconPhoto size={34} className="text-[#b89f88]" />
            </div>
        );
    }

    return (
        <img
            src={imageSrc}
            alt={product.title}
            className={className}
            loading="lazy"
            onError={() => setHasError(true)}
        />
    );
}

function ProductCard({
    product,
    canEdit,
    canDelete,
    isRegularUser,
    whatsappCompanyNumber,
    currentPage = 1,
}) {
    const lowStock = product.stock > 0 && product.stock <= 5;
    const outOfStock = product.stock === 0;
    const canManageDirectly = !isRegularUser && canEdit;
    const canViewDirectly = isRegularUser;
    const whatsappLink = isRegularUser
        ? buildProductWhatsAppLink(whatsappCompanyNumber, product)
        : null;
    const ActionComponent = canManageDirectly || canViewDirectly ? Link : "div";
    const actionProps = canManageDirectly
        ? { href: route("products.edit", { product: product.id, page: currentPage }) }
        : canViewDirectly
        ? { href: route("products.show", product.id) }
        : {};

    return (
        <div className="group overflow-hidden rounded-[18px] border border-[#eadbca] bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:rounded-[26px]">
            <div className="relative aspect-[4/4.9] overflow-hidden bg-[#f5ede3] dark:bg-slate-800 sm:aspect-[4/4.7]">
                <ProductImage
                    product={product}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute left-1.5 top-1.5 rounded-sm bg-[#7b563f] px-1.5 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-white sm:left-3 sm:top-3 sm:px-2 sm:text-[10px] sm:tracking-[0.2em]">
                    {product.category?.name || "Produk"}
                </div>

                <div className="absolute right-2 top-2 sm:right-3 sm:top-3">
                    {outOfStock ? (
                        <span className="rounded-full bg-danger-500 px-1.5 py-1 text-[9px] font-semibold text-white sm:px-3 sm:text-xs">
                            Habis
                        </span>
                    ) : lowStock ? (
                        <span className="rounded-full bg-warning-500 px-1.5 py-1 text-[9px] font-semibold text-white sm:px-3 sm:text-xs">
                            Sisa {product.stock}
                        </span>
                    ) : (
                        <span className="rounded-full bg-slate-900/60 px-1.5 py-1 text-[9px] font-medium text-white sm:px-3 sm:text-xs">
                            Stok {product.stock}
                        </span>
                    )}
                </div>

                {(canEdit || canDelete) && (
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-[#062f29]/0 opacity-0 transition-all group-hover:bg-[#062f29]/45 group-hover:opacity-100">
                        {canEdit && (
                            <Button
                                type={"edit"}
                                icon={<IconPencilCog size={18} />}
                                className={
                                    "rounded-xl bg-[#fffaf3] text-[#7b563f] shadow-lg hover:bg-[#f7eee4]"
                                }
                                href={route("products.edit", {
                                    product: product.id,
                                    page: currentPage,
                                })}
                            />
                        )}
                        {canDelete && (
                            <Button
                                type={"delete"}
                                icon={<IconTrash size={18} />}
                                className={
                                    "rounded-xl bg-white text-danger-600 shadow-lg hover:bg-danger-50"
                                }
                                url={route("products.destroy", product.id)}
                            />
                        )}
                    </div>
                )}
            </div>

            <div className="space-y-2 p-2.5 sm:space-y-3 sm:p-4">
                <div className="min-h-[34px] sm:min-h-[52px]">
                    <h3
                        className={`line-clamp-2 text-[12px] font-semibold leading-4 text-[#5c4131] dark:text-slate-100 sm:text-base sm:leading-6 ${
                            isRegularUser ? "text-center" : ""
                        }`}
                    >
                        {product.title}
                    </h3>
                </div>

                <div
                    className={`grid gap-1.5 rounded-2xl bg-[#fbf5ed] p-2 dark:bg-slate-800/60 sm:gap-3 sm:p-3 ${
                        isRegularUser ? "grid-cols-1" : "grid-cols-2"
                    }`}
                >
                    {!isRegularUser && (
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.1em] text-[#b29d89] sm:text-[11px] sm:tracking-[0.18em]">
                                Harga Beli
                            </p>
                            <p className="mt-1 break-words text-[10px] font-medium leading-4 text-[#7d6756] dark:text-slate-300 sm:text-sm">
                                {formatCurrency(product.buy_price)}
                            </p>
                        </div>
                    )}
                    <div className={isRegularUser ? "text-center" : "text-right"}>
                        <p className="text-[9px] uppercase tracking-[0.1em] text-[#b29d89] sm:text-[11px] sm:tracking-[0.18em]">
                            {isRegularUser ? "HARGA" : "HARGA JUAL"}
                        </p>
                        <p className="mt-1 break-words text-[10px] font-bold leading-4 text-[#7b563f] dark:text-[#ead7bf] sm:text-lg">
                            {formatCurrency(product.sell_price)}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <span className="text-[11px] font-medium text-[#7d6756] dark:text-slate-300 sm:text-sm">
                        {product.stock} barang
                    </span>
                    <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
                        <ActionComponent
                            {...actionProps}
                            className="inline-flex w-full items-center justify-center gap-1 rounded-full border border-[#dcc9b5] bg-[#fffaf3] px-2.5 py-1.5 text-[10px] font-semibold text-[#7b563f] sm:w-auto sm:gap-2 sm:px-4 sm:py-2 sm:text-xs"
                        >
                            {isRegularUser ? "Lihat" : "Kelola"}
                                <IconArrowRight size={12} />
                        </ActionComponent>
                        {isRegularUser && whatsappLink && (
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex w-full items-center justify-center gap-1 rounded-full bg-[#25D366] px-2.5 py-1.5 text-[10px] font-semibold text-white shadow-sm transition hover:bg-[#1fb85a] sm:w-auto sm:gap-2 sm:px-4 sm:py-2 sm:text-xs"
                            >
                                <IconBrandWhatsapp size={12} />
                                Chat dengan Admin
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Index({
    products,
    categories = [],
    filters = {},
    catalogBackgroundUrl = "/images/catalog-hero.jpeg",
}) {
    const { auth, settings } = usePage().props;
    const [viewMode, setViewMode] = useState("grid");
    const [currentHash, setCurrentHash] = useState(
        typeof window !== "undefined" ? window.location.hash : ""
    );
    const canCreate = Boolean(auth?.permissions?.["products-create"]);
    const canEdit = Boolean(auth?.permissions?.["products-edit"]);
    const canDelete = Boolean(auth?.permissions?.["products-delete"]);
    const isRegularUser = Boolean(auth?.regular);
    const whatsappCompanyNumber = settings?.whatsapp_company_number || "";
    const selectedCategoryId = filters?.category;
    const currentSearch = filters?.search || "";
    const heroProducts = Array.isArray(products?.data)
        ? products.data.slice(0, 3)
        : [];
    const latestProducts = Array.isArray(products?.data)
        ? products.data.slice(0, 4)
        : [];
    const featuredProducts = Array.isArray(products?.data)
        ? products.data.slice(4, 8)
        : [];
    const whatsappLink = normalizeWhatsAppNumber(whatsappCompanyNumber)
        ? `https://wa.me/${normalizeWhatsAppNumber(whatsappCompanyNumber)}`
        : null;
    const showCustomerHome = isRegularUser && currentHash === "#home";
    const showCustomerCategory = isRegularUser && currentHash === "#kategori";
    const showCustomerAbout = isRegularUser && currentHash === "#tentang-kami";
    const showCustomerContact = isRegularUser && currentHash === "#kontak";
    const showProductCatalog =
        !isRegularUser ||
        (!currentHash || currentHash === "#produk");
    const shouldShowCatalogHero = Number(products?.current_page || 1) === 1;

    useEffect(() => {
        if (typeof window === "undefined") {
            return undefined;
        }

        const syncHash = () => setCurrentHash(window.location.hash);

        syncHash();
        window.addEventListener("hashchange", syncHash);

        return () => window.removeEventListener("hashchange", syncHash);
    }, []);

    const handleBack = () => {
        if (typeof window === "undefined") {
            return;
        }

        if (window.history.length > 1) {
            window.history.back();
            return;
        }

        window.location.href = isRegularUser
            ? `${route("products.index")}#home`
            : route("dashboard");
    };

    return (
        <>
            <Head title="Produk" />

            <div className="space-y-6">
                <div>
                    <button
                        type="button"
                        onClick={handleBack}
                        className="inline-flex items-center gap-2 rounded-full border border-[#e4d6c8] bg-white px-4 py-2 text-sm font-medium text-[#7b563f] shadow-sm transition hover:bg-[#fff7ea] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                        <IconArrowLeft size={16} />
                        Kembali
                    </button>
                </div>
                {shouldShowCatalogHero && (!isRegularUser || showCustomerHome) && (
                    <section
                        id="home"
                        className={`relative overflow-hidden rounded-[24px] shadow-xl sm:rounded-[30px] sm:shadow-2xl ${
                            isRegularUser
                                ? "bg-[#f7efe4] text-[#6f4b36]"
                                : "bg-[#7a5640] text-white"
                        }`}
                    >
                    <div
                        className="absolute inset-0 bg-center bg-no-repeat"
                        style={{
                            backgroundImage: `url('${catalogBackgroundUrl}')`,
                            backgroundSize: "contain",
                            filter: isRegularUser
                                ? "blur(2.5px) brightness(1.04) saturate(0.96)"
                                : "blur(3px) brightness(0.9) saturate(1.02)",
                            transform: "scale(1.03)",
                        }}
                    />
                    <div
                        className={`absolute inset-0 ${
                            isRegularUser
                                ? "bg-[linear-gradient(120deg,rgba(255,249,241,0.92),rgba(247,238,227,0.88),rgba(232,214,192,0.68))]"
                                : "bg-[linear-gradient(120deg,rgba(72,43,28,0.76),rgba(124,88,63,0.52),rgba(236,222,196,0.18))]"
                        }`}
                    />
                    <div
                        className={`absolute inset-0 ${
                            isRegularUser ? "bg-[#fffaf3]/40" : "bg-[#f1e3cd]/8"
                        }`}
                    />
                    <div className="relative px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
                        {isRegularUser ? (
                            <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr] xl:items-center">
                                <div className="flex flex-col justify-between gap-4 xl:max-w-[420px]">
                                    <div>
                                        <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#e4d2bf] bg-[#fffaf3]/90 px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#8a6a52] shadow-sm sm:mb-4 sm:gap-2 sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.24em]">
                                            <IconCrown size={14} className="text-[#b89271]" />
                                            Aisyah Dekorasi
                                        </p>
                                        <h1 className="max-w-md text-[0.95rem] font-semibold leading-[1.2] text-[#6a4936] sm:text-[2rem] lg:text-[3rem]">
                                            Jangan lewatkan kesempatan memiliki meubel berkualitas dengan harga terbaik!
                                        </h1>
                                        <p className="mt-2.5 max-w-xl text-[11px] leading-5.5 text-[#7c6858] sm:mt-5 sm:text-base sm:leading-8">
                                            Aisyah Dekorasi Jepara menyediakan berbagai produk meubel berkualitas tinggi yang dibuat dari material pilihan dengan sentuhan khas pengrajin Jepara.
                                        </p>
                                        <p className="mt-1.5 max-w-xl text-[11px] leading-5.5 text-[#8a7667] sm:mt-3 sm:text-base sm:leading-8">
                                            Setiap produk dirancang untuk memberikan kenyamanan, keindahan, serta ketahanan jangka panjang sehingga mampu memenuhi kebutuhan interior rumah maupun ruang usaha Anda.
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-start gap-2 text-[11px] text-[#7c6858] sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 sm:text-sm">
                                        <Link
                                            href={`${route("products.index")}#produk`}
                                            className="inline-flex items-center gap-1.5 rounded-full border border-[#e4d2bf] bg-[#fffaf3] px-3.5 py-2 font-semibold text-[#6f4b36] shadow-sm transition hover:bg-white sm:gap-2 sm:px-5 sm:py-3"
                                        >
                                            Lihat Produk
                                            <IconArrowRight size={14} />
                                        </Link>
                                        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#ead8c6] bg-[#fff8ef]/90 px-3.5 py-2 shadow-sm sm:gap-2 sm:px-5 sm:py-3">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#c7a27f]" />
                                            {products.total} produk terdaftar
                                        </div>
                                    </div>
                                </div>

                                {heroProducts.length > 0 && (
                                    <div className="grid gap-3 md:grid-cols-2 xl:max-w-[620px] xl:justify-self-end">
                                        <div className="space-y-3">
                                            {heroProducts[0] && (
                                                <div className="group relative overflow-hidden rounded-[22px] border border-[#eadbca] bg-[#fffaf3]/90 shadow-lg backdrop-blur-sm sm:rounded-[28px]">
                                                    <div className="absolute left-3 top-3 z-10 rounded-sm bg-[#c7a27f] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-white sm:left-4 sm:top-4 sm:px-3 sm:py-2 sm:text-[11px] sm:tracking-[0.28em]">
                                                        Baru
                                                    </div>
                                                    <ProductImage
                                                        product={heroProducts[0]}
                                                        className="h-32 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-44"
                                                    />
                                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#fff8ef] via-[#fff8ef]/88 to-transparent p-3 sm:p-4">
                                                        <p className="line-clamp-2 text-[13px] font-semibold text-[#6a4936] sm:text-xl">
                                                            {heroProducts[0].title}
                                                        </p>
                                                        <p className="mt-1 text-[10px] text-[#8a7667] sm:text-sm">
                                                            {formatCurrency(heroProducts[0].sell_price)}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {heroProducts[1] && (
                                                <div className="group relative overflow-hidden rounded-[22px] border border-[#eadbca] bg-[#fffaf3]/90 shadow-lg backdrop-blur-sm sm:rounded-[28px]">
                                                    <div className="absolute left-3 top-3 z-10 rounded-sm bg-[#c7a27f] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-white sm:left-4 sm:top-4 sm:px-3 sm:py-2 sm:text-[11px] sm:tracking-[0.28em]">
                                                        Populer
                                                    </div>
                                                    <ProductImage
                                                        product={heroProducts[1]}
                                                        className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-56"
                                                    />
                                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#fff8ef] via-[#fff8ef]/88 to-transparent p-3 sm:p-4">
                                                        <p className="line-clamp-2 text-[13px] font-semibold text-[#6a4936] sm:text-xl">
                                                            {heroProducts[1].title}
                                                        </p>
                                                        <p className="mt-1 text-[10px] text-[#8a7667] sm:text-sm">
                                                            {formatCurrency(heroProducts[1].sell_price)}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {heroProducts[2] && (
                                            <div className="group relative overflow-hidden rounded-[22px] border border-[#eadbca] bg-[#fffaf3]/90 shadow-lg backdrop-blur-sm sm:rounded-[28px]">
                                                <div className="absolute left-3 top-3 z-10 rounded-sm bg-[#c7a27f] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-white sm:left-4 sm:top-4 sm:px-3 sm:py-2 sm:text-[11px] sm:tracking-[0.28em]">
                                                    Unggulan
                                                </div>
                                                <ProductImage
                                                    product={heroProducts[2]}
                                                    className="h-full min-h-[220px] w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:min-h-[300px]"
                                                />
                                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#fff8ef] via-[#fff8ef]/90 to-transparent p-4 sm:p-5">
                                                    <p className="line-clamp-2 text-[1rem] font-semibold leading-tight text-[#6a4936] sm:text-[1.5rem]">
                                                        {heroProducts[2].title}
                                                    </p>
                                                    <p className="mt-1.5 text-xs text-[#8a7667] sm:text-base">
                                                        {formatCurrency(heroProducts[2].sell_price)}
                                                    </p>
                                                    <Link
                                                        href={route("products.show", heroProducts[2].id)}
                                                        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#dcc9b5] bg-[#fffaf3] px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6f4b36] sm:mt-5 sm:gap-2 sm:px-5 sm:py-3 sm:text-sm sm:tracking-[0.2em]"
                                                    >
                                                        Lihat Produk
                                                        <IconArrowRight size={14} />
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr] xl:items-center">
                                <div className="flex flex-col justify-between gap-4 xl:max-w-[320px]">
                                    <div>
                                        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/85 sm:mb-4 sm:px-4 sm:text-[11px]">
                                            <IconSparkles size={14} />
                                            Katalog Produk
                                        </p>
                                        <div className="space-y-2">
                                            <h1 className="max-w-sm text-[1.3rem] font-semibold leading-[1.2] tracking-[0.01em] text-[#fff7ec] sm:text-[1.6rem] lg:text-[1.9rem]">
                                                <span className="block">
                                                    Keindahan Kayu Jepara
                                                </span>
                                                <span className="mt-1 block">
                                                    dengan Kualitas Meuble yang
                                                    Terpercaya
                                                </span>
                                            </h1>
                                            <p className="text-[11px] uppercase tracking-[0.3em] text-white/70">
                                                Furniture for Better Living
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/82">
                                        {canCreate && (
                                            <Button
                                                type={"link"}
                                                icon={
                                                    <IconCirclePlus
                                                        size={15}
                                                        strokeWidth={1.75}
                                                    />
                                                }
                                                className={"bg-transparent px-0 py-0 text-[#f6ecdd] shadow-none hover:bg-transparent hover:text-white"}
                                                label={"Tambah Produk"}
                                                href={route("products.create")}
                                            />
                                        )}
                                        <div className="inline-flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#f2ddc3]" />
                                            {products.total} produk terdaftar
                                        </div>
                                    </div>
                                </div>

                                {heroProducts.length > 0 && (
                                    <div className="flex gap-3 overflow-x-auto pb-2 pr-1 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 xl:w-full xl:max-w-[860px] xl:grid-cols-3 xl:justify-self-end">
                                        {[
                                            { label: "Baru", product: heroProducts[0] },
                                            { label: "Populer", product: heroProducts[1] },
                                            { label: "Unggulan", product: heroProducts[2] },
                                        ].map(
                                            ({ label, product }) =>
                                                product && (
                                                    <div
                                                        key={`${label}-${product.id}`}
                                                        className="group relative h-full min-w-[180px] flex-shrink-0 overflow-hidden rounded-[22px] border border-white/15 bg-white/10 shadow-lg backdrop-blur-sm sm:min-w-0 sm:rounded-[24px]"
                                                    >
                                                        <div className="absolute left-3 top-3 z-10 rounded-sm bg-[#7b563f] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white">
                                                            {label}
                                                        </div>
                                                        <ProductImage
                                                            product={product}
                                                            className="h-32 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-44 xl:h-52"
                                                        />
                                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#3e271a]/88 via-[#3e271a]/38 to-transparent p-3.5">
                                                            <p className="line-clamp-2 text-xs font-semibold leading-snug text-white sm:text-base">
                                                                {product.title}
                                                            </p>
                                                            <p className="mt-1 text-xs text-white/85">
                                                                {formatCurrency(
                                                                    product.sell_price
                                                                )}
                                                            </p>
                                                            {label === "Unggulan" && (
                                                                <Link
                                                                    href={
                                                                        canEdit
                                                                            ? route("products.edit", {
                                                                                  product: product.id,
                                                                                  page: products.current_page,
                                                                              })
                                                                            : route(
                                                                                  "products.show",
                                                                                  product.id
                                                                              )
                                                                    }
                                                                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#fff4e8] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6f4b36]"
                                                                >
                                                                    Lihat
                                                                    <IconArrowRight size={13} />
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    </section>
                )}

                {showCustomerCategory && categories.length > 0 && (
                    <section id="kategori" className="space-y-4">
                        <div>
                            <h3 className="text-3xl font-semibold text-[#6f4b36]">
                                Kategori Produk
                            </h3>
                            <p className="mt-2 text-sm text-[#7c6858]">
                                Pilih kategori agar produk lebih mudah ditemukan.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Link
                                href={`${route("products.index")}#produk`}
                                className="rounded-full bg-[#7b563f] px-4 py-2 text-sm font-medium text-white transition-colors"
                            >
                                Semua
                            </Link>
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={route("products.index", {
                                        category: category.id,
                                    })}
                                    className="rounded-full border border-[#dcc9b5] bg-white px-4 py-2 text-sm font-medium text-[#7b563f] hover:bg-[#fff7ea]"
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {showProductCatalog && (
                    <>
                <div
                    id="produk"
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div>
                        <h2 className="text-xl font-semibold text-[#6f4b36] dark:text-white sm:text-3xl">
                            Aisyah Dekorasi
                        </h2>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="w-full sm:w-80">
                            <Search
                                url={route("products.index")}
                                placeholder="Cari produk..."
                                initialValue={currentSearch}
                                params={{
                                    category: selectedCategoryId || undefined,
                                }}
                            />
                        </div>
                        <div className="flex w-full items-center gap-1.5 rounded-full border border-[#e4d6c8] bg-white p-1 dark:border-slate-700 dark:bg-slate-900 sm:w-auto">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`flex-1 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors sm:flex-none sm:px-4 sm:py-2 sm:text-sm ${
                                    viewMode === "grid"
                                        ? "bg-[#7b563f] text-white"
                                        : "text-slate-500 hover:text-[#7b563f]"
                                }`}
                                title="Tampilan Grid"
                            >
                                <span className="inline-flex items-center gap-1.5 sm:gap-2">
                                    <IconLayoutGrid size={16} />
                                    Kotak
                                </span>
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`flex-1 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors sm:flex-none sm:px-4 sm:py-2 sm:text-sm ${
                                    viewMode === "list"
                                        ? "bg-[#7b563f] text-white"
                                        : "text-slate-500 hover:text-[#7b563f]"
                                }`}
                                title="Tampilan Daftar"
                            >
                                <span className="inline-flex items-center gap-1.5 sm:gap-2">
                                    <IconList size={16} />
                                    Daftar
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {products.data.length > 0 ? (
                    viewMode === "grid" ? (
                        <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-3 lg:gap-4">
                            {products.data.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    canEdit={canEdit}
                                    canDelete={canDelete}
                                    isRegularUser={isRegularUser}
                                    whatsappCompanyNumber={whatsappCompanyNumber}
                                    currentPage={products.current_page}
                                />
                            ))}
                        </div>
                    ) : (
                        <Table.Card title={"Data Produk"}>
                            <Table>
                                <Table.Thead>
                                    <tr>
                                        <Table.Th className="w-10">No</Table.Th>
                                        <Table.Th>Produk</Table.Th>
                                        <Table.Th>Kategori</Table.Th>
                                        {!isRegularUser && <Table.Th>Harga Beli</Table.Th>}
                                        <Table.Th className={isRegularUser ? "text-center" : ""}>
                                            {isRegularUser ? "HARGA" : "HARGA JUAL"}
                                        </Table.Th>
                                        <Table.Th>Stok</Table.Th>
                                            {(canEdit || canDelete || isRegularUser) && (
                                                <Table.Th></Table.Th>
                                            )}
                                        </tr>
                                    </Table.Thead>
                                <Table.Tbody>
                                    {products.data.map((product, i) => (
                                        <tr
                                            className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                            key={product.id}
                                        >
                                            <Table.Td className="text-center">
                                                {++i +
                                                    (products.current_page - 1) *
                                                        products.per_page}
                                            </Table.Td>
                                            <Table.Td>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 overflow-hidden rounded-xl bg-[#f5ede3] dark:bg-slate-800">
                                                        <ProductImage
                                                            product={product}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p
                                                            className={`text-sm font-medium text-slate-800 dark:text-slate-200 ${
                                                                isRegularUser
                                                                    ? "text-center"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {product.title}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Table.Td>
                                            <Table.Td>
                                                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                    {product.category?.name}
                                                </span>
                                            </Table.Td>
                                            {!isRegularUser && (
                                                <Table.Td>
                                                    {formatCurrency(
                                                        product.buy_price
                                                    )}
                                                </Table.Td>
                                            )}
                                            <Table.Td
                                                className={`font-semibold text-[#7b563f] dark:text-[#ead7bf] ${
                                                    isRegularUser ? "text-center" : ""
                                                }`}
                                            >
                                                {formatCurrency(
                                                    product.sell_price
                                                )}
                                            </Table.Td>
                                            <Table.Td>
                                                <span
                                                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                                                        product.stock === 0
                                                            ? "bg-danger-100 text-danger-700 dark:bg-danger-900/50 dark:text-danger-400"
                                                            : product.stock <=
                                                              5
                                                            ? "bg-warning-100 text-warning-700 dark:bg-warning-900/50 dark:text-warning-400"
                                                            : "bg-success-100 text-success-700 dark:bg-success-900/50 dark:text-success-400"
                                                    }`}
                                                >
                                                    {product.stock}
                                                </span>
                                            </Table.Td>
                                            {(canEdit || canDelete || isRegularUser) && (
                                                <Table.Td>
                                                    <div className="flex gap-2">
                                                        {isRegularUser && (
                                                            <a
                                                                href={
                                                                    buildProductWhatsAppLink(
                                                                        whatsappCompanyNumber,
                                                                        product
                                                                    ) || "#"
                                                                }
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                onClick={(event) => {
                                                                    if (!whatsappCompanyNumber) {
                                                                        event.preventDefault();
                                                                    }
                                                                }}
                                                                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${
                                                                    whatsappCompanyNumber
                                                                        ? "bg-[#25D366] text-white hover:bg-[#1fb85a]"
                                                                        : "cursor-not-allowed bg-slate-200 text-slate-500"
                                                                }`}
                                                            >
                                                                <IconBrandWhatsapp size={14} />
                                                                Chat dengan Admin
                                                            </a>
                                                        )}
                                                        {canEdit && (
                                                            <Button
                                                                type={"edit"}
                                                                icon={
                                                                    <IconPencilCog
                                                                        size={16}
                                                                        strokeWidth={
                                                                            1.5
                                                                        }
                                                                    />
                                                                }
                                                                className={
                                                                    "border border-warning-200 bg-warning-100 text-warning-600 hover:bg-warning-200 dark:border-warning-800 dark:bg-warning-900/50 dark:text-warning-400"
                                                                }
                                                                href={route("products.edit", {
                                                                    product: product.id,
                                                                    page: products.current_page,
                                                                })}
                                                            />
                                                        )}
                                                        {canDelete && (
                                                            <Button
                                                                type={"delete"}
                                                                icon={
                                                                    <IconTrash
                                                                        size={16}
                                                                        strokeWidth={
                                                                            1.5
                                                                        }
                                                                    />
                                                                }
                                                                className={
                                                                    "border border-danger-200 bg-danger-100 text-danger-600 hover:bg-danger-200 dark:border-danger-800 dark:bg-danger-900/50 dark:text-danger-400"
                                                                }
                                                                url={route(
                                                                    "products.destroy",
                                                                    product.id
                                                                )}
                                                            />
                                                        )}
                                                    </div>
                                                </Table.Td>
                                            )}
                                        </tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </Table.Card>
                    )
                ) : (
                    <div className="rounded-[26px] border border-[#eadbca] bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-900">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f5ede3] dark:bg-slate-800">
                            <IconDatabaseOff
                                size={32}
                                className="text-[#b08f74]"
                                strokeWidth={1.5}
                            />
                        </div>
                        <h3 className="mb-1 text-lg font-medium text-slate-800 dark:text-slate-200">
                            Belum Ada Produk
                        </h3>
                        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                            Tambahkan produk pertama Anda untuk memulai.
                        </p>
                        {canCreate && (
                            <Button
                                type={"link"}
                                icon={<IconCirclePlus size={18} />}
                                className={
                                    "bg-[#7b563f] text-white hover:bg-[#694733]"
                                }
                                label={"Tambah Produk"}
                                href={route("products.create")}
                            />
                        )}
                    </div>
                )}

                {products.last_page !== 1 && <Pagination links={products.links} />}
                    </>
                )}

                {showCustomerAbout && (
                    <section id="tentang-kami" className="grid gap-3 lg:grid-cols-2 lg:gap-4">
                        <div className="rounded-[22px] border border-[#eadbca] bg-white p-4 shadow-sm sm:rounded-[28px] sm:p-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b79b82]">
                                Tentang Kami
                            </p>
                            <h3 className="mt-2 text-xl font-semibold text-[#6f4b36] sm:mt-3 sm:text-2xl">
                                Profil perusahaan meubel
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-[#7c6858] sm:mt-4 sm:leading-7">
                                Aisyah Dekorasi Jepara menghadirkan furniture dan dekorasi bernuansa Jepara dengan pengerjaan rapi, material pilihan, dan desain yang elegan untuk rumah, usaha, maupun acara spesial.
                            </p>
                            <div className="mt-5 space-y-3 text-sm text-[#7c6858] sm:mt-6 sm:space-y-4">
                                <div className="flex items-start gap-2.5 sm:gap-3">
                                    <IconMapPin size={18} className="mt-0.5 text-[#8e6b50]" />
                                    <div>
                                        <p className="font-semibold text-[#6f4b36]">Alamat</p>
                                        <p>
                                            Jl. RA. Rukmini, RT.024/RW.007,
                                            Senenan, Kec. Tahunan, Kabupaten
                                            Jepara, Jawa Tengah 59426
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5 sm:gap-3">
                                    <IconClockHour4 size={18} className="mt-0.5 text-[#8e6b50]" />
                                    <div>
                                        <p className="font-semibold text-[#6f4b36]">Jam operasional</p>
                                        <p>Senin - Sabtu, 08.00 - 17.00 WIB</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[22px] border border-[#eadbca] bg-white p-4 shadow-sm sm:rounded-[28px] sm:p-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b79b82]">
                                Maps Lokasi
                            </p>
                            <h3 className="mt-2 text-xl font-semibold text-[#6f4b36] sm:mt-3 sm:text-2xl">
                                Kunjungi showroom kami
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-[#7c6858] sm:mt-4 sm:leading-7">
                                Untuk melihat produk secara langsung, Anda bisa mengunjungi lokasi kami di Jepara dan berkonsultasi mengenai kebutuhan furniture yang diinginkan.
                            </p>
                            <a
                                href="https://maps.app.goo.gl/cpkeLs9DwT2JpAuTA"
                                target="_blank"
                                rel="noreferrer"
                                className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#dcc9b5] bg-[#fff7ea] px-4 py-2.5 text-sm font-semibold text-[#6f4b36] transition hover:bg-[#f7ebdb] sm:mt-6 sm:px-5 sm:py-3"
                            >
                                <IconMapPin size={16} />
                                Buka Maps Lokasi
                            </a>
                        </div>
                    </section>
                )}

                {showCustomerContact && (
                    <section id="kontak" className="rounded-[22px] border border-[#eadbca] bg-white p-4 shadow-sm sm:rounded-[28px] sm:p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b79b82]">
                            Kontak
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-[#6f4b36] sm:mt-3 sm:text-2xl">
                            Hubungi kami
                        </h3>
                        <div className="mt-5 grid gap-3 md:grid-cols-2 sm:mt-6 sm:gap-4">
                            <div className="rounded-[18px] bg-[#fbf5ed] p-4 sm:rounded-[22px] sm:p-5">
                                <div className="flex items-center gap-2.5 sm:gap-3">
                                    <IconBrandWhatsapp size={22} className="text-[#25D366]" />
                                    <p className="text-base font-semibold text-[#6f4b36] sm:text-lg">
                                        Nomor WhatsApp Perusahaan
                                    </p>
                                </div>
                                <p className="mt-3 text-sm text-[#7c6858]">
                                    {formatWhatsAppDisplay(whatsappCompanyNumber)}
                                </p>
                                {whatsappLink && (
                                    <a
                                        href={whatsappLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1fb85a]"
                                    >
                                        <IconBrandWhatsapp size={16} />
                                        Chat WhatsApp
                                    </a>
                                )}
                            </div>
                            <div className="rounded-[18px] bg-[#fbf5ed] p-4 sm:rounded-[22px] sm:p-5">
                                <div className="flex items-center gap-2.5 sm:gap-3">
                                    <IconBrandInstagram size={22} className="text-[#8e6b50]" />
                                    <p className="text-base font-semibold text-[#6f4b36] sm:text-lg">
                                        Instagram
                                    </p>
                                </div>
                                <p className="mt-3 text-sm text-[#7c6858]">
                                    aisyah.d.jepara
                                </p>
                                <a
                                    href="https://www.instagram.com/aisyah.d.jepara/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#dcc9b5] bg-white px-4 py-2 text-sm font-semibold text-[#6f4b36] transition hover:bg-[#f7ebdb]"
                                >
                                    <IconBrandInstagram size={16} />
                                    Buka Instagram
                                </a>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}

Index.layout = (page) => <DashboardLayout children={page} />;
