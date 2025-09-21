const plugin = require("tailwindcss/plugin");
const colors = require("tailwindcss/colors");
const { parseColor } = require("tailwindcss/lib/util/color");
const { staticPrimaryColor } = require("./src/plugins/vuetify/theme");

/** Converts HEX color to RGB */
const toRGB = (value) => {
  return parseColor(value).color.join(" ");
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,vue}"],
  safelist: [
    {
      pattern: /animate-delay-.+/,
    },
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: staticPrimaryColor,
        "on-primary": "#fff",
        secondary: "#FFEEEC",
        "on-secondary": "#fff",
        success: "#28C76F",
        "on-success": "#fff",
        info: "#00CFE8",
        "on-info": "#fff",
        warning: "#FF9F43",
        "on-warning": "#fff",
        danger: "#EA5455",
        background: "#F8F7FA",
        "darkmode-bg": "#25293C",
        surface: "#2F3349",
        "on-background": "#2F2B3D",
        "on-surface": "#2F2B3D",
        "grey-50": "#FAFAFA",
        "grey-100": "#F5F5F5",
        "grey-200": "#EEEEEE",
        "grey-300": "#E0E0E0",
        "grey-400": "#BDBDBD",
        "grey-500": "#9E9E9E",
        "grey-600": "#757575",
        "grey-700": "#616161",
        "grey-800": "#424242",
        "grey-900": "#212121",
        "perfect-scrollbar-thumb": "#DBDADE",
        "skin-bordered-background": "#fff",
        "skin-bordered-surface": "#fff",
      },
      fontFamily: "Helvetica Neue, sans-serif",
      container: {
        center: true,
      },
      maxWidth: {
        "1/4": "25%",
        "1/2": "50%",
        "3/4": "75%",
      },
      strokeWidth: {
        0.5: 0.5,
        1.5: 1.5,
        2.5: 2.5,
      },
      keyframes: {
        // Side & simple menu
        "intro-divider": {
          "100%": {
            opacity: 1,
          },
        },
        "intro-menu": {
          "100%": {
            opacity: 1,
            transform: "translateX(0px)",
          },
        },

        // Top menu
        "intro-top-menu": {
          "100%": {
            opacity: 1,
            transform: "translateY(0px)",
          },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, matchUtilities }) {
      addBase({
        // Default dark-mode colors
        ".dark": {
          "--color-primary": toRGB(colors.orange["700"]),
          "--color-darkmode-50": toRGB("#2f3349"),
          "--color-darkmode-100": "74 90 121",
          "--color-darkmode-200": "65 81 114",
          "--color-darkmode-300": "53 69 103",
          "--color-darkmode-400": "48 61 93",
          "--color-darkmode-500": "41 53 82",
          "--color-darkmode-600": "40 51 78",
          "--color-darkmode-700": "35 45 69",
          "--color-darkmode-800": "27 37 59",
          "--color-darkmode-900": "15 23 42",
        },
      });
      // Animation delay utilities
      matchUtilities(
        {
          "animate-delay": (value) => ({
            "animation-delay": value,
          }),
        },
        {
          values: (() => {
            const values = {};
            for (let i = 1; i <= 50; i++) {
              values[i * 10] = `${i * 0.1}s`;
            }
            return values;
          })(),
        }
      );

      // Animation fill mode utilities
      matchUtilities(
        {
          "animate-fill-mode": (value) => ({
            "animation-fill-mode": value,
          }),
        },
        {
          values: {
            none: "none",
            forwards: "forwards",
            backwards: "backwards",
            both: "both",
          },
        }
      );
    }),
  ],
  variants: {},
};
