import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        muted: "#5B6475",
        line: "#E6EAF0",
        delta: "#1256D6",
        profit: "#0C8F69",
        amber: "#C97D16"
      },
      boxShadow: {
        soft: "0 18px 55px rgba(17, 24, 39, 0.08)",
        lift: "0 20px 70px rgba(18, 86, 214, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
