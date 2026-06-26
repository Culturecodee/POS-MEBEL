import { useEffect, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    IconUser,
    IconMail,
    IconLock,
    IconEye,
    IconEyeOff,
    IconLoader2,
    IconCheck,
    IconSparkles,
} from "@tabler/icons-react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        return () => reset("password", "password_confirmation");
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("register"));
    };

    return (
        <>
            <Head title="Daftar" />

            <div className="min-h-screen bg-[#fcf7f0] lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:bg-[#f8f1e7]">
                <div className="relative hidden overflow-hidden lg:flex items-center justify-center p-12">
                    <div className="absolute inset-0">
                        <img
                            src="/images/login-furniture.jpeg"
                            alt="Furniture"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(248,241,231,0.84),rgba(239,227,210,0.72),rgba(169,125,94,0.38))] backdrop-blur-[2px]" />
                    </div>

                    <div className="relative max-w-md text-center text-[#5d4333]">
                        <img
                            src="/images/aisyah-logo.jpg"
                            alt="Aisyah Dekorasi"
                            className="mx-auto mb-8 h-24 w-24 rounded-[28px] object-cover shadow-xl shadow-[#d7c0aa]/40 ring-1 ring-[#e7d8c8]"
                        />

                        <h2 className="mb-4 text-3xl font-bold">
                            Aisyah Dekorasi Jepara
                        </h2>

                        <div className="mt-8 space-y-3">
                            {[
                                "Kayu pilihan, finishing sempurna. Investasi jangka panjang untuk keluargamu",
                                "Ubah rumahmu menjadi istanamu. Setiap sudut terasa hangat dan nyaman",
                            ].map((feature, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-center gap-2 text-sm font-medium text-[#5d4333]"
                                >
                                    <IconCheck
                                        size={18}
                                        className="text-[#b89271]"
                                    />
                                    {feature}
                                </div>
                            ))}

                            <div className="flex items-center justify-center gap-2 pt-3 text-[#5d4333]">
                                <IconSparkles
                                    size={22}
                                    className="text-[#b89271]"
                                />
                                <p className="text-lg font-bold tracking-wide">
                                    Selamat Berbelanja
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center p-4 sm:p-6 lg:p-12">
                    <div className="w-full max-w-sm rounded-[24px] border border-[#efe1d0] bg-[#fffdf9]/96 p-5 shadow-xl shadow-[#e7d6c4]/35 backdrop-blur-sm sm:max-w-md sm:rounded-[30px] sm:border-[#e8d9c9] sm:bg-[#fffaf6]/94 sm:p-8 sm:shadow-2xl sm:shadow-[#d9c3ac]/25">
                        <div className="mb-6 text-center sm:mb-8">
                            <Link
                                href="/"
                                className="mb-4 inline-flex flex-col items-center gap-3 sm:mb-5"
                            >
                                <img
                                    src="/images/aisyah-logo.jpg"
                                    alt="Aisyah Dekorasi"
                                    className="h-14 w-14 rounded-2xl object-cover ring-1 ring-[#efe1d0] sm:h-16 sm:w-16 sm:ring-[#e7d8c8]"
                                />
                                <span className="text-lg font-bold text-[#5d4333] sm:text-xl">
                                    Aisyah Dekorasi Jepara
                                </span>
                            </Link>

                            <h1 className="text-2xl font-bold text-[#5d4333] sm:text-3xl">
                                Buat Akun Baru
                            </h1>
                        </div>

                        <form onSubmit={submit} className="space-y-4 sm:space-y-5">
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-[#745c4a] sm:mb-2 sm:text-sm sm:text-[#6b5343]">
                                    Nama Lengkap
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b705c] sm:left-4 sm:text-[#7a5c45]">
                                        <IconUser size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        placeholder="Nama Anda"
                                        className={`h-11 w-full rounded-xl border-2 pl-11 pr-4 text-sm text-slate-900 transition-all placeholder-[#9d836f] focus:ring-4 focus:ring-[#dbc1a7]/20 sm:h-12 sm:pl-12 sm:text-base sm:placeholder-[#8f735e] sm:focus:ring-[#c8aa8c]/20 ${
                                            errors.name
                                                ? "border-[#9b5c43] focus:border-[#9b5c43]"
                                                : "border-[#e5d7c8] focus:border-[#c4a180] sm:border-[#decfbe] sm:focus:border-[#b89271]"
                                        } bg-white`}
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-1.5 text-sm text-[#9b5c43]">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-[#745c4a] sm:mb-2 sm:text-sm sm:text-[#6b5343]">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b705c] sm:left-4 sm:text-[#7a5c45]">
                                        <IconMail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        placeholder="nama@email.com"
                                        className={`h-11 w-full rounded-xl border-2 pl-11 pr-4 text-sm text-slate-900 transition-all placeholder-[#9d836f] focus:ring-4 focus:ring-[#dbc1a7]/20 sm:h-12 sm:pl-12 sm:text-base sm:placeholder-[#8f735e] sm:focus:ring-[#c8aa8c]/20 ${
                                            errors.email
                                                ? "border-[#9b5c43] focus:border-[#9b5c43]"
                                                : "border-[#e5d7c8] focus:border-[#c4a180] sm:border-[#decfbe] sm:focus:border-[#b89271]"
                                        } bg-white`}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1.5 text-sm text-[#9b5c43]">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-[#745c4a] sm:mb-2 sm:text-sm sm:text-[#6b5343]">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b705c] sm:left-4 sm:text-[#7a5c45]">
                                        <IconLock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        placeholder="Minimal 8 karakter"
                                        className={`h-11 w-full rounded-xl border-2 pl-11 pr-11 text-sm text-slate-900 transition-all placeholder-[#9d836f] focus:ring-4 focus:ring-[#dbc1a7]/20 sm:h-12 sm:pl-12 sm:pr-12 sm:text-base sm:placeholder-[#8f735e] sm:focus:ring-[#c8aa8c]/20 ${
                                            errors.password
                                                ? "border-[#9b5c43] focus:border-[#9b5c43]"
                                                : "border-[#e5d7c8] focus:border-[#c4a180] sm:border-[#decfbe] sm:focus:border-[#b89271]"
                                        } bg-white`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8b705c] hover:text-[#b89271] sm:right-4 sm:text-[#7a5c45]"
                                    >
                                        {showPassword ? (
                                            <IconEyeOff size={20} />
                                        ) : (
                                            <IconEye size={20} />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1.5 text-sm text-[#9b5c43]">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-[#745c4a] sm:mb-2 sm:text-sm sm:text-[#6b5343]">
                                    Konfirmasi Password
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b705c] sm:left-4 sm:text-[#7a5c45]">
                                        <IconLock size={18} />
                                    </div>
                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Ulangi password"
                                        className={`h-11 w-full rounded-xl border-2 pl-11 pr-11 text-sm text-slate-900 transition-all placeholder-[#9d836f] focus:ring-4 focus:ring-[#dbc1a7]/20 sm:h-12 sm:pl-12 sm:pr-12 sm:text-base sm:placeholder-[#8f735e] sm:focus:ring-[#c8aa8c]/20 ${
                                            errors.password_confirmation
                                                ? "border-[#9b5c43] focus:border-[#9b5c43]"
                                                : "border-[#e5d7c8] focus:border-[#c4a180] sm:border-[#decfbe] sm:focus:border-[#b89271]"
                                        } bg-white`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8b705c] hover:text-[#b89271] sm:right-4 sm:text-[#7a5c45]"
                                    >
                                        {showConfirmPassword ? (
                                            <IconEyeOff size={20} />
                                        ) : (
                                            <IconEye size={20} />
                                        )}
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="mt-1.5 text-sm text-[#9b5c43]">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d2b190] to-[#b98d6d] text-sm font-semibold text-white transition-all hover:from-[#c8a27f] hover:to-[#a97d5e] focus:ring-4 focus:ring-[#dbc1a7]/30 disabled:opacity-50 sm:h-12 sm:text-base sm:from-[#c7a27f] sm:to-[#a97d5e] sm:focus:ring-[#c8aa8c]/30"
                            >
                                {processing ? (
                                    <>
                                        <IconLoader2
                                            size={20}
                                            className="animate-spin"
                                        />
                                        Memproses...
                                    </>
                                ) : (
                                    "Daftar Sekarang"
                                )}
                            </button>

                            <p className="text-center text-xs font-medium text-[#7b6453] sm:text-sm sm:text-[#6b5343]">
                                Sudah punya akun?{" "}
                                <Link
                                    href="/login"
                                    className="font-semibold text-[#9a7356] hover:text-[#7a5c45]"
                                >
                                    Masuk disini
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
