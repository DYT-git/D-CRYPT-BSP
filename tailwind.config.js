/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          maroon:  '#E11D48', // Vibrant Alta Red (Primary, replaces HackSpire's purple)
          gold:    '#F59E0B', // Bright Amber (Accent)
          saffron: '#FFE4E6', // Soft Blush (Replaces HackSpire's lavender backgrounds)
          dark:    '#0A0A0A', // Pitch Black text for high contrast
          cream:   '#FFFFFF', // Pure White backgrounds
          rose:    '#FAFAFA', // Off-white for subtle section differentiation
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        bengali: ['var(--font-bengali)', 'sans-serif'],
        serif: ['var(--font-noto)', 'serif'],
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      }
    },
  },
  plugins: [],
};
