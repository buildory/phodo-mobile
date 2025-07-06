const rawTokens = require("./shared/styles/tokens.json");
const plugin = require("tailwindcss/plugin");
const { extractTheme, extractColorTheme, extractTypographyTheme } = require("./scripts/extract-theme");

const roleColors = extractColorTheme(rawTokens.color?.role || {});
const paletteColors = extractColorTheme(rawTokens.color?.palette || {});
const typographyUtils = extractTypographyTheme(rawTokens.typography || {});
const borderRadius = extractTheme(rawTokens.borderRadius || {});
const spacing = extractTheme(rawTokens.spacing || {});
const boxShadow = extractTheme(rawTokens.boxShadow || {});

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./features/**/*.{js,ts,jsx,tsx}",
    "./entities/**/*.{js,ts,jsx,tsx}",
    "./shared/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
      colors: {
        ...roleColors,
        ...paletteColors,
      },
      fontFamily: {
        sans: ["Pretendard"],
      },
      borderRadius,
      spacing,
      boxShadow
  },
    plugins: [
    plugin(({ addUtilities }) => {
      addUtilities(typographyUtils);
    }),
  ]
  }