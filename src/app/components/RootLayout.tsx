import React from 'react';
import { TimeRangeProvider } from '../contexts/TimeRangeContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { FontScaleProvider } from '../contexts/FontScaleContext';
import { Layout } from './Layout';

export function RootLayout() {
  return (
    <ThemeProvider>
      <FontScaleProvider>
        <LanguageProvider>
          <TimeRangeProvider>
            <Layout />
          </TimeRangeProvider>
        </LanguageProvider>
      </FontScaleProvider>
    </ThemeProvider>
  );
}
