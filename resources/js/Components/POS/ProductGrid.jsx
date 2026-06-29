import React, { useMemo } from "react";
import {
    IconArrowRight,
    IconPhoto,
    IconSearch,
    IconShoppingBagPlus,
    IconSparkles,
} from "@tabler/icons-react";
import { getProductImageUrl } from "@/Utils/imageUrl";

const formatPrice = (value = 0) =>
    value.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
    });

function SearchInput({
    value,
    onChange,
    onSearch,
    isSearching,
    placeholder,
    inputRef,
}) {
    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch?.()}
                placeholder={
                    placeholder ||
                    "Cari produk... (/ untuk fokus)"
                }
                className="h-12 w-full rounded-full border border-[#eadccf] bg-[#fffdfa] pl-5 pr-12 text-sm text-[#6a5140] placeholder:text-[#b69f8c] focus:border-[#c3aa93] focus:ring-2 focus:ring-[#c3aa93]/20"
                disabled={isSearching}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {isSearching ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#c3aa93] border-t-transparent" />
                ) : (
                    <IconSearch size={18} className="text-[#b3957c]" />
                )}
            </div>
        </div>
    );
}

function CategoryTab({ category, isActive, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                    ? "border-[#c3aa93] bg-[#cfb7a0] text-white shadow-md shadow-[#cfb7a0]/20"
                    : "border-[#eadccf] bg-white text-[#816655] hover:border-[#c3aa93] hover:text-[#a1826a]"
            }`}
        >
            {category.name}
        </button>
    );
}

function HeroPreviewCard({
    product,
    label,
    className = "",
    compact = false,
    onAddToCart,
    cartQty = 0,
}) {
    if (!product) return null;
    const remainingStock = product.stock - cartQty;
    const hasStock = remainingStock > 0;

    return (
        <button
            type="button"
            onClick={() => hasStock && onAddToCart(product)}
            disabled={!hasStock}
            className={`group relative overflow-hidden border border-white/35 bg-white/20 text-left backdrop-blur-sm transition-all ${className} ${
                hasStock ? "hover:bg-white/25 hover:scale-[1.01] cursor-pointer" : "cursor-not-allowed opacity-50"
            }`}
        >
            {product.image ? (
                <img
                    src={getProductImageUrl(product.image)}
                    alt={product.title}
                    className={`h-full w-full object-cover transition-transform duration-500 ${hasStock ? "group-hover:scale-105" : ""}`}
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/10">
                    <IconPhoto size={36} className="text-white/70" />
                </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#94735d]/65 via-[#b99883]/18 to-transparent" />
            <div className="absolute left-3 top-3 rounded-sm bg-[#c7ae97] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                {label}
            </div>

            <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <p
                    className={`font-semibold leading-tight ${
                        compact ? "text-sm" : "text-2xl"
                    }`}
                >
                    {product.title}
                </p>
                <p className="mt-1 text-xs text-white/80">
                    {formatPrice(product.sell_price)}
                </p>
                {!compact && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#fffaf3] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#9d7e66]">
                        Pilih Produk
                        <IconArrowRight size={14} />
                    </div>
                )}
            </div>
        </button>
    );
}

function ProductCard({ product, onAddToCart, isAdding, cartQty = 0 }) {
    const remainingStock = product.stock - cartQty;
    const hasStock = remainingStock > 0;

    return (
        <div className={`group overflow-hidden rounded-[26px] border border-[#eadbca] bg-white shadow-sm transition-all ${
            hasStock ? "hover:-translate-y-1 hover:shadow-xl cursor-pointer" : "opacity-60 cursor-not-allowed"
        }`}>
            <button
                type="button"
                onClick={() => hasStock && onAddToCart(product)}
                disabled={!hasStock || isAdding}
                className="block w-full text-left"
            >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#f5ede3]">
                    {product.image ? (
                        <img
                            src={getProductImageUrl(product.image)}
                            alt={product.title}
                            className={`h-full w-full object-cover transition-transform duration-500 ${hasStock ? "group-hover:scale-105" : ""}`}
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <IconPhoto
                                size={34}
                                className="text-[#b89f88]"
                            />
                        </div>
                    )}

                    <div className="absolute left-3 top-3 rounded-sm bg-[#c7ae97] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                        {product.category?.name || "Produk"}
                    </div>
                    {!hasStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#93725c]/45">
                            <span className="rounded-full bg-[#fffaf3] px-4 py-2 text-xs font-semibold text-[#9d7e66]">
                                {product.stock === 0 ? "Stok Habis" : "Batas Stok"}
                            </span>
                        </div>
                    )}
                </div>

                <div className="space-y-3 p-4">
                    <div className="min-h-[52px]">
                        <h3 className="line-clamp-2 text-sm font-semibold leading-6 text-[#5c4131]">
                            {product.title}
                        </h3>
                        <p className="mt-1 text-lg font-bold text-[#a17f68]">
                            {formatPrice(product.sell_price)}
                        </p>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.2em] text-[#b29d89]">
                                Stok
                            </p>
                            <p className="text-sm font-medium text-[#7d6756]">
                                {product.stock} {cartQty > 0 && <span className="text-xs text-[#a17f68] font-bold">({cartQty})</span>}
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#e5d6c8] px-4 py-2 text-xs font-semibold text-[#9d7e66] transition-all group-hover:border-[#c7ae97] group-hover:bg-[#c7ae97] group-hover:text-white">
                            <span>
                                {isAdding
                                    ? "Menambah..."
                                    : hasStock
                                    ? "Beli"
                                    : "Habis"}
                            </span>
                            <IconShoppingBagPlus size={15} />
                        </div>
                    </div>
                </div>
            </button>
        </div>
    );
}

export default function ProductGrid({
    products = [],
    categories = [],
    selectedCategory,
    onCategoryChange,
    searchQuery,
    onSearchChange,
    onSearch,
    isSearching,
    onAddToCart,
    addingProductId,
    searchInputRef,
    carts = [],
}) {
    const getCartQty = (productId) => {
        if (!productId) return 0;
        return carts.find((c) => c.product_id === productId)?.qty || 0;
    };

    const filteredProducts = products.filter((product) => {
        const matchesCategory =
            !selectedCategory || product.category_id === selectedCategory;
        const matchesSearch =
            !searchQuery ||
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.barcode?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const heroProducts = useMemo(() => filteredProducts.slice(0, 3), [filteredProducts]);
    return (
        <div className="h-full overflow-y-auto bg-[#f7f4ef] scrollbar-thin">
            <section className="bg-gradient-to-br from-[#e9ddd0] via-[#ddcaba] to-[#ceb59e] px-5 pb-10 pt-5 text-[#5f4a3c] sm:px-8 lg:px-10">
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-xl">
                        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/45 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8f725d]">
                            <IconSparkles size={14} />
                            Koleksi Produk
                        </p>
                        <h2 className="max-w-md text-4xl font-semibold leading-tight sm:text-5xl">
                            Pilih produk terbaik untuk transaksi toko Anda
                        </h2>
                        <p className="mt-4 max-w-lg text-sm leading-7 text-[#7d6554]">
                            Pilih produk dengan lebih mudah melalui pencarian,
                            kategori, dan tambah langsung ke keranjang.
                        </p>
                    </div>

                    <div className="w-full max-w-md">
                        <SearchInput
                            value={searchQuery}
                            onChange={onSearchChange}
                            onSearch={onSearch}
                            isSearching={isSearching}
                            placeholder="Cari produk..."
                            inputRef={searchInputRef}
                        />
                    </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-[1.1fr_1.2fr]">
                    <div className="flex items-end">
                        <div className="max-w-sm space-y-5">
                            <h3 className="text-3xl font-semibold leading-tight sm:text-4xl">
                                Keindahan mebel dimulai dari detail
                            </h3>
                            <p className="text-sm leading-7 text-[#7d6554]">
                                Jelajahi katalog produk dengan tampilan baru
                                yang lebih modern, bersih, dan nyaman dipakai
                                saat transaksi berlangsung.
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    if (heroProducts[0]) {
                                        const qty = getCartQty(heroProducts[0].id);
                                        if (heroProducts[0].stock > qty) {
                                            onAddToCart(heroProducts[0]);
                                        }
                                    }
                                }}
                                disabled={heroProducts[0] && heroProducts[0].stock <= getCartQty(heroProducts[0].id)}
                                className="inline-flex items-center gap-3 rounded-full bg-[#fffaf5] px-6 py-3 text-sm font-semibold text-[#9d7e66] transition hover:bg-[#f7efe6] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Pilih sekarang
                                <IconArrowRight size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="grid min-h-[360px] gap-3 sm:grid-cols-[0.82fr_1.18fr]">
                        <div className="grid gap-3">
                            <HeroPreviewCard
                                product={heroProducts[0]}
                                label="Baru"
                                compact
                                onAddToCart={onAddToCart}
                                cartQty={getCartQty(heroProducts[0]?.id)}
                                className="min-h-[170px] rounded-[20px]"
                            />
                            <HeroPreviewCard
                                product={heroProducts[1]}
                                label="Populer"
                                compact
                                onAddToCart={onAddToCart}
                                cartQty={getCartQty(heroProducts[1]?.id)}
                                className="min-h-[170px] rounded-[20px]"
                            />
                        </div>
                        <HeroPreviewCard
                            product={heroProducts[2] || heroProducts[0]}
                            label="Unggulan"
                            onAddToCart={onAddToCart}
                            cartQty={getCartQty(heroProducts[2]?.id || heroProducts[0]?.id)}
                            className="min-h-[353px] rounded-[24px]"
                        />
                    </div>
                </div>
            </section>

            <section className="px-5 py-8 sm:px-8 lg:px-10">
                <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                        <h3 className="text-3xl font-semibold text-[#6f4b36]">
                            Produk Unggulan
                        </h3>
                    </div>
                    <span className="text-sm font-medium text-[#9d7e66]">
                        {filteredProducts.length} produk
                    </span>
                </div>

                <div className="mb-6 overflow-x-auto scrollbar-hide">
                    <div className="flex gap-2 pb-1">
                        <CategoryTab
                            category={{ id: null, name: "Semua" }}
                            isActive={!selectedCategory}
                            onClick={() => onCategoryChange(null)}
                        />
                        {categories.map((category) => (
                            <CategoryTab
                                key={category.id}
                                category={category}
                                isActive={selectedCategory === category.id}
                                onClick={() => onCategoryChange(category.id)}
                            />
                        ))}
                    </div>
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={onAddToCart}
                                isAdding={addingProductId === product.id}
                                cartQty={getCartQty(product.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex h-64 flex-col items-center justify-center rounded-[28px] border border-dashed border-[#dcc9b5] bg-white text-[#9f8a77]">
                        <IconSearch size={42} className="mb-3" />
                        <p className="text-sm">
                            {searchQuery
                                ? "Produk tidak ditemukan"
                                : "Tidak ada produk"}
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}

ProductGrid.Card = ProductCard;
ProductGrid.CategoryTab = CategoryTab;
ProductGrid.SearchInput = SearchInput;
