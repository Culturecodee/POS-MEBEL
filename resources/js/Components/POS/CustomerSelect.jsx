import React, { useState, useRef, useEffect } from "react";
import { router } from "@inertiajs/react";
import {
    IconUser,
    IconSearch,
    IconCheck,
    IconChevronDown,
    IconUserPlus,
} from "@tabler/icons-react";
import { CustomerHistoryButton } from "./CustomerHistoryPanel";
import AddCustomerModal from "./AddCustomerModal";

export default function CustomerSelect({
    customers = [],
    selected,
    onSelect,
    placeholder = "Pilih pelanggan...",
    error,
    label,
    onCustomerAdded,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    // Filter customers by search
    const filteredCustomers = customers.filter(
        (customer) =>
            customer.name.toLowerCase().includes(search.toLowerCase()) ||
            customer.phone?.toLowerCase().includes(search.toLowerCase())
    );

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus search on open
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (customer) => {
        onSelect(customer);
        setIsOpen(false);
        setSearch("");
    };

    const handleAddCustomerSuccess = (newCustomer) => {
        setShowAddModal(false);
        // Reload page data to get updated customer list
        router.reload({ only: ["customers"] });
        onCustomerAdded?.(newCustomer);
    };

    return (
        <>
            <div ref={containerRef} className="relative">
                {/* Label */}
                {label && (
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {label}
                    </label>
                )}

                {/* Select Button with History and Add */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className={`
                            flex-1 h-12 px-4 rounded-xl text-left
                            flex items-center gap-3
                            border-2 transition-all duration-200
                            ${
                                isOpen
                                    ? "border-[#7b563f] ring-4 ring-[#7b563f]/20"
                                    : error
                                    ? "border-[#8a4f35]"
                                    : "border-slate-200 dark:border-slate-700"
                            }
                            bg-white dark:bg-slate-900
                        `}
                    >
                        <div
                            className={`
                            w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                            ${
                                selected
                                    ? "bg-[#f3e7d9] dark:bg-[#5f3f2d]/30"
                                    : "bg-slate-100 dark:bg-slate-800"
                            }
                        `}
                        >
                            <IconUser
                                size={18}
                                className={
                                    selected
                                        ? "text-[#7b563f] dark:text-[#e9d6bc]"
                                        : "text-slate-400"
                                }
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            {selected ? (
                                <>
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                                        {selected.name}
                                    </p>
                                    {selected.phone && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                            {selected.phone}
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p className="text-sm text-slate-400 dark:text-slate-500">
                                    {placeholder}
                                </p>
                            )}
                        </div>
                        <IconChevronDown
                            size={18}
                            className={`text-slate-400 transition-transform ${
                                isOpen ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    {/* History Button - Show when customer is selected */}
                    {selected && (
                        <CustomerHistoryButton
                            customerId={selected.id}
                            customerName={selected.name}
                        />
                    )}

                    {/* Add Customer Button */}
                    <button
                        type="button"
                        onClick={() => setShowAddModal(true)}
                        className="h-12 w-12 rounded-xl border-2 border-dashed border-[#dcc9b5] dark:border-[#6f4b36]
                            text-[#7b563f] hover:bg-[#fbf4eb] dark:hover:bg-[#5f3f2d]/30
                            flex items-center justify-center transition-colors"
                        title="Tambah pelanggan baru"
                    >
                        <IconUserPlus size={20} />
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <p className="mt-1 text-xs text-[#8a4f35] dark:text-[#e3b79f]">{error}</p>
                )}

                {/* Dropdown */}
                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl z-50 animate-slide-up overflow-hidden">
                        {/* Search */}
                        <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                            <div className="relative">
                                <IconSearch
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari nama/telepon..."
                                    className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-[#7b563f]/20 focus:border-[#7b563f] transition-all"
                                />
                            </div>
                        </div>

                        {/* Customer List */}
                        <div className="max-h-60 overflow-y-auto scrollbar-thin">
                            {filteredCustomers.length > 0 ? (
                                <ul>
                                    {filteredCustomers.map((customer) => (
                                        <li key={customer.id}>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleSelect(customer)
                                                }
                                                className={`
                                                    w-full flex items-center gap-3 px-4 py-3 text-left
                                                    transition-colors
                                                    ${
                                                        selected?.id ===
                                                        customer.id
                                                            ? "bg-[#fbf4eb] dark:bg-[#5f3f2d]/30"
                                                            : "hover:bg-slate-50 dark:hover:bg-slate-800"
                                                    }
                                                `}
                                            >
                                                <div
                                                    className={`
                                                    w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
                                                    ${
                                                        selected?.id ===
                                                        customer.id
                                                            ? "bg-[#7b563f] text-white"
                                                            : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                                    }
                                                `}
                                                >
                                                    {selected?.id ===
                                                    customer.id ? (
                                                        <IconCheck size={16} />
                                                    ) : (
                                                        <span className="text-sm font-medium">
                                                            {customer.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                                                        {customer.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                        {customer.phone ||
                                                            customer.email ||
                                                            "-"}
                                                    </p>
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="py-8 text-center text-slate-400 dark:text-slate-500">
                                    <IconUser
                                        size={24}
                                        className="mx-auto mb-2 opacity-50"
                                    />
                                    <p className="text-sm">
                                        Pelanggan tidak ditemukan
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsOpen(false);
                                            setShowAddModal(true);
                                        }}
                                        className="mt-2 text-sm text-[#7b563f] hover:text-[#694733] font-medium"
                                    >
                                        + Tambah pelanggan baru
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Add Customer Modal */}
            <AddCustomerModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={handleAddCustomerSuccess}
            />
        </>
    );
}
