import DashboardLayout from "@/Layouts/DashboardLayout";
import React, { useState } from "react";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import Button from "@/Components/Dashboard/Button";
import {
    IconDatabaseOff,
    IconCirclePlus,
    IconTrash,
    IconPencilCog,
    IconUser,
    IconShield,
    IconMail,
    IconLayoutGrid,
    IconList,
} from "@tabler/icons-react";
import Search from "@/Components/Dashboard/Search";
import Table from "@/Components/Dashboard/Table";
import Checkbox from "@/Components/Dashboard/Checkbox";
import Pagination from "@/Components/Dashboard/Pagination";
import Swal from "sweetalert2";

// User Card for Grid View
function UserCard({ user, isSelected, onSelect, onDelete }) {
    return (
        <div
            className={`
            group bg-white dark:bg-slate-900 rounded-2xl border-2
            ${
                isSelected
                    ? "border-[#8a5a3c] dark:border-[#b68558]"
                    : "border-slate-200 dark:border-slate-800"
            }
            overflow-hidden hover:shadow-lg hover:border-[#c8ab8f] dark:hover:border-[#8a5a3c] transition-all duration-200
        `}
        >
            {/* Header with checkbox */}
            <div className="p-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#b68558] to-[#8a5a3c] flex items-center justify-center text-white text-lg font-bold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                            {user.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <IconMail size={14} />
                            {user.email}
                        </p>
                    </div>
                </div>
                <Checkbox
                    value={user.id}
                    onChange={onSelect}
                    checked={isSelected}
                />
            </div>

            {/* Roles */}
            <div className="px-4 pb-3">
                <div className="flex flex-wrap gap-1.5">
                    {user.roles.map((role, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-[#f1e0cf] dark:bg-[#5c3b2a]/40 text-[#8a5a3c] dark:text-[#e7c9aa]"
                        >
                            <IconShield size={12} />
                            {role.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex border-t border-slate-100 dark:border-slate-800">
                <Link
                    href={route("users.edit", user.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[#9a6b45] hover:bg-[#f5ebdf] dark:hover:bg-[#6f4b36]/30 text-sm font-medium transition-colors"
                >
                    <IconPencilCog size={16} />
                    <span>Edit</span>
                </Link>
                <div className="w-px bg-slate-100 dark:bg-slate-800" />
                <button
                    onClick={() => onDelete(user.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[#8f4f39] hover:bg-[#f3e1d7] dark:hover:bg-[#7a4a2d]/30 text-sm font-medium transition-colors"
                >
                    <IconTrash size={16} />
                    <span>Hapus</span>
                </button>
            </div>
        </div>
    );
}

export default function Index() {
    const { users } = usePage().props;
    const [viewMode, setViewMode] = useState("grid");

    const {
        data,
        setData,
        delete: destroy,
        reset,
    } = useForm({
        selectedUser: [],
    });

    const setSelectedUser = (e) => {
        let items = data.selectedUser;
        if (items.some((id) => id === e.target.value))
            items = items.filter((id) => id !== e.target.value);
        else items.push(e.target.value);
        setData("selectedUser", items);
    };

    const deleteData = async (id) => {
        Swal.fire({
            title: "Hapus Pengguna?",
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#8f4f39",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route("users.destroy", [id]));
                Swal.fire({
                    title: "Berhasil!",
                    text: "Data berhasil dihapus!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
                setData("selectedUser", []);
            }
        });
    };

    return (
        <>
            <Head title="Pengguna" />

            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Pengguna
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {users.total || users.data?.length || 0} pengguna
                            terdaftar
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {data.selectedUser.length > 0 && (
                            <Button
                                type={"bulk"}
                                icon={<IconTrash size={18} />}
                                className={
                                    "bg-[#8f4f39] hover:bg-[#77402d] text-white"
                                }
                                label={`Hapus ${data.selectedUser.length}`}
                                onClick={() => deleteData(data.selectedUser)}
                            />
                        )}
                        <Button
                            type={"link"}
                            href={route("users.create")}
                            icon={
                                <IconCirclePlus size={18} strokeWidth={1.5} />
                            }
                            className={
                                "bg-[#8a5a3c] hover:bg-[#6f4b36] text-white shadow-lg shadow-[#8a5a3c]/30"
                            }
                            label={"Tambah Pengguna"}
                        />
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <div className="w-full sm:w-80">
                    <Search
                        url={route("users.index")}
                        placeholder="Cari pengguna..."
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
                    >
                        <IconList size={20} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {users.data.length > 0 ? (
                viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {users.data.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                isSelected={data.selectedUser.includes(
                                    user.id.toString()
                                )}
                                onSelect={setSelectedUser}
                                onDelete={deleteData}
                            />
                        ))}
                    </div>
                ) : (
                    <Table.Card title={"Data Pengguna"}>
                        <Table>
                            <Table.Thead>
                                <tr>
                                    <Table.Th className={"w-10"}>
                                        <Checkbox
                                            onChange={(e) => {
                                                const allUserIds =
                                                    users.data.map((user) =>
                                                        user.id.toString()
                                                    );
                                                setData(
                                                    "selectedUser",
                                                    e.target.checked
                                                        ? allUserIds
                                                        : []
                                                );
                                            }}
                                            checked={
                                                data.selectedUser.length ===
                                                users.data.length
                                            }
                                        />
                                    </Table.Th>
                                    <Table.Th className={"w-10"}>No</Table.Th>
                                    <Table.Th>Pengguna</Table.Th>
                                    <Table.Th>Group Akses</Table.Th>
                                    <Table.Th></Table.Th>
                                </tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {users.data.map((user, i) => (
                                    <tr
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                        key={user.id}
                                    >
                                        <Table.Td>
                                            <Checkbox
                                                value={user.id}
                                                onChange={setSelectedUser}
                                                checked={data.selectedUser.includes(
                                                    user.id.toString()
                                                )}
                                            />
                                        </Table.Td>
                                        <Table.Td className={"text-center"}>
                                            {++i +
                                                (users.current_page - 1) *
                                                    users.per_page}
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#b68558] to-[#8a5a3c] flex items-center justify-center text-white text-sm font-bold">
                                                    {user.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles.map(
                                                    (role, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-2 py-0.5 text-xs font-medium bg-[#f1e0cf] dark:bg-[#5c3b2a]/40 text-[#8a5a3c] dark:text-[#e7c9aa] rounded-full"
                                                        >
                                                            {role.name}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="flex gap-2">
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
                                                        "users.edit",
                                                        user.id
                                                    )}
                                                />
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
                                                        "users.destroy",
                                                        user.id
                                                    )}
                                                />
                                            </div>
                                        </Table.Td>
                                    </tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Table.Card>
                )
            ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <IconDatabaseOff
                            size={32}
                            className="text-slate-400"
                            strokeWidth={1.5}
                        />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-1">
                        Belum Ada Pengguna
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Tambahkan pengguna pertama Anda.
                    </p>
                    <Button
                        type={"link"}
                        icon={<IconCirclePlus size={18} />}
                        className={
                            "bg-[#8a5a3c] hover:bg-[#6f4b36] text-white"
                        }
                        label={"Tambah Pengguna"}
                        href={route("users.create")}
                    />
                </div>
            )}

            {users.last_page !== 1 && <Pagination links={users.links} />}
        </>
    );
}

Index.layout = (page) => <DashboardLayout children={page} />;
