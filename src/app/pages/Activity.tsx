import { Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { useTimeRange } from '../contexts/TimeRangeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useActivityHeatmap, useActivityScatter, type IndexTopTime } from '../../services';

// 默认热力图数据（作为后端数据加载前的占位 & 兜底）
const defaultHeatmapData = [
  { hour: '00', count: 11 },
  { hour: '01', count: 16 },
  { hour: '02', count: 1 },
  { hour: '03', count: 2 },
  { hour: '04', count: 0 },
  { hour: '05', count: 0 },
  { hour: '06', count: 0 },
  { hour: '07', count: 2 },
  { hour: '08', count: 1 },
  { hour: '09', count: 1 },
  { hour: '10', count: 11 },
  { hour: '11', count: 0 },
  { hour: '12', count: 0 },
  { hour: '13', count: 0 },
  { hour: '14', count: 3 },
  { hour: '15', count: 5 },
  { hour: '16', count: 27 },
  { hour: '17', count: 11 },
  { hour: '18', count: 10 },
  { hour: '19', count: 3 },
  { hour: '20', count: 17 },
  { hour: '21', count: 14 },
  { hour: '22', count: 7 },
  { hour: '23', count: 1 },
];

// Mock trend data
const trendData = Array.from({ length: 28 }, (_, i) => ({
  day: i + 1,
  price: 100000 + Math.random() * 50000,
  volume: Math.floor(Math.random() * 15000) + 5000,
}));

const timeRangeToBackend: Record<string, IndexTopTime> = {
  '24H': '1d',
  '7D': '7d',
  '30D': '30d',
  'ALL': 'all',
};

export function Activity() {
  const { t } = useLanguage();
  const { data: heatmapData, isPending } = useActivityHeatmap();
  const { timeRange } = useTimeRange();
  const backendTime = timeRangeToBackend[timeRange] ?? '7d';
  const { data: scatterData, isPending: isScatterPending } = useActivityScatter(backendTime);

  const finalScatterData =
    scatterData?.map((item) => ({
      timestampMs: item.timestampMs,
      price: item.price,
    })) ?? [];
  const finalHeatmapData = heatmapData && heatmapData.length > 0 ? heatmapData : defaultHeatmapData;

  return (
    <div className="space-y-4">

      {/* Transaction Distribution */}
      <div className="bg-white rounded-2xl p-4 shadow-lg">
        <h3 className="text-sm font-semibold mb-3 text-gray-700">交易分布</h3>
        <ResponsiveContainer width="100%" height={250}>
          <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="timestampMs"
              type="number"
              tick={{ fontSize: 10 }}
              domain={['auto', 'auto']}
              tickFormatter={(value: number) => {
                const d = new Date(value);
                const pad2 = (n: number) => String(n).padStart(2, '0');
                const month = pad2(d.getMonth() + 1);
                const date = pad2(d.getDate());
                const hours = pad2(d.getHours());
                const minutes = pad2(d.getMinutes());
                return `${month}-${date} ${hours}:${minutes}`;
              }}
            />
            <YAxis dataKey="price" tick={{ fontSize: 10 }} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value: any) => [value, 'Price']}
              labelFormatter={(value: any) => {
                const d = new Date(value);
                const pad2 = (n: number) => String(n).padStart(2, '0');
                const month = pad2(d.getMonth() + 1);
                const date = pad2(d.getDate());
                const hours = pad2(d.getHours());
                const minutes = pad2(d.getMinutes());
                const seconds = pad2(d.getSeconds());
                return `${month}-${date} ${hours}:${minutes}:${seconds}`;
              }}
            />
            <Scatter
              data={finalScatterData}
              fill="#fb923c"
              fillOpacity={0.6}
            />
          </ScatterChart>
        </ResponsiveContainer>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <img
              src="figma:asset/49c8d247271c35d7d5ac6b2296eeeb4783a051bd.png"
              alt="top1"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <div>
              <div className="font-semibold">top1: #9202</div>
              <div className="text-gray-500">17999 usd</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <img
              src="figma:asset/49c8d247271c35d7d5ac6b2296eeeb4783a051bd.png"
              alt="bottom"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <div>
              <div className="font-semibold">bottom: #6759</div>
              <div className="text-gray-500">1.02 usd</div>
            </div>
          </div>
        </div>
      </div>
      {/* 24H Heatmap */}
      <div className="bg-white rounded-2xl p-4 shadow-lg">
        <h3 className="text-sm font-semibold mb-3 text-gray-700">{t('activity.heatmap')}</h3>
        <div className="grid grid-cols-12 gap-1 mb-3">
          {finalHeatmapData.map((item) => (
            <div
              key={item.hour}
              className="aspect-square rounded flex flex-col items-center justify-center text-xs"
              style={{
                backgroundColor:
                  item.count === 0
                    ? '#fef3c7'
                    : item.count < 5
                      ? '#fed7aa'
                      : item.count < 10
                        ? '#fdba74'
                        : item.count < 15
                          ? '#fb923c'
                          : '#f97316',
                color: item.count >= 10 ? 'white' : '#92400e',
                opacity: isPending ? 0.6 : 1,
              }}
            >
              <span className="font-bold">{item.count}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-12 gap-1 text-[9px] text-gray-500 text-center">
          {finalHeatmapData.map((item) => (
            <div key={item.hour}>{item.hour}</div>
          ))}
        </div>
      </div>

    </div>
  );
}