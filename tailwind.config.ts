import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        // Custom Skylar Gradients
        "gradient-sky": "linear-gradient(135deg, hsl(209 100% 40%) 0%, hsl(209 100% 60%) 50%, hsl(0 0% 100%) 100%)",
        "gradient-sunset": "linear-gradient(135deg, hsl(209 100% 30%) 0%, hsl(25 85% 55%) 50%, hsl(51 100% 50%) 100%)",
        "gradient-gold": "linear-gradient(135deg, hsl(45 100% 45%) 0%, hsl(51 100% 50%) 50%, hsl(45 100% 60%) 100%)",
        "gradient-dark": "linear-gradient(180deg, hsl(0 0% 17%) 0%, hsl(0 0% 10%) 100%)",
      },
      fontFamily: {
        sans: ['ReplicaLL'],
        mono: ['ReplicaLLMono'],
      },
    },
  },
  plugins: [],
};
export default config;
