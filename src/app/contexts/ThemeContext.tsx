import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => Theme;
};

type ThemeBridge = {
  setTheme: (theme: string) => boolean;
  getTheme: () => Theme;
  toggleTheme: () => Theme;
};

declare global {
  interface Window {
    LibertyCatsTheme?: ThemeBridge;
    setTheme?: ThemeBridge['setTheme'];
    getTheme?: ThemeBridge['getTheme'];
    toggleTheme?: ThemeBridge['toggleTheme'];
    __LIBERTY_CATS_INITIAL_THEME__?: Theme;
  }
}

const STORAGE_KEY = 'liberty-cats-theme';
const ThemeContext = createContext<ThemeContextValue | null>(null);

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}

function readInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  if (isTheme(window.__LIBERTY_CATS_INITIAL_THEME__)) return window.__LIBERTY_CATS_INITIAL_THEME__;

  const params = new URLSearchParams(window.location.search);
  const urlTheme = params.get('theme') ?? params.get('thenme');
  if (isTheme(urlTheme?.toLowerCase())) return urlTheme.toLowerCase() as Theme;

  let savedTheme: string | null = null;
  try {
    savedTheme = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Some embedded WebViews can disable storage; theme switching still works.
  }
  return isTheme(savedTheme) ? savedTheme : 'light';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#2d2d2d' : '#f9fafb');
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme);

  const setTheme = useCallback((nextTheme: Theme) => {
    applyTheme(nextTheme);
    try {
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // Persistence is optional in restricted WebViews.
    }
    setThemeState(nextTheme);
    window.dispatchEvent(new CustomEvent('libertycats:theme-change', { detail: { theme: nextTheme } }));
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme: Theme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    setTheme(nextTheme);
    return nextTheme;
  }, [setTheme]);

  useEffect(() => {
    applyTheme(theme);

    const bridge: ThemeBridge = {
      setTheme: (value) => {
        const normalized = value?.toLowerCase();
        if (!isTheme(normalized)) return false;
        setTheme(normalized);
        return true;
      },
      getTheme: () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light'),
      toggleTheme,
    };

    window.LibertyCatsTheme = bridge;
    // Short aliases make evaluateJavascript / WKWebView calls simpler.
    window.setTheme = bridge.setTheme;
    window.getTheme = bridge.getTheme;
    window.toggleTheme = bridge.toggleTheme;

    return () => {
      delete window.LibertyCatsTheme;
      delete window.setTheme;
      delete window.getTheme;
      delete window.toggleTheme;
    };
  }, [setTheme, theme, toggleTheme]);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [setTheme, theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
}
