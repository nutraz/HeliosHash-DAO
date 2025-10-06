module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // One World Project color scheme
        dark: '#151515', // rgb(21, 21, 21)
        dark2: '#1f2021', // rgb(31, 32, 33)
        dark3: '#1d1e1e', // rgb(29, 30, 30)
        card: '#262626', // rgb(38, 38, 38)
        accent: '#8c42c8', // rgb(140, 66, 200)
        accent2: '#655ad6', // rgb(101, 90, 214)
        accent3: '#65bad6', // rgb(101, 186, 214)
        accent4: '#de4aff', // rgb(222, 74, 255)
        accent5: '#a008c2', // rgb(160, 8, 194)
        green: '#84ed92', // rgb(132, 237, 146)
        blue: '#408efa', // rgb(64, 142, 250)
        gray: '#979797', // rgb(151, 151, 151)
        light: '#ffffff', // rgb(255, 255, 255)
        muted: '#cccccc', // rgb(204, 204, 204)
      },
    },
  },
  plugins: [],
};
