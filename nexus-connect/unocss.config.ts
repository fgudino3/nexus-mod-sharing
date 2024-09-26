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
