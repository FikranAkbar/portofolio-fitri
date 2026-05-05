import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import vercel from '@astrojs/vercel';

export default defineConfig({
  adapter: vercel(),
  output: 'static',
  devToolbar: { enabled: false },
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    icon({
      include: {
        mage: ['*'],
        ion:  ['*'],
      },
    }),
  ],
});
