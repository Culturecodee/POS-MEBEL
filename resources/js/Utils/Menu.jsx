import { usePage } from "@inertiajs/react";
import {
    IconBooks,
    IconBox,
    IconCategory,
    IconChartArrowsVertical,
    IconChartBarPopular,
    IconChartInfographic,
    IconCirclePlus,
    IconClockHour6,
    IconCreditCard,
    IconFileCertificate,
    IconFileDescription,
    IconFolder,
    IconHome,
    IconInfoCircle,
    IconPackage,
    IconPhone,
    IconSchool,
    IconShoppingCart,
    IconTable,
    IconUserBolt,
    IconUserShield,
    IconUserSquare,
    IconUsers,
    IconUsersPlus,
} from "@tabler/icons-react";
import hasAnyPermission from "./Permission";
import React from "react";

export default function Menu() {
    // define use page
    const { url, props } = usePage();
    const auth = props.auth;
    const customerProductMenu = auth?.customer
        ? [
              {
                  title: "Home",
                  href: `${route("products.index")}#home`,
                  active: url === "/dashboard/products",
                  icon: <IconHome size={20} strokeWidth={1.5} />,
                  permissions: hasAnyPermission(["products-access"]),
              },
              {
                  title: "Produk",
                  href: `${route("products.index")}#produk`,
                  active: url === "/dashboard/products",
                  icon: <IconBox size={20} strokeWidth={1.5} />,
                  permissions: hasAnyPermission(["products-access"]),
              },
              {
                  title: "Kategori",
                  href: route("categories.index"),
                  active: url === "/dashboard/categories",
                  icon: <IconCategory size={20} strokeWidth={1.5} />,
                  permissions: hasAnyPermission(["products-access"]),
              },
              {
                  title: "Tentang Kami",
                  href: `${route("products.index")}#tentang-kami`,
                  active: url === "/dashboard/products",
                  icon: <IconInfoCircle size={20} strokeWidth={1.5} />,
                  permissions: hasAnyPermission(["products-access"]),
              },
              {
                  title: "Kontak",
                  href: `${route("products.index")}#kontak`,
                  active: url === "/dashboard/products",
                  icon: <IconPhone size={20} strokeWidth={1.5} />,
                  permissions: hasAnyPermission(["products-access"]),
              },
          ]
        : [
              {
                  title: "Kategori",
                  href: route("categories.index"),
                  active: url === "/dashboard/categories" ? true : false,
                  icon: <IconFolder size={20} strokeWidth={1.5} />,
                  permissions: hasAnyPermission(["categories-access"]),
              },
              {
                  title: "Produk",
                  href: route("products.index"),
                  active: url === "/dashboard/products" ? true : false,
                  icon: <IconBox size={20} strokeWidth={1.5} />,
                  permissions: hasAnyPermission(["products-access"]),
              },
              {
                  title: "Pelanggan",
                  href: route("customers.index"),
                  active: url === "/dashboard/customers" ? true : false,
                  icon: <IconUsersPlus size={20} strokeWidth={1.5} />,
                  permissions: hasAnyPermission(["customers-access"]),
              },
          ];

    // define menu navigations
    const menuNavigation = [
        {
            title: "Data Management",
            details: customerProductMenu,
        },
        {
            title: "Transaksi",
            details: [
                {
                    title: "Transaksi",
                    href: route("transactions.index"),
                    active: url === "/dashboard/transactions" ? true : false, // Update comparison here
                    icon: <IconShoppingCart size={20} strokeWidth={1.5} />,
                    permissions:
                        hasAnyPermission(["transactions-access"]) &&
                        !auth?.customer,
                },
                {
                    title: "Riwayat Transaksi",
                    href: route("transactions.history"),
                    active: url === "/dashboard/transactions/history" ? true : false,
                    icon: <IconClockHour6 size={20} strokeWidth={1.5} />,
                    permissions:
                        hasAnyPermission(["transactions-access"]) &&
                        !auth?.customer,
                },
            ],
        },
        {
            title: "Laporan",
            details: [
                {
                    title: "Laporan Penjualan",
                    href: route("reports.sales.index"),
                    active: url.startsWith("/dashboard/reports/sales"),
                    icon: (
                        <IconChartArrowsVertical size={20} strokeWidth={1.5} />
                    ),
                    permissions: hasAnyPermission(["reports-access"]),
                },
                {
                    title: "Laporan Keuntungan",
                    href: route("reports.profits.index"),
                    active: url.startsWith("/dashboard/reports/profits"),
                    icon: <IconChartBarPopular size={20} strokeWidth={1.5} />,
                    permissions: hasAnyPermission(["profits-access"]),
                },
                {
                    title: "Laporan Persediaan",
                    href: route("reports.inventory.index"),
                    active: url.startsWith("/dashboard/reports/inventory"),
                    icon: <IconBox size={20} strokeWidth={1.5} />,
                    permissions:
                        hasAnyPermission(["reports-access"]) && auth?.super,
                },
                {
                    title: "Prioritas Restock",
                    href: route("restock.index"),
                    active: url.startsWith("/dashboard/restock"),
                    icon: <IconPackage size={20} strokeWidth={1.5} />,
                    permissions: hasAnyPermission(["reports-access"]),
                },
            ],
        },
        {
            title: "User Management",
            details: [
                {
                    title: "Hak Akses",
                    href: route("permissions.index"),
                    active: url === "/dashboard/permissions" ? true : false,
                    icon: <IconUserBolt size={20} strokeWidth={1.5} />,
                    permissions: hasAnyPermission(["permissions-access"]),
                },
                {
                    title: "Akses Group",
                    href: route("roles.index"),
                    active: url === "/dashboard/roles" ? true : false,
                    icon: <IconUserShield size={20} strokeWidth={1.5} />,
                    permissions: hasAnyPermission(["roles-access"]),
                },
                {
                    title: "Pengguna",
                    icon: <IconUsers size={20} strokeWidth={1.5} />,
                    permissions: hasAnyPermission(["users-access"]),
                    subdetails: [
                        {
                            title: "Data Pengguna",
                            href: route("users.index"),
                            icon: <IconTable size={20} strokeWidth={1.5} />,
                            active: url === "/dashboard/users" ? true : false,
                            permissions: hasAnyPermission(["users-access"]),
                        },
                        {
                            title: "Tambah Data Pengguna",
                            href: route("users.create"),
                            icon: (
                                <IconCirclePlus size={20} strokeWidth={1.5} />
                            ),
                            active:
                                url === "/dashboard/users/create"
                                    ? true
                                    : false,
                            permissions: hasAnyPermission(["users-create"]),
                        },
                    ],
                },
            ],
        },
        {
            title: "Pengaturan",
            details: [
                {
                    title: "Payment Gateway",
                    href: route("settings.payments.edit"),
                    active: url === "/dashboard/settings/payments",
                    icon: <IconCreditCard size={20} strokeWidth={1.5} />,
                    permissions: hasAnyPermission(["payment-settings-access"]),
                },
            ],
        },
    ];

    return menuNavigation;
}
