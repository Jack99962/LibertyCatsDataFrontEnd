import React from 'react';
import { TimeRangeProvider } from '../contexts/TimeRangeContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { Layout } from './Layout';

export function RootLayout() {
  return (
    <LanguageProvider>
      <TimeRangeProvider>
        <Layout />
      </TimeRangeProvider>
    </LanguageProvider>
  );
}