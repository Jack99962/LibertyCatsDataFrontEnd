import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type FontScale = 1 | 1.15 | 1.5;

type FontScaleContextValue = {
  fontScale: FontScale;
  setFontScale: (scale: FontScale) => void;
};

type FontScaleBridge = {
  setFontScale: (scale: number | string) => boolean;
  getFontScale: () => FontScale;
};

declare global {
  interface Window {
    LibertyCatsFontScale?: FontScaleBridge;
    setFontScale?: FontScaleBridge['setFontScale'];
    getFontScale?: FontScaleBridge['getFontScale'];
    __LIBERTY_CATS_INITIAL_FONT_SCALE__?: FontScale;
  }
}

const STORAGE_KEY = 'liberty-cats-font-scale';
const DEFAULT_SCALE: FontScale = 1;
const FontScaleContext = createContext<FontScaleContextValue | null>(null);

function parseFontScale(value: unknown): FontScale | null {
  const scale = typeof value === 'number' ? value : Number(value);
  return scale === 1 || scale === 1.15 || scale === 1.5 ? scale : null;
}

function readInitialFontScale(): FontScale {
  if (typeof window === 'undefined') return DEFAULT_SCALE;

  const injectedScale = parseFontScale(window.__LIBERTY_CATS_INITIAL_FONT_SCALE__);
  if (injectedScale) return injectedScale;

  const urlScale = parseFontScale(new URLSearchParams(window.location.search).get('fontScale'));
  if (urlScale) return urlScale;

  try {
    return parseFontScale(window.localStorage.getItem(STORAGE_KEY)) ?? DEFAULT_SCALE;
  } catch {
    return DEFAULT_SCALE;
  }
}

function applyFontScale(scale: FontScale) {
  document.documentElement.style.setProperty('--font-scale', String(scale));
  document.documentElement.dataset.fontScale = String(scale);
}

export function FontScaleProvider({ children }: { children: React.ReactNode }) {
  const [fontScale, setFontScaleState] = useState<FontScale>(readInitialFontScale);

  const setFontScale = useCallback((scale: FontScale) => {
    applyFontScale(scale);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(scale));
    } catch {
      // Persistence is optional in restricted WebViews.
    }
    setFontScaleState(scale);
    window.dispatchEvent(
      new CustomEvent('libertycats:font-scale-change', { detail: { fontScale: scale } }),
    );
  }, []);

  useEffect(() => {
    applyFontScale(fontScale);

    const bridge: FontScaleBridge = {
      setFontScale: (value) => {
        const scale = parseFontScale(value);
        if (!scale) return false;
        setFontScale(scale);
        return true;
      },
      getFontScale: () =>
        parseFontScale(document.documentElement.dataset.fontScale) ?? DEFAULT_SCALE,
    };

    window.LibertyCatsFontScale = bridge;
    window.setFontScale = bridge.setFontScale;
    window.getFontScale = bridge.getFontScale;

    return () => {
      delete window.LibertyCatsFontScale;
      delete window.setFontScale;
      delete window.getFontScale;
    };
  }, [fontScale, setFontScale]);

  const value = useMemo(() => ({ fontScale, setFontScale }), [fontScale, setFontScale]);
  return <FontScaleContext.Provider value={value}>{children}</FontScaleContext.Provider>;
}

export function useFontScale() {
  const context = useContext(FontScaleContext);
  if (!context) throw new Error('useFontScale must be used inside FontScaleProvider');
  return context;
}
