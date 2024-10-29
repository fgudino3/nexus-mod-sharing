import {
  presetWind,
  defineConfig,
  presetWebFonts,
  transformerDirectives,
} from 'unocss';
import { colors, theme } from 'unocss/preset-wind';
import presetAnimations from 'unocss-preset-animations';
import { presetShadcn } from 'unocss-preset-shadcn';

export default defineConfig({
  transformers: [transformerDirectives()],
  shortcuts: {
    'sticky-header':
      'sticky top-0 px-4 py-2 -mx-4 -mt-2 z-10 bg-background/80 backdrop-blur-sm backdrop-filter',
  },
  presets: [
    presetWind({ dark: 'media' }),
    presetAnimations(),
    presetShadcn({
      color: 'orange',
    }),
    presetWebFonts({
      provider: 'google',
      fonts: { nunito: 'Nunito' },
    }),
  ],
});
