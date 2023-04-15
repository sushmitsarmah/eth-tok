/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'manrope': ['Manrope', 'sans-serif']
      },
      colors: {
        'pink':'#DB2EF2',
        'green':'#26A646',
        'bluel':'#220859',
        'bluem':'#190840',
        'blued':'#121126',
      }
    },
  },
  plugins: [require("daisyui")],
}

