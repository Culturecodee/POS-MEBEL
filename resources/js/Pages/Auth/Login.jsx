import { useEffect, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    IconEye,
    IconEyeOff,
    IconLoader2,
} from "@tabler/icons-react";

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => reset("password");
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <>
            <Head title="Login" />

            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fcf7f0] px-3 py-6 sm:bg-[#f8f1e7] sm:px-4 sm:py-10">
                <div className="absolute inset-0">
                    <img
                        src="/images/login-furniture.jpeg"
                        alt="Background"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,252,248,0.92),rgba(248,240,230,0.88),rgba(210,177,144,0.2))] backdrop-blur-[1.5px] sm:bg-[linear-gradient(135deg,rgba(248,241,231,0.84),rgba(239,227,210,0.72),rgba(169,125,94,0.38))] sm:backdrop-blur-[2px]" />
                </div>

                <div className="absolute -left-24 top-0 h-64 w-64 rounded-full bg-[#f2e6d8]/80 blur-3xl sm:h-80 sm:w-80 sm:bg-[#ead9c7]/70" />
                <div className="absolute -bottom-16 right-0 h-64 w-64 rounded-full bg-[#e8d3bc]/70 blur-3xl sm:h-80 sm:w-80 sm:bg-[#d9c1aa]/60" />

                <div className="relative z-10 w-full max-w-sm rounded-[24px] border border-[#efe1d0] bg-[#fffdf9]/96 p-5 shadow-xl shadow-[#e7d6c4]/35 backdrop-blur-xl sm:max-w-md sm:rounded-[30px] sm:border-[#e8d9c9] sm:bg-[#fffaf6]/94 sm:p-8 sm:shadow-2xl sm:shadow-[#d9c3ac]/25 md:p-10">
                    <div className="mb-6 text-center sm:mb-8">
                        <img
                            src="/images/aisyah-logo.jpg"
                            alt="Aisyah Dekorasi"
                            className="mx-auto h-14 w-14 rounded-2xl object-cover shadow-lg shadow-[#d9c3ac]/30 ring-1 ring-[#efe1d0] sm:h-16 sm:w-16 sm:ring-[#e7d8c8]"
                        />
                        <h1 className="mt-4 text-2xl font-bold text-[#5d4333] sm:mt-5 sm:text-3xl">
                            Selamat Datang
                        </h1>
                        <p className="mt-2 text-xs font-medium tracking-[0.08em] text-[#8b705c] sm:text-sm sm:tracking-normal sm:text-[#7a5c45]">
                            TOKO AISYAH DEKORASI JEPARA
                        </p>
                    </div>

                    {status && (
                        <div className="mb-6 rounded-xl bg-[#f4e7d8] p-4 text-center text-sm text-[#7a5c45]">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4 sm:space-y-6">
                        <div className="relative">
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                required
                                placeholder=" "
                                className="peer h-12 w-full rounded-xl border border-[#e5d7c8] bg-white/98 px-4 pb-2 pt-4 text-sm text-slate-800 shadow-sm outline-none transition-all duration-300 focus:border-[#c4a180] focus:bg-white focus:ring-4 focus:ring-[#dbc1a7]/20 sm:h-14 sm:border-[#decfbe] sm:pt-5 sm:text-base sm:focus:border-[#b89271] sm:focus:ring-[#c8aa8c]/20"
                            />
                            <label className="absolute left-4 top-2 text-[11px] text-[#745c4a] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#9d836f] sm:text-xs sm:text-[#6b5343] sm:peer-placeholder-shown:top-4 sm:peer-placeholder-shown:text-[#8f735e]">
                                Email
                            </label>
                            {errors.email && (
                                <p className="mt-1 text-sm text-[#9b5c43]">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                required
                                placeholder=" "
                                className="peer h-12 w-full rounded-xl border border-[#e5d7c8] bg-white/98 px-4 pb-2 pt-4 text-sm text-slate-800 shadow-sm outline-none transition-all duration-300 focus:border-[#c4a180] focus:bg-white focus:ring-4 focus:ring-[#dbc1a7]/20 sm:h-14 sm:border-[#decfbe] sm:pt-5 sm:text-base sm:focus:border-[#b89271] sm:focus:ring-[#c8aa8c]/20"
                            />
                            <label className="absolute left-4 top-2 text-[11px] text-[#745c4a] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#9d836f] sm:text-xs sm:text-[#6b5343] sm:peer-placeholder-shown:top-4 sm:peer-placeholder-shown:text-[#8f735e]">
                                Password
                            </label>

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b705c] transition hover:text-[#b89271] sm:text-[#7a5c45]"
                            >
                                {showPassword ? (
                                    <IconEyeOff size={20} />
                                ) : (
                                    <IconEye size={20} />
                                )}
                            </button>

                            {errors.password && (
                                <p className="mt-1 text-sm text-[#9b5c43]">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d2b190] to-[#b98d6d] text-sm font-semibold text-white shadow-lg shadow-[#e0c8b1]/35 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 sm:h-14 sm:text-base sm:from-[#c7a27f] sm:to-[#a97d5e] sm:shadow-[#d9c3ac]/25"
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
                                "Masuk Sekarang"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
