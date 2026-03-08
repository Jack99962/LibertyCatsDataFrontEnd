import { createContext, useContext, useState, ReactNode } from 'react';

export type TimeRange = '24H' | '7D' | '30D';

interface TimeRangeContextType {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}

const TimeRangeContext = createContext<TimeRangeContextType | undefined>(undefined);

export function TimeRangeProvider({ children }: { children: ReactNode }) {
  const [timeRange, setTimeRange] = useState<TimeRange>('24H');

  return (
    <TimeRangeContext.Provider value={{ timeRange, setTimeRange }}>
      {children}
    </TimeRangeContext.Provider>
  );
}

export function useTimeRange() {
  const context = useContext(TimeRangeContext);
  if (context === undefined) {
    throw new Error('useTimeRange must be used within a TimeRangeProvider');
  }
  return context;
}
