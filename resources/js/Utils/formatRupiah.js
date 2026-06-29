/**
 * Utility Format Rupiah untuk Input
 *
 * Aturan:
 * - Tampilkan angka dengan separator titik ribuan (contoh: 25.000)
 * - Tidak boleh ada simbol Rp atau karakter non-angka
 * - Tidak boleh awalan 0 (025000 → 25000)
 * - Tidak boleh negatif / minus
 */

/**
 * Format angka menjadi string tampilan rupiah (tanpa simbol).
 * Contoh: 4500000 → "4.500.000"
 * @param {number|string} value
 * @returns {string}
 */
export const formatRupiahDisplay = (value) => {
    const num = parseRawNumber(value);
    if (!num && num !== 0) return "";
    return num.toLocaleString("id-ID");
};

/**
 * Format angka penuh dengan label Rp untuk tampilan read-only.
 * Contoh: 4500000 → "Rp 4.500.000"
 * @param {number|string} value
 * @returns {string}
 */
export const formatRupiahLabel = (value = 0) => {
    const num = typeof value === "string" ? parseInt(value.replace(/\D/g, ""), 10) || 0 : Number(value) || 0;
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
    }).format(num);
};

/**
 * Parse string input menjadi angka murni.
 * Menghapus semua karakter non-angka (titik, koma, spasi, simbol).
 * Contoh: "4.500.000" → 4500000
 * Contoh: "025.000"   → 25000  (hapus awalan 0)
 * @param {string} str
 * @returns {number}
 */
export const parseRawNumber = (str) => {
    if (str === null || str === undefined || str === "") return 0;
    // Hapus semua karakter non-angka
    const digits = String(str).replace(/[^\d]/g, "");
    if (!digits) return 0;
    // parseInt secara otomatis menghapus awalan 0
    return parseInt(digits, 10);
};

/**
 * Handler untuk event onChange pada input harga.
 * Dipakai seperti: onChange={handleRupiahChange((val) => setData('sell_price', val))}
 *
 * - Memfilter input: hanya angka
 * - Menghapus awalan 0 (kecuali angka tunggal "0")
 * - Mengembalikan string angka murni (tanpa format) ke setter
 * - Mengembalikan nilai tampilan terformat (ribuan) untuk ditampilkan di input
 *
 * @param {Function} setter - fungsi untuk mengeset nilai ke form state
 * @returns {Function} - event handler untuk onChange
 */
export const handleRupiahChange = (setter) => (e) => {
    const raw = e.target.value;
    // Hapus semua bukan angka
    const digits = raw.replace(/[^\d]/g, "");
    // Hapus awalan 0
    const noLeadingZero = digits.replace(/^0+(\d)/, "$1");
    // Simpan sebagai angka murni ke form
    setter(noLeadingZero);
};

/**
 * Konversi nilai form (string angka murni) ke tampilan input (format ribuan).
 * Contoh: "4500000" → "4.500.000"
 * @param {string} rawValue - string angka murni dari form state
 * @returns {string}
 */
export const rupiahInputDisplay = (rawValue) => {
    if (!rawValue && rawValue !== 0) return "";
    const num = parseInt(String(rawValue).replace(/[^\d]/g, ""), 10);
    if (isNaN(num)) return "";
    return num.toLocaleString("id-ID");
};
