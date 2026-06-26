import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    "Inter",
                    "Plus Jakarta Sans",
                    ...defaultTheme.fontFamily.sans,
                ],
                mono: [
                    "JetBrains Mono",
                    "Fira Code",
                    ...defaultTheme.fontFamily.mono,
                ],
            },
            colors: {
                // Primary - Warm Taupe
                primary: {
                    50: "#faf6f0",
                    100: "#f3eadf",
                    200: "#e7d8c5",
                    300: "#dfcab4",
                    400: "#cbb093",
                    500: "#b89879",
                    600: "#a18265",
                    700: "#876c53",
                    800: "#6a5441",
                    900: "#4f3d2f",
                    950: "#24180f",
                },
                // Accent - Linen
                accent: {
                    50: "#fffdf9",
                    100: "#faf5ed",
                    200: "#f3eadd",
                    300: "#eee2d1",
                    400: "#e2d0b8",
                    500: "#cfb79b",
                    600: "#b69d82",
                    700: "#978067",
                    800: "#76624f",
                    900: "#56473a",
                    950: "#2a1d16",
                },
                // Success - Muted Olive
                success: {
                    50: "#f4f7ef",
                    100: "#e5ecd8",
                    200: "#cddab5",
                    300: "#b1c48e",
                    400: "#91a96a",
                    500: "#778c50",
                    600: "#60723f",
                    700: "#4c5932",
                    800: "#3c4728",
                    900: "#2d351f",
                    950: "#182012",
                },
                // Warning - Sand
                warning: {
                    50: "#fff9ef",
                    100: "#faefd3",
                    200: "#f1dcac",
                    300: "#e4c37f",
                    400: "#d1a657",
                    500: "#ba883b",
                    600: "#986a2d",
                    700: "#765123",
                    800: "#593d1c",
                    900: "#402c14",
                    950: "#241708",
                },
                // Danger - Terracotta
                danger: {
                    50: "#fcf2ee",
                    100: "#f5ded3",
                    200: "#e9bea9",
                    300: "#d7987b",
                    400: "#c17053",
                    500: "#a85239",
                    600: "#883f2c",
                    700: "#683022",
                    800: "#4e251b",
                    900: "#391b15",
                    950: "#1f0d0b",
                },
            },
            spacing: {
                18: "4.5rem",
                88: "22rem",
                100: "25rem",
                112: "28rem",
                128: "32rem",
            },
            minHeight: {
                touch: "2.75rem", // 44px - minimum touch target
                "touch-lg": "3rem", // 48px - comfortable touch target
            },
            minWidth: {
                touch: "2.75rem",
                "touch-lg": "3rem",
            },
            borderRadius: {
                "4xl": "2rem",
            },
            boxShadow: {
                glow: "0 0 20px rgba(184, 152, 121, 0.18)",
                "glow-lg": "0 0 40px rgba(184, 152, 121, 0.26)",
                "inner-lg": "inset 0 4px 6px -1px rgb(0 0 0 / 0.1)",
            },
            animation: {
                "slide-in": "slideIn 0.2s ease-out",
                "slide-up": "slideUp 0.2s ease-out",
                "fade-in": "fadeIn 0.15s ease-out",
                "pulse-subtle":
                    "pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "bounce-subtle":
                    "bounceSubtle 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                "cart-add": "cartAdd 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            },
            keyframes: {
                slideIn: {
                    "0%": { transform: "translateX(100%)", opacity: "0" },
                    "100%": { transform: "translateX(0)", opacity: "1" },
                },
                slideUp: {
                    "0%": { transform: "translateY(10px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                pulseSubtle: {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.7" },
                },
                bounceSubtle: {
                    "0%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.05)" },
                    "100%": { transform: "scale(1)" },
                },
                cartAdd: {
                    "0%": { transform: "scale(0.8)", opacity: "0" },
                    "50%": { transform: "scale(1.1)" },
                    "100%": { transform: "scale(1)", opacity: "1" },
                },
            },
            backdropBlur: {
                xs: "2px",
            },
            transitionDuration: {
                250: "250ms",
            },
        },
    },
    plugins: [forms],
};
