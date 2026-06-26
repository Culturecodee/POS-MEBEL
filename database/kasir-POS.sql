-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 06, 2026 at 12:40 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `point_of_sales`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cashier_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `qty` int(11) NOT NULL,
  `price` bigint(20) NOT NULL,
  `hold_id` varchar(255) DEFAULT NULL,
  `hold_label` varchar(255) DEFAULT NULL,
  `held_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `image` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `image`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, '4rbC382RyNjfm7a6tkQqDXfR0NvaasHYvJ5lwIrL.jpg', 'Peralatan Tukang', 'Aneka Peralatan Tukang', '2026-02-21 19:05:07', '2026-04-05 19:40:36'),
(2, 'E4KzEIqCy9efB0j8CcxtiwXn7xvOX0EVMwuccZ3T.jpg', 'Makanan Ringan', 'Camilan dan snack kemasan', '2026-02-21 19:05:08', '2026-04-05 19:28:50'),
(3, 'RO6IbKZ7mL7vqNBfHvlgEAbLXtkqFJOgWM8iFcMb.jpg', 'Makanan Berat', 'Makanan siap saji dan frozen food', '2026-02-21 19:05:08', '2026-04-05 19:31:09'),
(4, 'j7mxp8PedqcNfW9tzM6CZ2lsqwEnTMskAfDODQ9M.jpg', 'Kebutuhan Balita', 'Susu, pempers dan lain-lain', '2026-02-21 19:05:08', '2026-04-05 19:36:49'),
(5, '6lTu3uV0XpXh4k1GN46PVsFdg34AAiWs5VCzWcG5.png', 'Roti & Kue', 'Roti segar dan aneka kue', '2026-02-21 19:05:09', '2026-04-05 19:25:01'),
(6, 'di2LTaRlQHVlX7rQvwRnNA8J1DoyKzDF1QxOJ0iV.png', 'Bumbu & Rempah', 'Bumbu masak dan rempah-rempah', '2026-02-21 19:05:09', '2026-04-05 19:26:17'),
(7, 'oQH4jgdR7CY7AhoZ34IaSikmrtRcBJxr5ZsQZrsA.png', 'Kesehatan & Kecantikan', 'Sabun, shampoo, dan perawatan diri', '2026-02-21 19:05:09', '2026-04-06 00:29:42'),
(8, 'DZfoOevSYO1BOors3jZcWj54xQalhbDb9zMsUGb7.jpg', 'Kebutuhan Rumah', 'Perlengkapan rumah tangga', '2026-02-21 19:05:10', '2026-04-05 19:17:06');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `no_telp` bigint(20) NOT NULL,
  `address` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `name`, `no_telp`, `address`, `created_at`, `updated_at`) VALUES
(1, 'Andi Nugraha', 6281211111111, 'Jl. Melati No. 21, Bandung', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(2, 'Bunga Maharani', 6281312345678, 'Jl. Mawar No. 5, Jakarta', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(3, 'Cici Amelia', 6281512340000, 'Jl. Anggrek No. 17, Surabaya', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(4, 'Davin Pradipta', 6285612349911, 'Jl. Kenanga No. 2, Yogyakarta', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(5, 'Eko Saputra', 6287712348822, 'Jl. Cemara No. 45, Semarang', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(6, 'Fitri Lestari', 6282213345566, 'Jl. Sakura No. 7, Medan', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(7, 'Gina Putri', 6281399887766, 'Jl. Dahlia No. 12, Malang', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(8, 'Hendra Wijaya', 6285544332211, 'Jl. Flamboyan No. 8, Denpasar', '2026-02-21 19:05:06', '2026-02-21 19:05:06');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2024_06_13_082620_create_permission_tables', 1),
(5, '2024_06_13_091315_add_avatar_field_to_users_table', 1),
(6, '2024_06_13_125039_create_customers_table', 1),
(7, '2024_06_13_130507_create_categories_table', 1),
(8, '2024_06_13_131744_create_products_table', 1),
(9, '2024_06_13_132800_create_transactions_table', 1),
(10, '2024_06_13_133940_create_transaction_details_table', 1),
(11, '2024_06_13_133948_create_carts_table', 1),
(12, '2024_06_13_133955_create_profits_table', 1),
(13, '2025_11_19_172334_create_payment_settings_table', 1),
(14, '2025_11_19_172346_add_payment_columns_to_transactions_table', 1),
(15, '2025_12_23_140000_add_hold_columns_to_carts_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_permissions`
--

INSERT INTO `model_has_permissions` (`permission_id`, `model_type`, `model_id`) VALUES
(1, 'App\\Models\\User', 1),
(2, 'App\\Models\\User', 1),
(3, 'App\\Models\\User', 1),
(4, 'App\\Models\\User', 1),
(5, 'App\\Models\\User', 1),
(6, 'App\\Models\\User', 1),
(7, 'App\\Models\\User', 1),
(8, 'App\\Models\\User', 1),
(9, 'App\\Models\\User', 1),
(10, 'App\\Models\\User', 1),
(11, 'App\\Models\\User', 1),
(12, 'App\\Models\\User', 1),
(13, 'App\\Models\\User', 1),
(14, 'App\\Models\\User', 1),
(15, 'App\\Models\\User', 1),
(16, 'App\\Models\\User', 1),
(17, 'App\\Models\\User', 1),
(18, 'App\\Models\\User', 1),
(19, 'App\\Models\\User', 1),
(20, 'App\\Models\\User', 1),
(21, 'App\\Models\\User', 1),
(22, 'App\\Models\\User', 1),
(23, 'App\\Models\\User', 1),
(24, 'App\\Models\\User', 1),
(25, 'App\\Models\\User', 1),
(26, 'App\\Models\\User', 1),
(26, 'App\\Models\\User', 2),
(27, 'App\\Models\\User', 1),
(28, 'App\\Models\\User', 1),
(29, 'App\\Models\\User', 1);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(5, 'App\\Models\\User', 7),
(8, 'App\\Models\\User', 5),
(8, 'App\\Models\\User', 7),
(8, 'App\\Models\\User', 10),
(8, 'App\\Models\\User', 11),
(9, 'App\\Models\\User', 5),
(9, 'App\\Models\\User', 7),
(9, 'App\\Models\\User', 10),
(9, 'App\\Models\\User', 11),
(11, 'App\\Models\\User', 1),
(12, 'App\\Models\\User', 4),
(12, 'App\\Models\\User', 6),
(12, 'App\\Models\\User', 8),
(12, 'App\\Models\\User', 10),
(12, 'App\\Models\\User', 12),
(13, 'App\\Models\\User', 9),
(13, 'App\\Models\\User', 12),
(13, 'App\\Models\\User', 13),
(13, 'App\\Models\\User', 14);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_settings`
--

CREATE TABLE `payment_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `default_gateway` varchar(255) NOT NULL DEFAULT 'cash',
  `midtrans_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `midtrans_server_key` varchar(255) DEFAULT NULL,
  `midtrans_client_key` varchar(255) DEFAULT NULL,
  `midtrans_production` tinyint(1) NOT NULL DEFAULT 0,
  `xendit_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `xendit_secret_key` varchar(255) DEFAULT NULL,
  `xendit_public_key` varchar(255) DEFAULT NULL,
  `xendit_production` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payment_settings`
--

INSERT INTO `payment_settings` (`id`, `default_gateway`, `midtrans_enabled`, `midtrans_server_key`, `midtrans_client_key`, `midtrans_production`, `xendit_enabled`, `xendit_secret_key`, `xendit_public_key`, `xendit_production`, `created_at`, `updated_at`) VALUES
(1, 'cash', 0, 'SB-Mid-server-ocIO_LefZJJQhexzUkNdyfDH', 'SB-Mid-client-qqSJldRUnV1jMvRw', 0, 0, NULL, NULL, 0, '2026-02-21 19:05:06', '2026-04-04 21:23:54');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'dashboard-access', 'web', '2026-02-21 19:05:05', '2026-02-21 19:05:05'),
(2, 'users-access', 'web', '2026-02-21 19:05:05', '2026-02-21 19:05:05'),
(3, 'users-create', 'web', '2026-02-21 19:05:05', '2026-02-21 19:05:05'),
(4, 'users-update', 'web', '2026-02-21 19:05:05', '2026-02-21 19:05:05'),
(5, 'users-delete', 'web', '2026-02-21 19:05:05', '2026-02-21 19:05:05'),
(6, 'roles-access', 'web', '2026-02-21 19:05:05', '2026-02-21 19:05:05'),
(7, 'roles-create', 'web', '2026-02-21 19:05:05', '2026-02-21 19:05:05'),
(8, 'roles-update', 'web', '2026-02-21 19:05:05', '2026-02-21 19:05:05'),
(9, 'roles-delete', 'web', '2026-02-21 19:05:05', '2026-02-21 19:05:05'),
(10, 'permissions-access', 'web', '2026-02-21 19:05:05', '2026-02-21 19:05:05'),
(11, 'permissions-create', 'web', '2026-02-21 19:05:05', '2026-02-21 19:05:05'),
(12, 'permissions-update', 'web', '2026-02-21 19:05:05', '2026-02-21 19:05:05'),
(13, 'permissions-delete', 'web', '2026-02-21 19:05:05', '2026-02-21 19:05:05'),
(14, 'categories-access', 'web', '2026-02-21 19:05:05', '2026-02-21 19:05:05'),
(15, 'categories-create', 'web', '2026-02-21 19:05:05', '2026-02-21 19:05:05'),
(16, 'categories-edit', 'web', '2026-02-21 19:05:05', '2026-02-21 19:05:05'),
(17, 'categories-delete', 'web', '2026-02-21 19:05:05', '2026-02-21 19:05:05'),
(18, 'products-access', 'web', '2026-02-21 19:05:05', '2026-02-21 19:05:05'),
(19, 'products-create', 'web', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(20, 'products-edit', 'web', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(21, 'products-delete', 'web', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(22, 'customers-access', 'web', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(23, 'customers-create', 'web', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(24, 'customers-edit', 'web', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(25, 'customers-delete', 'web', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(26, 'transactions-access', 'web', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(27, 'reports-access', 'web', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(28, 'profits-access', 'web', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(29, 'payment-settings-access', 'web', '2026-02-21 19:05:06', '2026-02-21 19:05:06');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `image` varchar(255) NOT NULL,
  `barcode` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `buy_price` bigint(20) NOT NULL,
  `sell_price` bigint(20) NOT NULL,
  `stock` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category_id`, `image`, `barcode`, `title`, `description`, `buy_price`, `sell_price`, `stock`, `created_at`, `updated_at`) VALUES
(1, 1, 'IylalxdcvBovm2IoQ9BzGmdLZ3sI7G0T5wYYAGCO.jpg', 'CAT-0001', 'Cat Tembok Interior Vinilex Pro 1000', 'Cat Tembok Interior Vinilex Pro 1000 Nippon Paint 20 kg', 400000, 500000, 197, '2026-02-21 19:05:10', '2026-04-05 19:44:18'),
(2, 1, 'UKotcDREIBDcxcaAHiWDbx5X83KgaaB2tVYMRtUq.webp', 'CAT-0002', 'CAT TEMBOK EKSTERIOR DULUX CATYLAC EXTERIOR 5KG', 'CAT TEMBOK EKSTERIOR DULUX CATYLAC EXTERIOR 5KG / BISA REQUEST CUSTOM WARNA TINTING', 120000, 150000, 148, '2026-02-21 19:05:10', '2026-04-05 19:42:24'),
(3, 1, 'X2XvGmKqVzEp0IYqWIYyWSzhnyp7JutF5vUfJPga.webp', 'TROLI-0003', 'GEROBAK PASIR BARU', 'TROLI GEROBAK PASIR BARU/GEROBAK SORONG PASIR BERKUALITAS', 256000, 300000, 87, '2026-02-21 19:05:11', '2026-04-05 20:07:43'),
(4, 1, 'MDFppSKituaMaul3nEvlJKNmoUdWiQbiy0NmZRIx.webp', 'CAT-0004', 'CAT TEMBOK DULUX WEATHERSHIELD DUALSHIELD 2.5 LITER WARNA BRILLIANT WHITE 2290', 'CAT TEMBOK DULUX WEATHERSHIELD DUALSHIELD 2.5 LITER WARNA BRILLIANT WHITE 2290', 200000, 250000, 123, '2026-02-21 19:05:11', '2026-04-05 19:45:35'),
(5, 2, 'prod-chitato-original-68g.jpg', 'SNK-0001', 'Chitato Original 68g', 'Keripik kentang renyah rasa original', 8000, 12000, 118, '2026-02-21 19:05:11', '2026-02-21 19:05:20'),
(6, 2, '4Emh0zw518kLBjg8fQMGXkFqWFcfS4aoj89uoAaJ.webp', 'SNK-0002', 'Good Time Cookies Coffee 72g 1carton', 'Good Time Cookies Coffee 72g 1carton', 10000, 15000, 167, '2026-02-21 19:05:12', '2026-04-05 20:10:26'),
(7, 2, 'rv5hEQMKc6iCN4Fbf1iNszV1QL9w7bHufyIKfzhZ.jpg', 'SNK-0003', 'Boncabe Level 10 Original Sambal Tabur', 'Boncabe Level 10 Original Sambal Tabur', 7500, 10500, 295, '2026-02-21 19:05:12', '2026-04-05 20:32:02'),
(8, 2, '3PLkldedh8SmkBKKntum3vg2qcoW9M6HpG6znn19.webp', 'SNK-0004', 'Taro Net Pertualangan / Snack Makanan Chiki Ringan / Snack Varian Rasa / 32Gr', 'Taro Net Pertualangan / Snack Makanan Chiki Ringan / Snack Varian Rasa / 32Gr', 4500, 6000, 200, '2026-02-21 19:05:12', '2026-04-05 20:09:04'),
(9, 3, 'prod-nasi-goreng-frozen.jpg', 'MKN-0001', 'Nasi Goreng Frozen', 'Nasi goreng siap saji tinggal panaskan', 15000, 22000, 40, '2026-02-21 19:05:13', '2026-02-21 19:05:13'),
(10, 3, 'prod-ayam-goreng-frozen.jpg', 'MKN-0002', 'Ayam Goreng Frozen', 'Ayam goreng krispy siap goreng', 25000, 38000, 33, '2026-02-21 19:05:13', '2026-02-21 19:05:20'),
(11, 3, 'EVcDMNZkrGKZiAcra9b4Pht5nufR5ivBkljS48mv.webp', 'MKN-0003', 'Nasi Rendang Sapi | Self Heating Food | Makanan Siap Saji Tanpa Kompor & Tanpa Microwave', 'Nasi Rendang Sapi | Self Heating Food | Makanan Siap Saji Tanpa Kompor & Tanpa Microwave', 35000, 48000, 43, '2026-02-21 19:05:13', '2026-04-05 20:33:03'),
(12, 4, 'gj7ScN2oOdPjdUZZUwWRZmFfMHZ0xCTnudxotEcn.webp', 'SSU-0001', 'vidoran My Baby Susu Formula Bayi 6-12 Bulan 550 g', 'vidoran My Baby Susu Formula Bayi 6-12 Bulan 550 g', 46000, 53000, 77, '2026-02-21 19:05:14', '2026-04-05 20:37:27'),
(13, 4, 'n5urbIrrirUsZTwCiIVaGVce5HLoDp3R6IbxunJs.webp', 'SSU-0002', 'Promina Baby Crunchies Snack Bayi Krim Ayam Brokoli 20 g', 'Promina Baby Crunchies Snack Bayi Krim Ayam Brokoli 20 g', 8000, 12000, 156, '2026-02-21 19:05:14', '2026-04-05 20:36:28'),
(14, 4, 'prod-keju-cheddar-165g.jpg', 'SSU-0003', 'Keju Cheddar 165g', 'Keju cheddar slice praktis', 22000, 30000, 40, '2026-02-21 19:05:14', '2026-02-21 19:05:14'),
(15, 5, 'prod-roti-tawar-sari-roti.jpg', 'RTI-0001', 'Roti Tawar Sari Roti', 'Roti tawar lembut tanpa kulit', 12000, 16000, 49, '2026-02-21 19:05:15', '2026-02-21 19:05:20'),
(16, 5, 'prod-donat-coklat.jpg', 'RTI-0002', 'Donat Coklat', 'Donat lembut dengan topping coklat', 5000, 8000, 27, '2026-02-21 19:05:15', '2026-02-21 19:05:20'),
(17, 5, 'prod-croissant-butter.jpg', 'RTI-0003', 'Croissant Butter', 'Croissant dengan butter premium', 10000, 15000, 24, '2026-02-21 19:05:15', '2026-04-04 21:22:51'),
(18, 6, 'EoomIDREAduF0xLFTyI5XeBqTuvqbAMxDYeglFcV.png', 'BMB-0001', 'Bango Kecap Manis [265 G]', 'Bango Kecap Manis [265 G]', 80000, 10000, 68, '2026-02-21 19:05:16', '2026-04-05 20:42:25'),
(19, 6, 'urJdkfEF9LsUCS7AgTzIh5HO1XSZ2qxkJbTq6fiI.webp', 'BMB-0002', 'BIMOLI MINYAK GORENG KLASIK [1 POUCH x 2 L]', 'BIMOLI MINYAK GORENG KLASIK [1 POUCH x 2 L]', 28000, 38000, 89, '2026-02-21 19:05:16', '2026-04-05 20:41:16'),
(20, 6, 'RHK4mP98L7d3ZTdZJYRldvJZvr7DEFXUcdya1ODS.jpg', 'BMB-0003', 'PSM GULA PREMIUM 1 KG', 'PSM GULA PREMIUM 1 KG', 14000, 18000, 100, '2026-02-21 19:05:17', '2026-04-05 20:43:03'),
(21, 7, 'k0tRp7KxLn2luR3yYZt4JIstkxlsYIL55tfZpxww.jpg', 'PRW-0001', 'Sabun Lifebuoy 85g', 'Lifebuoy Yoghurt Care Sabun Mandi Cair Refill [380 m]', 24000, 26500, 148, '2026-02-21 19:05:18', '2026-04-05 20:46:35'),
(22, 7, 'jtzS8vHZp68Q9xqW36zadu00lLLVACvveIcRqVMm.jpg', 'PRW-0002', 'PANTENE SHAMPO ANTI KETOMBE 135ML /PCS', 'PANTENE SHAMPO ANTI KETOMBE 135ML /PCS', 22000, 31000, 77, '2026-02-21 19:05:18', '2026-04-05 20:45:30'),
(23, 7, 'QglTjfeOD5jCsDK1bdqNbsVp1kCaJBVO4XY125ek.jpg', 'PRW-0003', 'Pepsodent Pencegah Gigi Berlubang Pasta Gigi 225 g', 'Pepsodent Pencegah Gigi Berlubang Pasta Gigi 225 g', 12000, 18000, 100, '2026-02-21 19:05:18', '2026-04-05 20:44:39'),
(24, 8, 'TmfeeMlBZr5bblhaaoePJiXi4p0qHMj8kMGbrkFb.jpg', 'RMH-0001', 'Tisu nice Wajah 250 s', 'Tisu nice Wajah 250 s', 15000, 22000, 78, '2026-02-21 19:05:18', '2026-04-05 20:43:58'),
(25, 8, 'MTgLld5qjATf8SRKl43AjFY1YEOju6xGUPl2OqfX.jpg', 'RMH-0002', 'Sabun Cuci Sunlight', 'Sabun cuci piring anti lemak', 12000, 18000, 89, '2026-02-21 19:05:19', '2026-04-04 21:18:23'),
(26, 8, 'MLuoujjxCIhKsiU1nKWlKW1FfGOsZSs8AkjKBdFM.jpg', 'RMH-0003', 'Pewangi Pakaian Molto Floral Shower Pewangi & Pelembut Pakaian [250 mL] isi 2 Pcs', 'Molto Floral Shower Pewangi & Pelembut Pakaian [250 mL] isi 2 Pcs', 18000, 26000, 69, '2026-02-21 19:05:20', '2026-04-05 20:47:12');

-- --------------------------------------------------------

--
-- Table structure for table `profits`
--

CREATE TABLE `profits` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `transaction_id` bigint(20) UNSIGNED NOT NULL,
  `total` bigint(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `profits`
--

INSERT INTO `profits` (`id`, `transaction_id`, `total`, `created_at`, `updated_at`) VALUES
(1, 1, 6000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(2, 1, 8000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(3, 1, 4000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(4, 2, 10000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(5, 2, 9000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(6, 2, 5000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(7, 3, 26000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(8, 3, 10000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(9, 3, 14000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(10, 4, 12000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(11, 4, 5000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(12, 4, 8000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(13, 5, 10000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(14, 5, 14000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(15, 5, 26000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(16, 5, 8000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(17, 6, 4000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(18, 6, 5000, '2026-02-21 19:05:20', '2026-02-21 19:05:20');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'users-access', 'web', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(2, 'roles-access', 'web', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(3, 'permission-access', 'web', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(4, 'categories-access', 'web', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(5, 'products-access', 'web', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(6, 'customers-access', 'web', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(7, 'transactions-access', 'web', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(8, 'reports-access', 'web', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(9, 'profits-access', 'web', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(10, 'payment-settings-access', 'web', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(11, 'super-admin', 'web', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(12, 'cashier', 'web', '2026-02-21 19:05:06', '2026-02-21 19:05:06'),
(13, 'kepala', 'web', '2026-04-06 02:43:13', '2026-04-06 02:43:13');

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_has_permissions`
--

INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
(1, 12),
(1, 13),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 2),
(7, 2),
(8, 2),
(9, 2),
(10, 3),
(11, 3),
(12, 3),
(13, 3),
(14, 4),
(15, 4),
(16, 4),
(17, 4),
(18, 5),
(18, 13),
(19, 5),
(19, 13),
(20, 5),
(20, 13),
(21, 5),
(21, 13),
(22, 6),
(22, 12),
(23, 6),
(23, 12),
(24, 6),
(25, 6),
(26, 7),
(26, 12),
(27, 8),
(27, 13),
(28, 9),
(28, 13),
(29, 10);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cashier_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `invoice` varchar(255) NOT NULL,
  `cash` bigint(20) NOT NULL,
  `change` bigint(20) NOT NULL,
  `discount` bigint(20) NOT NULL,
  `grand_total` bigint(20) NOT NULL,
  `payment_method` varchar(255) NOT NULL DEFAULT 'cash',
  `payment_status` varchar(255) NOT NULL DEFAULT 'paid',
  `payment_reference` varchar(255) DEFAULT NULL,
  `payment_url` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `cashier_id`, `customer_id`, `invoice`, `cash`, `change`, `discount`, `grand_total`, `payment_method`, `payment_status`, `payment_reference`, `payment_url`, `created_at`, `updated_at`) VALUES
(1, 8, 1, 'TRX-UI3TFGPG', 100000, 50000, 5000, 50000, 'cash', 'paid', NULL, NULL, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(2, 8, 2, 'TRX-YHCT9PIG', 150000, 71000, 0, 79000, 'cash', 'paid', NULL, NULL, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(3, 8, 3, 'TRX-ZOVJRCBT', 200000, 52000, 10000, 148000, 'cash', 'paid', NULL, NULL, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(4, 8, 4, 'TRX-W4LWB0AW', 80000, 2500, 0, 77500, 'cash', 'paid', NULL, NULL, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(5, 8, 6, 'TRX-O7CVEG5R', 250000, 61000, 15000, 189000, 'cash', 'paid', NULL, NULL, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(6, 8, NULL, 'TRX-PFJMF8NL', 50000, 23000, 0, 27000, 'cash', 'paid', NULL, NULL, '2026-02-21 19:05:20', '2026-02-21 19:05:20');

-- --------------------------------------------------------

--
-- Table structure for table `transaction_details`
--

CREATE TABLE `transaction_details` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `transaction_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `qty` int(11) NOT NULL,
  `price` bigint(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transaction_details`
--

INSERT INTO `transaction_details` (`id`, `transaction_id`, `product_id`, `qty`, `price`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 3, 15000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(2, 1, 5, 2, 24000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(3, 1, 15, 1, 16000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(4, 2, 12, 2, 42000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(5, 2, 16, 3, 24000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(6, 2, 21, 2, 13000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(7, 3, 10, 2, 76000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(8, 3, 19, 1, 38000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(9, 3, 24, 2, 44000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(10, 4, 3, 2, 36000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(11, 4, 7, 5, 17500, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(12, 4, 13, 2, 24000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(13, 5, 22, 1, 32000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(14, 5, 18, 2, 50000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(15, 5, 11, 2, 96000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(16, 5, 26, 1, 26000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(17, 6, 2, 2, 12000, '2026-02-21 19:05:20', '2026-02-21 19:05:20'),
(18, 6, 6, 1, 15000, '2026-02-21 19:05:20', '2026-02-21 19:05:20');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `avatar`) VALUES
(1, 'Admin', 'admin@gmail.com', NULL, '$2y$12$o/IXsL5sYhKdBk7BDdjSTOm6h8HQzsyavnfRHnRVH/GMIUwYafYxi', NULL, '2026-02-21 19:05:06', '2026-02-21 19:05:06', NULL),
(8, 'kasir', 'kasir@gmail.com', NULL, '$2y$12$0QSds1R2Fy3RxMTydH3h3OqF7bbdKs/vqLnYCX5MCbsrLKZnyFutS', NULL, '2026-04-06 02:27:11', '2026-04-06 02:27:11', NULL),
(14, 'kepala', 'kepala@gmail.com', NULL, '$2y$12$3v0SlgZWBNz8VUBjIj77/.p/v/B4ZfHNCTfADFi5/7uiqvpFkUCCO', NULL, '2026-04-06 03:03:35', '2026-04-06 03:03:35', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `carts_product_id_foreign` (`product_id`),
  ADD KEY `carts_hold_id_index` (`hold_id`),
  ADD KEY `carts_cashier_id_hold_id_index` (`cashier_id`,`hold_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payment_settings`
--
ALTER TABLE `payment_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `products_barcode_unique` (`barcode`),
  ADD KEY `products_category_id_foreign` (`category_id`);

--
-- Indexes for table `profits`
--
ALTER TABLE `profits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `profits_transaction_id_foreign` (`transaction_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transactions_cashier_id_foreign` (`cashier_id`),
  ADD KEY `transactions_customer_id_foreign` (`customer_id`);

--
-- Indexes for table `transaction_details`
--
ALTER TABLE `transaction_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transaction_details_transaction_id_foreign` (`transaction_id`),
  ADD KEY `transaction_details_product_id_foreign` (`product_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `payment_settings`
--
ALTER TABLE `payment_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `profits`
--
ALTER TABLE `profits`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `transaction_details`
--
ALTER TABLE `transaction_details`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_cashier_id_foreign` FOREIGN KEY (`cashier_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `carts_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `profits`
--
ALTER TABLE `profits`
  ADD CONSTRAINT `profits_transaction_id_foreign` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`);

--
-- Constraints for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_cashier_id_foreign` FOREIGN KEY (`cashier_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `transactions_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

--
-- Constraints for table `transaction_details`
--
ALTER TABLE `transaction_details`
  ADD CONSTRAINT `transaction_details_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `transaction_details_transaction_id_foreign` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
