import { presetWind, defineConfig, presetWebFonts } from 'unocss';
import { colors, theme } from 'unocss/preset-wind';
import presetAnimations from 'unocss-preset-animations';
import { presetShadcn } from 'unocss-preset-shadcn';

export default defineConfig({
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
