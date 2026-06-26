import React, { useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import Button from "@/Components/Dashboard/Button";
import {
    IconCirclePlus,
    IconDatabaseOff,
    IconPencilCog,
    IconTrash,
    IconLayoutGrid,
    IconList,
    IconCategory,
    IconPhoto,
} from "@tabler/icons-react";
import Search from "@/Components/Dashboard/Search";
import Table from "@/Components/Dashboard/Table";
import Pagination from "@/Components/Dashboard/Pagination";

// Category Card for Grid View
function CategoryCard({ category, canEdit, canDelete }) {
    return (
        <Link
            href={route("categories.show", category.id)}
            className="group block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200"
        >
            {/* Category Image */}
            <div className="relative aspect-[3/2] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                {category.image ? (
                    <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <IconCategory
                            size={48}
                            className="text-slate-300 dark:text-slate-600"
                            strokeWidth={1}
                        />
                    </div>
                )}

                {(canEdit || canDelete) && (
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        {canEdit && (
                            <Link
                                href={route("categories.edit", category.id)}
                                className="p-2.5 rounded-xl bg-white text-[#9a6b45] hover:bg-[#f5ebdf] shadow-lg transition-colors"
                            >
                                <IconPencilCog size={18} />
                            </Link>
                        )}
                        {canDelete && (
                            <Button
                                type={"delete"}
                                icon={<IconTrash size={18} />}
                                className={
                                    "p-2.5 rounded-xl bg-white text-[#8f4f39] hover:bg-[#f3e1d7] shadow-lg"
                                }
                                url={route("categories.destroy", category.id)}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Category Info */}
            <div className="p-4">
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    {category.name}
                </h3>
                {category.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                        {category.description}
                    </p>
                )}
            </div>
        </Link>
    );
}

export default function Index({ categories }) {
    const { auth } = usePage().props;
    const [viewMode, setViewMode] = useState("grid");
    const canCreate = Boolean(auth?.permissions?.["categories-create"]);
    const canEdit = Boolean(auth?.permissions?.["categories-edit"]);
    const canDelete = Boolean(auth?.permissions?.["categories-delete"]);

    return (
        <>
            <Head title="Kategori" />

            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Kategori
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {categories.total || categories.data?.length || 0}{" "}
                            kategori terdaftar
                        </p>
                    </div>
                    {canCreate && (
                        <Button
                            type={"link"}
                            icon={<IconCirclePlus size={18} strokeWidth={1.5} />}
                            className={
                                "bg-[#8a5a3c] hover:bg-[#6f4b36] text-white shadow-lg shadow-[#8a5a3c]/30"
                            }
                            label={"Tambah Kategori"}
                            href={route("categories.create")}
                        />
                    )}
                </div>
            </div>

            {/* Toolbar */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <div className="w-full sm:w-80">
                    <Search
                        url={route("categories.index")}
                        placeholder="Cari kategori..."
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2.5 rounded-lg transition-colors ${
                            viewMode === "grid"
                                ? "bg-[#f1e0cf] text-[#8a5a3c] dark:bg-[#5c3b2a]/40 dark:text-[#e7c9aa]"
                                : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                        title="Grid View"
                    >
                        <IconLayoutGrid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2.5 rounded-lg transition-colors ${
                            viewMode === "list"
                                ? "bg-[#f1e0cf] text-[#8a5a3c] dark:bg-[#5c3b2a]/40 dark:text-[#e7c9aa]"
                                : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                        title="List View"
                    >
                        <IconList size={20} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {categories.data.length > 0 ? (
                viewMode === "grid" ? (
                    /* Grid View */
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {categories.data.map((category) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                canEdit={canEdit}
                                canDelete={canDelete}
                            />
                        ))}
                    </div>
                ) : (
                    /* List View */
                    <Table.Card title={"Data Kategori"}>
                        <Table>
                            <Table.Thead>
                                <tr>
                                    <Table.Th className="w-10">No</Table.Th>
                                    <Table.Th>Kategori</Table.Th>
                                    <Table.Th>Deskripsi</Table.Th>
                                    {(canEdit || canDelete) && <Table.Th></Table.Th>}
                                </tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {categories.data.map((category, i) => (
                                    <tr
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                        key={category.id}
                                    >
                                        <Table.Td className="text-center">
                                            {++i +
                                                (categories.current_page - 1) *
                                                    categories.per_page}
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                                                    {category.image ? (
                                                        <img
                                                            src={category.image}
                                                            alt={category.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <IconCategory
                                                                size={20}
                                                                className="text-slate-400"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                    <Link
                                                        href={route(
                                                            "categories.show",
                                                            category.id
                                                        )}
                                                        className="hover:text-[#8a5a3c]"
                                                    >
                                                        {category.name}
                                                    </Link>
                                                </p>
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                                                {category.description || "-"}
                                            </p>
                                        </Table.Td>
                                        {(canEdit || canDelete) && (
                                            <Table.Td>
                                                <div className="flex gap-2">
                                                    {canEdit && (
                                                        <Button
                                                            type={"edit"}
                                                            icon={
                                                                <IconPencilCog
                                                                    size={16}
                                                                    strokeWidth={1.5}
                                                                />
                                                            }
                                                            className={
                                                                "border bg-[#f5ebdf] border-[#dcc1a6] text-[#9a6b45] hover:bg-[#ead9c7] dark:bg-[#6f4b36]/30 dark:border-[#8a5a3c] dark:text-[#e7c9aa]"
                                                            }
                                                            href={route(
                                                                "categories.edit",
                                                                category.id
                                                            )}
                                                        />
                                                    )}
                                                    {canDelete && (
                                                        <Button
                                                            type={"delete"}
                                                            icon={
                                                                <IconTrash
                                                                    size={16}
                                                                    strokeWidth={1.5}
                                                                />
                                                            }
                                                            className={
                                                                "border bg-[#f3e1d7] border-[#d7b09f] text-[#8f4f39] hover:bg-[#e7cfbf] dark:bg-[#7a4a2d]/30 dark:border-[#8f4f39] dark:text-[#f1d5c7]"
                                                            }
                                                            url={route(
                                                                "categories.destroy",
                                                                category.id
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
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <IconDatabaseOff
                            size={32}
                            className="text-slate-400"
                            strokeWidth={1.5}
                        />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-1">
                        Belum Ada Kategori
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Tambahkan kategori pertama Anda.
                    </p>
                    {canCreate && (
                        <Button
                            type={"link"}
                            icon={<IconCirclePlus size={18} />}
                            className={
                                "bg-[#8a5a3c] hover:bg-[#6f4b36] text-white"
                            }
                            label={"Tambah Kategori"}
                            href={route("categories.create")}
                        />
                    )}
                </div>
            )}

            {categories.last_page !== 1 && (
                <Pagination links={categories.links} />
            )}
        </>
    );
}

Index.layout = (page) => <DashboardLayout children={page} />;
