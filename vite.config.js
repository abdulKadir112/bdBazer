import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(), // আপনার CSS এর জন্য
    {
      name: 'force-close',
      closeBundle() {
        if (process.env.VERCEL) {
          // বিল্ড শেষ হলে Vercel-কে সিগন্যাল দিবে যে কাজ শেষ
          setTimeout(() => process.exit(0), 100);
        }
      }
    }
  ],
})