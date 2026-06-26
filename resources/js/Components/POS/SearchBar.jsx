import React, { useState, useEffect, useRef } from "react";
import { IconPhoto, IconSearch, IconX } from "@tabler/icons-react";
import { getProductImageUrl } from "@/Utils/imageUrl";

const formatPrice = (value = 0) =>
    value.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    });

export default function SearchBar({
    value = "",
    onChange,
    onSearch,
    onSelect,
    suggestions = [],
    isSearching = false,
    placeholder = "Cari produk...",
    autoFocus = false,
}) {
    const [isFocused, setIsFocused] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    const showSuggestions =
        isFocused && suggestions.length > 0 && value.length > 0;

    useEffect(() => {
        setSelectedIndex(-1);
    }, [suggestions]);

    const handleKeyDown = (e) => {
        if (!showSuggestions) {
            if (e.key === "Enter") {
                onSearch?.();
            }
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                break;
            case "Enter":
                e.preventDefault();
                if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                    onSelect?.(suggestions[selectedIndex]);
                    setIsFocused(false);
                    inputRef.current?.blur();
                } else {
                    onSearch?.();
                }
                break;
            case "Escape":
                setIsFocused(false);
                inputRef.current?.blur();
                break;
        }
    };

    useEffect(() => {
        if (listRef.current && selectedIndex >= 0) {
            const selectedItem = listRef.current.children[selectedIndex];
            if (selectedItem) {
                selectedItem.scrollIntoView({ block: "nearest" });
            }
        }
    }, [selectedIndex]);

    return (
        <div className="relative">
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    {isSearching ? (
                        <div className="w-5 h-5 border-2 border-[#7b563f] border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <IconSearch size={20} className="text-slate-400" />
                    )}
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    className="w-full h-14 pl-12 pr-14 rounded-2xl
                        border-2 border-slate-200 dark:border-slate-700
                        bg-white dark:bg-slate-900
                        text-slate-800 dark:text-slate-200 text-lg
                        placeholder-slate-400 dark:placeholder-slate-500
                        focus:ring-4 focus:ring-[#7b563f]/20 focus:border-[#7b563f] dark:focus:border-[#7b563f]
                        transition-all"
                />

                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {value && (
                        <button
                            type="button"
                            onClick={() => {
                                onChange("");
                                inputRef.current?.focus();
                            }}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <IconX size={18} className="text-slate-400" />
                        </button>
                    )}
                </div>
            </div>

            {showSuggestions && (
                <div
                    className="absolute top-full left-0 right-0 mt-2 py-2 rounded-xl
                        bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700
                        shadow-xl max-h-80 overflow-y-auto z-50 animate-slide-up"
                >
                    <ul ref={listRef}>
                        {suggestions.map((product, index) => (
                            <li key={product.id}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onSelect?.(product);
                                        setIsFocused(false);
                                    }}
                                    className={`
                                        w-full flex items-center gap-3 px-4 py-3 text-left
                                        transition-colors
                                        ${
                                            index === selectedIndex
                                                ? "bg-[#fbf4eb] dark:bg-[#5f3f2d]/30"
                                                : "hover:bg-slate-50 dark:hover:bg-slate-800"
                                        }
                                    `}
                                >
                                    <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                                        {product.image ? (
                                            <img
                                                src={getProductImageUrl(
                                                    product.image
                                                )}
                                                alt={product.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <IconPhoto
                                                    size={20}
                                                    className="text-slate-400"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                                            {product.title}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Stok: {product.stock}
                                        </p>
                                    </div>

                                    <div className="text-right flex-shrink-0">
                                        <p className="text-sm font-semibold text-[#7b563f] dark:text-[#ead7bf]">
                                            {formatPrice(product.sell_price)}
                                        </p>
                                        {product.stock <= 0 && (
                                            <span className="text-xs text-[#8a4f35] dark:text-[#e3b79f] font-medium">
                                                Habis
                                            </span>
                                        )}
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
