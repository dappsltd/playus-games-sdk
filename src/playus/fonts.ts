import { getCurrentLanguage } from './i18n';

export type RefreshOnFontsLoadedOptions = {
  /**
   * CSS font shorthand strings passed to document.fonts.load().
   * Defaults to the shared Playus game font used for canvas text.
   */
  fonts?: string[];

  /** Additional fonts loaded alongside the default or overridden fonts. */
  additionalFonts?: string[];
};

const DEFAULT_FONTS = [
  '700 16px Rebounded',
  '700 16px Unbounded',
  '700 16px ReboundedRemote',
  '700 16px UnboundedRemote',
];
const ARABIC_FONTS = [
  '400 16px Rebounded',
  '400 16px ReboundedRemote',
];
const ARABIC_SAMPLE_TEXT = 'العربية';

/**
 * Re-invokes `refresh` once the given web fonts are actually loaded, so
 * canvas-rendered text (Phaser/Babylon/Three) can redraw with the real font.
 *
 * DOM text updates by itself when a web font arrives (font-display: swap);
 * canvas text is rasterized once and stays on the fallback font. Drawing to
 * a canvas also never *triggers* an @font-face download — only DOM usage or
 * document.fonts.load() does — and document.fonts.ready can resolve before
 * the download was even requested. This helper loads the fonts explicitly,
 * which closes both gaps.
 *
 * Call once during game setup; `refresh` must re-render every canvas text
 * object (e.g. re-apply the Phaser text style).
 */
export function refreshOnFontsLoaded(
  refresh: () => void,
  options: RefreshOnFontsLoadedOptions = {}
): void {
  const fontSet = document.fonts;
  if (!fontSet) return;

  // No requestAnimationFrame here: rAF is paused while the page is hidden
  // (backgrounded WebView), which would swallow the refresh entirely.
  const fontLoads = options.fonts
    ? options.fonts.map((font) => fontSet.load(font).catch(() => []))
    : defaultFontLoads(fontSet);
  if (options.additionalFonts) {
    fontLoads.push(...options.additionalFonts.map((font) => fontSet.load(font).catch(() => [])));
  }

  Promise.all(fontLoads)
    .then(() => refresh());

  // Also refresh when any later font load finishes (e.g. a game-specific
  // font triggered by DOM usage after setup). Doubles as a second pass for
  // WebKit versions where a font is reported loaded slightly before it is
  // usable for canvas drawing.
  fontSet.addEventListener?.('loadingdone', () => refresh());
}

function defaultFontLoads(fontSet: FontFaceSet): Promise<FontFace[]>[] {
  const loads = [loadFirstAvailableFont(fontSet, DEFAULT_FONTS)];
  if (getCurrentLanguage() === 'ar') {
    loads.push(loadFirstAvailableFont(fontSet, ARABIC_FONTS, ARABIC_SAMPLE_TEXT));
  }
  return loads;
}

async function loadFirstAvailableFont(
  fontSet: FontFaceSet,
  fonts: string[],
  text?: string,
): Promise<FontFace[]> {
  for (const font of fonts) {
    const loaded = await fontSet.load(font, text).catch(() => []);
    if (loaded.length > 0) return loaded;
  }
  return [];
}
