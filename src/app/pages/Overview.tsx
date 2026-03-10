import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package } from 'lucide-react';
import { ComposedChart, Line, LineChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTimeRange } from '../contexts/TimeRangeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { React, useMemo } from 'react';
import { useIndexTop, useIndexTrend, useHolderTrend, type IndexTopTime } from '../../services';

const timeRangeToBackend: Record<string, IndexTopTime> = {
  '24H': '1d',
  '7D': '7d',
  '30D': '30d',
  'ALL': 'all',
};

function formatVolume(value: number): string {
  if (value >= 1_000_000) return `¥${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `¥${(value / 1_000).toFixed(2)}K`;
  return `¥${value.toFixed(2)}`;
}

function formatAxisNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(Math.round(value));
}

function formatHoldersAxis(value: number): string {
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
  return String(Math.round(value));
}

export function Overview() {
  const { timeRange } = useTimeRange();
  const { t } = useLanguage();
  const backendTime = timeRangeToBackend[timeRange] ?? '1d';
  const { data, isPending } = useIndexTop(backendTime);
  const { data: trendRes, isPending: isTrendPending } = useIndexTrend(backendTime);
  const { data: holderTrendRes, isPending: isHolderPending } = useHolderTrend();
  const trendData = trendRes?.points ?? [];
  const holderTrendData = holderTrendRes?.points ?? [];
  const holderTicks = useMemo(() => {
    if (!holderTrendData.length) return [];
    const n = holderTrendData.length;
    if (n <= 4) {
      return holderTrendData.map((p) => p.label);
    }
    const step = (n - 1) / 3;
    return [0, 1, 2, 3].map((i) => {
      const idx = Math.round(i * step);
      return holderTrendData[idx]?.label;
    }).filter(Boolean) as string[];
  }, [holderTrendData]);
  const xKey = timeRange === '24H' ? 'x' : 'label';

  const detail = data?.detail as any;
  const floorPrice = Number(detail?.stats.floorPrice).toFixed(2) ?? '--';
  const volumeStr = data != null ? formatVolume(Number(data.volume)) : '--';
  const transactionsStr = data != null ? String(data.transactions) : '--';
  const totalCount = data != null ? String(data.totalCount) : '--';
  const formatRange = (startMs: number, endMs: number) => {
    const pad2 = (n: number) => {
      const s = String(n);
      return s.length >= 2 ? s : `0${s}`;
    };
    const s = new Date(startMs);
    const e = new Date(endMs);
    const sStr = `${pad2(s.getMonth() + 1)}-${pad2(s.getDate())} ${pad2(s.getHours())}:${pad2(s.getMinutes())}`;
    const eStr = `${pad2(e.getMonth() + 1)}-${pad2(e.getDate())} ${pad2(e.getHours())}:${pad2(e.getMinutes())}`;
    return `${sStr} ~ ${eStr}`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const p = payload[0]?.payload;
    if (!p) return null;
    return (
      <div className="rounded-lg bg-white shadow-lg border border-gray-100 px-3 py-2 text-xs text-gray-700">
        {/* <div className="font-semibold text-gray-900 mb-1">{formatRange(p.startTimeMs, p.endTimeMs)}</div> */}
        <div className="flex justify-between gap-6">
          <span>平均成交价格</span>
          <span className="font-medium">{p.avgPrice == null ? '--' : Number(p.avgPrice).toFixed(2)}</span>
        </div>
        <div className="flex justify-between gap-6">
          <span>交易额</span>
          <span className="font-medium">{formatVolume(Number(p.volume))}</span>
        </div>
        <div className="flex justify-between gap-6">
          <span>成交数量</span>
          <span className="font-medium">{String(p.count)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3">

        <KPICard
          icon={<DollarSign className="w-5 h-5" />}
          label={t('overview.floorPrice')}
          value={isPending ? '...' : String(floorPrice)}
          change="+12.65%"
          trend="up"
        />
        <KPICard
          icon={<DollarSign className="w-5 h-5" />}
          label={`${timeRange} ${t('overview.volume')}`}
          value={isPending ? '...' : volumeStr}
          change="+38.3%"
          trend="up"
        />
        <KPICard
          icon={<ShoppingCart className="w-5 h-5" />}
          label={`${timeRange} ${t('overview.transactions')}`}
          value={isPending ? '...' : transactionsStr}
          change="+24.4%"
          trend="up"
        />
        <KPICard
          icon={<Package className="w-5 h-5" />}
          label={t('overview.totalNumber')}
          value={isPending ? '...' : totalCount}
          change="+24.4%"
          trend="up"
        />
      </div>

      {/* Trend Chart */}
      <div className="bg-white rounded-2xl p-4 shadow-lg">
        <h3 className="text-sm font-semibold mb-3 text-gray-700">{t('overview.trendChart')} ({timeRange})</h3>
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={isTrendPending ? [] : trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey={xKey}
              type={timeRange === '24H' ? 'number' : 'category'}
              domain={timeRange === '24H' ? [0, 24] : undefined}
              tick={{ fontSize: 10 }}
              tickFormatter={(v) => (timeRange === '24H' ? `${v}点` : v)}
            />
            <YAxis
              yAxisId="price"
              tick={{ fontSize: 10 }}
              tickFormatter={formatAxisNumber}
            />
            <YAxis
              yAxisId="volume"
              orientation="right"
              tick={{ fontSize: 10 }}
              tickFormatter={formatAxisNumber}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              yAxisId="volume"
              dataKey="volume"
              fill="#d1d5db"
              opacity={0.7}
              barSize={10}
            />
            {/* <Line
              yAxisId="price"
              type="monotone"
              dataKey="avgPrice"
              stroke="#7c3aed"
              strokeWidth={2}
              name={t('overview.price')}
              connectNulls
              dot={false}
            />
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="price"
              stroke="#f97316"
              strokeWidth={2}
              name={t('overview.floorPrice')}
              connectNulls
              dot={false}
            /> */}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Insight Card */}
      {/* <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl p-4 shadow-lg">
        <h3 className="text-sm font-semibold mb-2">{t('overview.insight')}</h3>
        <p className="text-sm leading-relaxed">
          {t('overview.insightText')}
        </p>
      </div> */}

      {/* Cat Holders Chart */}
      <div className="bg-white rounded-2xl p-4 shadow-lg">
        <h3 className="text-sm font-semibold mb-3 text-gray-700">{t('overview.holders')}</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={isHolderPending ? [] : holderTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              ticks={holderTicks}
              tickFormatter={(label: string) => (label?.length >= 10 ? label.slice(5) : label)}
            />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={formatHoldersAxis} />
            <Tooltip
              formatter={(value: any) => [value, t('overview.holders')]}
              labelFormatter={(label) => String(label)}
            />
            <Line
              type="monotone"
              dataKey="holders"
              stroke="#fb923c"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function KPICard({
  icon,
  label,
  value,
  change,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg">
      <div className="flex items-center gap-2 mb-2 text-gray-600">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className="text-xl font-bold text-gray-900 mb-1">{value}</div>
      {/* <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        <span>{change}</span>
      </div> */}
    </div>
  );
}