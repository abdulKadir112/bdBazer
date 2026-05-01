// vite.config.js
export default {
  // ... অন্যান্য কনফিগ
  plugins: [
    {
      name: 'force-close',
      closeBundle() {
        if (process.env.VERCEL) {
          process.exit(0);
        }
      }
    }
  ]
}