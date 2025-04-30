/** @type {import('tailwindcss').Config} */
module.exports = {
    // Specify the paths to all template files so Tailwind can purge unused styles in production
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        // Extend default font families with custom fonts for convenience.
        // 'dos' for the DOS-style font, and 'dnd' for the D&D-style font.
        fontFamily: {
          dos: ['"Press Start 2P"', 'monospace'],
          dnd: ['"Cinzel"', 'serif'],
        },
      },
    },
};
  