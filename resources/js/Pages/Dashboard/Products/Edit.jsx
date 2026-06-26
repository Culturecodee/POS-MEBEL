import React, { useEffect, useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import Input from "@/Components/Dashboard/Input";
import Textarea from "@/Components/Dashboard/TextArea";
import InputSelect from "@/Components/Dashboard/InputSelect";
import toast from "react-hot-toast";
import {
    IconPackage,
    IconDeviceFloppy,
    IconArrowLeft,
    IconCirclePlus,
    IconPhoto,
    IconCurrencyDollar,
    IconCalculator,
    IconX,
} from "@tabler/icons-react";
import { getProductImageUrl } from "@/Utils/imageUrl";

const toNumber = (value) => Number.parseInt(value || 0, 10) || 0;

const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);

export default function Edit({ categories, product, returnPage = 1 }) {
    const { errors } = usePage().props;

    const { data, setData, post, processing } = useForm({
        image: "",
        gallery_images: [],
        deleted_gallery_image_ids: [],
        barcode: product.barcode,
        title: product.title,
        category_id: product.category_id,
        description: product.description,
        raw_material_price: product.raw_material_price ?? product.buy_price ?? "",
        upholstery_price: product.upholstery_price ?? "",
        cushion_price: product.cushion_price ?? "",
        seat_pillow_price: product.seat_pillow_price ?? "",
        glass_price: product.glass_price ?? "",
        finishing_price: product.finishing_price ?? "",
        packing_price: product.packing_price ?? "",
        buy_price: product.buy_price,
        sell_price: product.sell_price,
        stock: product.stock,
        page: returnPage,
        _method: "PUT",
    });

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [imagePreview, setImagePreview] = useState(
        product.image ? getProductImageUrl(product.image) : null
    );
    const [existingGalleryImages, setExistingGalleryImages] = useState(
        product.images ?? []
    );
    const [galleryPreviews, setGalleryPreviews] = useState([]);

    useEffect(() => {
        if (product.category_id) {
            setSelectedCategory(
                categories.find((cat) => cat.id === product.category_id)
            );
        }
    }, [product.category_id]);

    const setSelectedCategoryHandler = (value) => {
        setSelectedCategory(value);
        setData("category_id", value?.id || "");
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files || []);

        if (!files.length) {
            return;
        }

        const currentGalleryCount = Math.max(
            0,
            existingGalleryImages.length + data.gallery_images.length
        );
        const availableSlots = Math.max(0, 9 - currentGalleryCount);
        const mergedFiles = [...data.gallery_images, ...files].slice(
            0,
            data.gallery_images.length + availableSlots
        );

        setData("gallery_images", mergedFiles);
        setGalleryPreviews(
            mergedFiles.map((file) => URL.createObjectURL(file))
        );

        e.target.value = "";
    };

    const handleRemoveExistingGalleryImage = (imageId) => {
        setExistingGalleryImages((current) =>
            current.filter((image) => image.id !== imageId)
        );

        setData("deleted_gallery_image_ids", [
            ...data.deleted_gallery_image_ids,
            imageId,
        ]);
    };

    const handlePriceChange = (field) => (e) => {
        const numericValue = e.target.value.replace(/[^\d]/g, "");
        setData(field, numericValue);
    };

    const totalHpp =
        toNumber(data.raw_material_price) +
        toNumber(data.upholstery_price) +
        toNumber(data.cushion_price) +
        toNumber(data.seat_pillow_price) +
        toNumber(data.glass_price) +
        toNumber(data.finishing_price) +
        toNumber(data.packing_price);

    const submit = (e) => {
        e.preventDefault();
        post(route("products.update", product.id), {
            forceFormData: true,
            onSuccess: () => toast.success("Produk berhasil diperbarui"),
            onError: () => toast.error("Gagal memperbarui produk"),
        });
    };

    return (
        <>
            <Head title="Edit Produk" />

            <div className="mb-6">
                <Link
                    href={route("products.index", { page: returnPage })}
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-3"
                >
                    <IconArrowLeft size={16} />
                    Kembali ke Produk
                </Link>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <IconPackage size={28} className="text-primary-500" />
                    Edit Produk
                </h1>
                <p className="text-sm text-slate-500 mt-1">{product.title}</p>
            </div>

            <form onSubmit={submit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left - Image */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                                <IconPhoto size={18} />
                                Gambar Produk
                            </h3>
                            <div className="min-h-[280px] rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden p-4 mb-4">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="max-h-[520px] w-full object-contain"
                                    />
                                ) : (
                                    <div className="text-center p-6">
                                        <IconPhoto
                                            size={48}
                                            className="mx-auto text-slate-400 mb-2"
                                        />
                                        <p className="text-sm text-slate-500">
                                            Belum ada gambar
                                        </p>
                                    </div>
                                )}
                            </div>
                            <Input
                                type="file"
                                label="Ganti Gambar"
                                onChange={handleImageChange}
                                errors={errors.image}
                                accept="image/*"
                            />
                            <p className="mt-2 text-xs text-slate-500">
                                Gambar utama produk.
                            </p>
                            <div className="mt-4">
                                <Input
                                    type="file"
                                    label="Tambah Galeri Produk"
                                    onChange={handleGalleryChange}
                                    errors={errors.gallery_images || errors["gallery_images.0"]}
                                    accept="image/*"
                                    multiple
                                />
                                <p className="mt-2 text-xs text-slate-500">
                                    Maksimal total 10 gambar per produk
                                    termasuk gambar utama.
                                </p>
                            </div>

                            {existingGalleryImages.length > 0 && (
                                <div className="mt-4">
                                    <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Galeri Saat Ini
                                    </p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {existingGalleryImages.map((galleryImage) => (
                                            <div
                                                key={galleryImage.id}
                                                className="relative flex h-24 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800"
                                            >
                                                <img
                                                    src={getProductImageUrl(galleryImage.image)}
                                                    alt="Galeri produk"
                                                    className="max-h-full w-full object-contain"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveExistingGalleryImage(
                                                            galleryImage.id
                                                        )
                                                    }
                                                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#5b4031]/90 text-white shadow transition hover:bg-[#8a4f35]"
                                                    aria-label="Hapus gambar"
                                                >
                                                    <IconX size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {galleryPreviews.length > 0 && (
                                <div className="mt-4">
                                    <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Galeri Baru ({galleryPreviews.length}/9)
                                    </p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {galleryPreviews.map((preview, index) => (
                                            <div
                                                key={`${preview}-${index}`}
                                                className="flex h-24 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800"
                                            >
                                                <img
                                                    src={preview}
                                                    alt={`Galeri baru ${index + 1}`}
                                                    className="max-h-full w-full object-contain"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right - Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                                <IconPackage size={18} />
                                Informasi Dasar
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <div className="flex items-end justify-between gap-3">
                                        <div className="flex-1">
                                            <InputSelect
                                                label="Kategori"
                                                data={categories}
                                                selected={selectedCategory}
                                                setSelected={setSelectedCategoryHandler}
                                                placeholder="Pilih kategori"
                                                errors={errors.category_id}
                                                searchable={true}
                                                displayKey="name"
                                            />
                                        </div>
                                        <Link
                                            href={route("categories.create")}
                                            className="mb-1 inline-flex items-center gap-2 rounded-xl border border-[#dcc9b5] bg-[#fffaf3] px-4 py-3 text-sm font-semibold text-[#7b563f] transition hover:bg-[#f7eee4]"
                                        >
                                            <IconCirclePlus size={16} />
                                            Tambah Kategori
                                        </Link>
                                    </div>
                                </div>
                                <Input
                                    type="text"
                                    label="Nama Produk"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    errors={errors.title}
                                    placeholder="Nama produk"
                                />
                                <div className="md:col-span-2">
                                    <Textarea
                                        label="Deskripsi"
                                        placeholder="Deskripsi produk"
                                        errors={errors.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        value={data.description}
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                                <IconCurrencyDollar size={18} />
                                Komponen Biaya Produk / HPP
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    label="Harga Mentahan"
                                    value={data.raw_material_price}
                                    onChange={handlePriceChange("raw_material_price")}
                                    errors={errors.raw_material_price}
                                    placeholder="0"
                                />
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    label="Harga Jok"
                                    value={data.upholstery_price}
                                    onChange={handlePriceChange("upholstery_price")}
                                    errors={errors.upholstery_price}
                                    placeholder="0"
                                />
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    label="Harga Bantal Peluk"
                                    value={data.cushion_price}
                                    onChange={handlePriceChange("cushion_price")}
                                    errors={errors.cushion_price}
                                    placeholder="0"
                                />
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    label="Harga Bantal Dudukan"
                                    value={data.seat_pillow_price}
                                    onChange={handlePriceChange("seat_pillow_price")}
                                    errors={errors.seat_pillow_price}
                                    placeholder="0"
                                />
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    label="Harga Kaca"
                                    value={data.glass_price}
                                    onChange={handlePriceChange("glass_price")}
                                    errors={errors.glass_price}
                                    placeholder="0"
                                />
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    label="Harga Cat/Finishing"
                                    value={data.finishing_price}
                                    onChange={handlePriceChange("finishing_price")}
                                    errors={errors.finishing_price}
                                    placeholder="0"
                                />
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    label="Harga Packing"
                                    value={data.packing_price}
                                    onChange={handlePriceChange("packing_price")}
                                    errors={errors.packing_price}
                                    placeholder="0"
                                />
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    label="Harga Jual"
                                    value={data.sell_price}
                                    onChange={handlePriceChange("sell_price")}
                                    errors={errors.sell_price}
                                    placeholder="0"
                                />
                            </div>

                            <div className="mt-4 rounded-2xl border border-[#ead9c7] bg-[#fff8ef] p-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-[#f1e0cf] p-2 text-[#8a5a3c]">
                                        <IconCalculator size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[#5b4031]">
                                            Total HPP Otomatis
                                        </p>
                                        <p className="text-lg font-bold text-[#8a5a3c]">
                                            {formatCurrency(totalHpp)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input
                                    type="number"
                                    label="Stok Produk"
                                    value={data.stock}
                                    onChange={(e) =>
                                        setData("stock", e.target.value)
                                    }
                                    errors={errors.stock}
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Link
                                href={route("products.index", { page: returnPage })}
                                className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors disabled:opacity-50"
                            >
                                <IconDeviceFloppy size={18} />
                                {processing
                                    ? "Menyimpan..."
                                    : "Simpan Perubahan"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

Edit.layout = (page) => <DashboardLayout children={page} />;
