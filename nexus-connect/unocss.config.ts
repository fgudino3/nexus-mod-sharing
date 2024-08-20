import {
  presetWind,
  defineConfig,
  presetWebFonts,
} from 'unocss';
import { colors, theme } from 'unocss/preset-wind';

export default defineConfig({
  presets: [
    presetWind({ dark: 'media' }),
    presetWebFonts({
      provider: 'google',
      fonts: { nunito: 'Nunito' },
    }),
  ],
});
