// El archivo theme.js define las paletas de colores para la app
// y el contexto de tema.

import React, { createContext, useContext } from 'react';

const palettes = {
  dark: {
    mode: 'dark',
    background: '#0b1020',
    surface: '#111827',
    card: '#151f31',
    border: '#273449',
    text: '#f8fafc',
    muted: '#94a3b8',
    accent: '#67b8ff',
    accentStrong: '#2878d0',
    accentSoft: '#172b45',
    danger: '#ef4444',
    success: '#34d399',
    warning: '#facc15',
    input: '#0f172a',
  },
  light: {
    mode: 'light',
    background: '#f1f5f9',
    surface: '#ffffff',
    card: '#ffffff',
    border: '#d9e2ee',
    text: '#142033',
    muted: '#5d6b7f',
    accent: '#1769aa',
    accentStrong: '#155c96',
    accentSoft: '#e5f1fb',
    danger: '#c93636',
    success: '#16865b',
    warning: '#a56a00',
    input: '#f8fafc',
  },
};

const ThemeContext = createContext(palettes.dark);

export const ThemeProvider = ({ darkMode, children }) => (
  <ThemeContext.Provider value={darkMode ? palettes.dark : palettes.light}>
    {children}
  </ThemeContext.Provider>
);

export const useAppTheme = () => useContext(ThemeContext);
