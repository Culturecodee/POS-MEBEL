import { useState, useMemo } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    IconSearch,
    IconPackage,
    IconPhoto,
    IconLogin,
} from "@tabler/icons-react";

const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);

export default function Welcome({ categories = [], products = [] }) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Filtering products on client side
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase()) ||
                (product.description && product.description.toLowerCase().includes(search.toLowerCase()));
            const matchesCategory = selectedCategory ? product.category_id === selectedCategory : true;
            return matchesSearch && matchesCategory;
        });
    }, [products, search, selectedCategory]);

    return (
        <>
            <Head title="Katalog Galeri Mebel Jepara - Aisyah Dekorasi" />

            <div className="min-h-screen bg-[#fdfaf6] text-slate-800 font-sans selection:bg-[#c8aa8c]/30 selection:text-[#5d4333]">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#ebdccb]/60 transition-all duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/aisyah-logo.jpg"
                                alt="Aisyah Dekorasi Logo"
                                className="h-12 w-12 rounded-xl object-cover shadow-md ring-2 ring-[#ebdccb]/50"
                            />
                            <div>
                                <h1 className="text-lg font-bold tracking-tight text-[#5d4333]">
                                    Aisyah Dekorasi
                                </h1>
                                <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#a07c60]">
                                    Galeri Mebel Jepara
                                </p>
                            </div>
                        </div>

                        {/* Auth Buttons - Login Only */}
                        
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-br from-[#f6ecdd] via-[#fdfaf6] to-[#fff7eb] py-16 sm:py-24 border-b border-[#ebdccb]/40">
                    <div className="absolute inset-0 z-0 opacity-10">
                        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#7b563f] blur-3xl" />
                        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#c8aa8c] blur-3xl" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4e7d5] text-xs font-semibold text-[#8b6b50] tracking-wider uppercase mb-6">
                            Pameran Seni Kayu Jati Premium
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#473022] max-w-3xl mx-auto leading-tight">
                            Galeri Koleksi Mebel Jati Jepara
                        </h2>
                        <p className="mt-4 text-base sm:text-lg text-[#745e4f] max-w-2xl mx-auto font-medium">
                            Menampilkan mahakarya mebel kayu jati solid hasil pahatan pengrajin profesional Jepara.
                        </p>

                        {/* Search Bar */}
                        <div className="mt-10 max-w-md mx-auto">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <IconSearch size={20} />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Cari produk mebel di galeri..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#ebdccb] bg-white text-sm text-slate-800 shadow-sm transition-all focus:border-[#7b563f] focus:ring-4 focus:ring-[#7b563f]/10 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Category Filter */}
                    <div className="mb-10 text-center">
                        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#a07c60] mb-4">
                            Kategori Koleksi
                        </h3>
                        <div className="flex flex-wrap justify-center gap-2">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition duration-200 ${
                                    selectedCategory === null
                                        ? "bg-[#7b563f] text-white shadow-md shadow-[#7b563f]/20"
                                        : "bg-white text-[#7b563f] border border-[#ebdccb] hover:bg-[#fff9f2]"
                                }`}
                            >
                                Semua Koleksi
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition duration-200 ${
                                        selectedCategory === category.id
                                            ? "bg-[#7b563f] text-white shadow-md shadow-[#7b563f]/20"
                                            : "bg-white text-[#7b563f] border border-[#ebdccb] hover:bg-[#fff9f2]"
                                    }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Products Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => {
                                const isLowStock = product.stock > 0 && product.stock <= 5;
                                const isOutOfStock = product.stock === 0;

                                return (
                                    <div
                                        key={product.id}
                                        className="group flex flex-col rounded-3xl border border-[#ebdccb]/60 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                                    >
                                        {/* Image Area */}
                                        <div className="relative aspect-square overflow-hidden bg-slate-100">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "/images/catalog-hero.jpeg";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-[#fcf8f3]">
                                                    <IconPhoto size={36} className="text-[#c8aa8c]" />
                                                </div>
                                            )}

                                            <div className="absolute left-3 top-3 rounded-lg bg-[#7b563f] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-white">
                                                {product.category?.name || "Mebel"}
                                            </div>

                                            <div className="absolute right-3 top-3">
                                                {isOutOfStock ? (
                                                    <span className="rounded-full bg-red-500 px-2.5 py-1 text-[9px] font-bold text-white uppercase tracking-wider">
                                                        Habis
                                                    </span>
                                                ) : isLowStock ? (
                                                    <span className="rounded-full bg-amber-500 px-2.5 py-1 text-[9px] font-bold text-white uppercase tracking-wider">
                                                        Stok Terbatas
                                                    </span>
                                                ) : (
                                                    <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[9px] font-bold text-white uppercase tracking-wider">
                                                        Tersedia
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Info Area - Passive details only */}
                                        <div className="flex-1 p-5 flex flex-col justify-between">
                                            <div className="space-y-2">
                                                <h4 className="text-base font-bold text-[#473022]">
                                                    {product.title}
                                                </h4>
                                                <p className="text-xs text-slate-500 leading-relaxed min-h-[40px]">
                                                    {product.description || "Furnitur jepara berkualitas premium buatan pengrajin lokal berpengalaman."}
                                                </p>
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-[#ebdccb]/40">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="text-[9px] uppercase tracking-[0.1em] font-semibold text-slate-400 block">
                                                            Estimasi Harga
                                                        </span>
                                                        <span className="text-base font-extrabold text-[#7b563f]">
                                                            {formatCurrency(product.sell_price)}
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[9px] uppercase tracking-[0.1em] font-semibold text-slate-400 block">
                                                            Jumlah Stok
                                                        </span>
                                                        <span className="text-xs font-bold text-slate-700">
                                                            {product.stock} unit
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20 border-2 border-dashed border-[#ebdccb]/60 rounded-3xl bg-white">
                            <IconPackage size={48} className="mx-auto text-[#c8aa8c] mb-3" />
                            <h4 className="text-lg font-bold text-[#5d4333]">
                                Koleksi Tidak Ditemukan
                            </h4>
                            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                                Coba ubah kata kunci pencarian Anda atau pilih kategori koleksi yang lain.
                            </p>
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="bg-[#473022] text-[#e0cfbe] py-10 border-t border-[#352318]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
                        <p className="text-sm font-medium">
                            &copy; {new Date().getFullYear()} Toko Aisyah Dekorasi Jepara. Semua Hak Dilindungi.
                        </p>
                        <p className="text-[11px] text-[#bcaaa4] max-w-md mx-auto">
                            Menampilkan koleksi furniture jati premium. Transaksi pembelian hanya dilayani secara langsung/internal oleh petugas kasir di gerai kami.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
