import { Users, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Sector, Label } from 'recharts';
import { useState } from 'react';
import { useTimeRange } from '../contexts/TimeRangeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAverageHolding, useCurrentHoldersCount, useHoldingsTopChange, useHoldingBucketChange, useHoldingBucketDistribution, useHoldingDurationDistribution, type IndexTopTime } from '../../services';

// Mock data generator for holder trends based on time range
const generateHolderTrendData = (range: '24H' | '7D' | '30D') => {
  const dataPoints = range === '24H' ? 24 : range === '7D' ? 7 : 28;
  const label = range === '24H' ? 'h' : 'day';

  const result: { [key: string]: number }[] = [];
  for (let i = 0; i < dataPoints; i++) {
    result.push({
      [label]: i + 1,
      holders: 115 + Math.floor(Math.random() * 40),
    });
  }
  return result;
};

// 持猫时间分布：后端 bucket key -> 展示名 + 颜色（与圆环图一致）
const HOLDING_DURATION_CONFIG = [
  { key: 'gt1Year' as const, name: '>1Y', color: '#10b981' },
  { key: 'threeMonthsToOneYear' as const, name: '3M-1Y', color: '#fb923c' },
  { key: 'thirtyDaysToThreeMonths' as const, name: '30-3M', color: '#f97316' },
  { key: 'sevenToThirtyDays' as const, name: '7-30D', color: '#0ea5e9' },
  { key: 'oneToSevenDays' as const, name: '1-7D', color: '#a78bfa' },
  { key: 'lessThan24Hours' as const, name: '<24H', color: '#fbbf24' },
];

const HOLDER_BUCKET_CONFIG = [
  { key: 'oneCat' as const, label: '一猫党', color: '#06b6d4' },
  { key: 'twoToThreeCats' as const, label: '2-3猫党', color: '#fb923c' },
  { key: 'fourToTenCats' as const, label: '4-10猫党', color: '#f87171' },
  { key: 'elevenToFiftyCats' as const, label: '11-50猫党', color: '#60a5fa' },
  { key: 'fiftyOneToHundredCats' as const, label: '51-100猫党', color: '#f87171' },
  { key: 'moreThanHundredCats' as const, label: '>100猫党', color: '#a3e635' },
];

// 地址脱敏显示：首尾各 4 位，中间用 4 个 * 代替
const formatAddress = (address: string) => {
  if (!address) return '';
  if (address.length <= 8) return address;
  return `${address.slice(0, 4)}****${address.slice(-4)}`;
};

// 前端时间范围到后端参数映射
const timeRangeToBackend: Record<string, IndexTopTime> = {
  '24H': '1d',
  '7D': '7d',
  '30D': '30d',
  'ALL': 'all',
};

export function Holdings() {
  const { timeRange } = useTimeRange();
  const { t } = useLanguage();
  const { data: currentHoldersCount } = useCurrentHoldersCount();
  const { data: averageHolding } = useAverageHolding();
  const backendTime = timeRangeToBackend[timeRange] ?? '7d';
  const { data: holdingsTopChange } = useHoldingsTopChange(backendTime);
  const { data: holdingBucketChange } = useHoldingBucketChange(backendTime);
  const { data: holdingBucketDistribution } = useHoldingBucketDistribution();
  const { data: holdingDurationDistribution } = useHoldingDurationDistribution();
  const holderTrendData = generateHolderTrendData(timeRange);
  const xAxisKey = timeRange === '24H' ? 'h' : 'day';

  const topReduction = holdingsTopChange?.topReduction ?? [];
  const topIncrease = holdingsTopChange?.topIncrease ?? [];
  const totalHolders = holdingBucketDistribution?.totalHolders ?? 0;
  const holdingDistribution = HOLDER_BUCKET_CONFIG.map((item) => {
    const count = holdingBucketDistribution?.buckets[item.key] ?? 0;
    const value =
      totalHolders > 0 ? Number(((count / totalHolders) * 100).toFixed(1)) : 0;
    return {
      name: item.label,
      value,
      count,
      color: item.color,
    };
  });

  // 持猫时间分布：由接口数据生成，无数据时用 0 占位
  const durationTotalTokens =
    holdingDurationDistribution?.totalTokens ??
    HOLDING_DURATION_CONFIG.reduce((sum, item) => {
      const bucket = holdingDurationDistribution?.buckets[item.key];
      return sum + (bucket?.count ?? 0);
    }, 0);

  const holdingPeriodData = HOLDING_DURATION_CONFIG.map((item) => {
    const bucket = holdingDurationDistribution?.buckets[item.key];
    const count = bucket?.count ?? 0;
    const percentage =
      durationTotalTokens > 0
        ? Number(((count / durationTotalTokens) * 100).toFixed(1))
        : 0;
    return {
      name: item.name,
      count,
      percentage,
      color: item.color,
    };
  });


  const [activeDistributionIndex, setActiveDistributionIndex] = useState<number | null>(null);
  const [activeDurationIndex, setActiveDurationIndex] = useState<number | null>(null);

  const handleDistributionSliceClick = (_: unknown, index: number) => {
    setActiveDistributionIndex((prev) => (prev === index ? null : index));
  };

  const handleDistributionLegendClick = (index: number) => {
    setActiveDistributionIndex((prev) => (prev === index ? null : index));
  };

  const handleDurationSliceClick = (_: unknown, index: number) => {
    setActiveDurationIndex((prev) => (prev === index ? null : index));
  };

  const handleDurationLegendClick = (index: number) => {
    setActiveDurationIndex((prev) => (prev === index ? null : index));
  };

  const renderActiveDistributionShape = (props: any) => {
    const { outerRadius, ...rest } = props;
    return <Sector {...rest} outerRadius={outerRadius + 6} />;
  };

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-2 text-gray-600">
            <Users className="w-5 h-5" />
            <span className="text-xs">{t('holdings.totalHolders')}</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {currentHoldersCount ?? '-'}
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-red-600 mt-1">
            {/* <TrendingDown className="w-3 h-3" /> */}
            {/* <span>-9 (30D)</span> */}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-2 text-gray-600">
            <Users className="w-5 h-5" />
            <span className="text-xs">{t('holdings.avgHolding')}</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {averageHolding?.toFixed(2) ?? '-'} {t('holdings.cats')}
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-green-600 mt-1">
            {/* <TrendingUp className="w-3 h-3" /> */}
            {/* <span>+0.2 (30D)</span> */}
          </div>
        </div>
      </div>

      {/* Holder Trend Chart */}
      {/* <div className="bg-white rounded-2xl p-4 shadow-lg">
        <h3 className="text-sm font-semibold mb-3 text-gray-700">{t('holdings.trend')} ({timeRange})</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={holderTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={xAxisKey} tick={{ fontSize: 10 }} />
            <YAxis domain={[110, 160]} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="holders"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-2 flex justify-between text-xs text-gray-600">
          <span>115 (1.48%)</span>
          <span>150 (1.93%)</span>
        </div>
      </div> */}

      {/* Holder Changes by Category */}
      <div className="bg-white rounded-2xl p-4 shadow-lg">
        <h3 className="text-sm font-semibold mb-3 text-gray-700">持猫党人数变化</h3>
        <div className="space-y-2">
          {HOLDER_BUCKET_CONFIG.map((item) => {
            const change = holdingBucketChange?.buckets[item.key] ?? 0;
            const displayValue =
              change > 0 ? `+${change}` : change === 0 ? '0' : String(change);
            const widthPercent = Math.min(Math.abs(change) * 10, 100);

            return (
              <div key={item.key} className="flex items-center gap-2">
                <div className="w-24 text-xs text-gray-600">{item.label}:</div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden flex items-center">
                    {change !== 0 && (
                      <div
                        className="h-full flex items-center justify-center text-white text-xs font-bold"
                        style={{
                          width: `${widthPercent}%`,
                          backgroundColor: item.color,
                          marginLeft: change < 0 ? '0' : 'auto',
                        }}
                      >
                        {displayValue}
                      </div>
                    )}
                  </div>
                  <div
                    className="w-8 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: item.color }}
                  >
                    {displayValue}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shelves Count */}
      {/* <div className="bg-white rounded-2xl p-4 shadow-lg">
        <h3 className="text-sm font-semibold mb-3 text-gray-700">藏品上架数</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={holderTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={xAxisKey} tick={{ fontSize: 10 }} />
            <YAxis domain={[110, 160]} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="holders"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div> */}

      {/* Top 5 Reduction and Increase */}
      <div className="grid grid-cols-2 gap-3">
        {/* Top 5 Reduction */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <h3 className="text-xs font-semibold mb-3 text-gray-700">TOP5 总量 减持榜</h3>
          <div className="space-y-2">
            {topReduction.map((item, idx) => (
              <div key={item.address} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{formatAddress(item.address)}</span>
                  <span className="font-bold">{item.change}</span>
                </div>
                <div
                  className="h-6 bg-gradient-to-r from-orange-400 to-orange-500 rounded bar-grow"
                  style={{ width: `${(item.change / (topReduction[0]?.change || item.change || 1)) * 100}%` }}
                ></div>
                <div className="text-[10px] text-gray-500">持仓{item.held}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 Increase */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <h3 className="text-xs font-semibold mb-3 text-gray-700">TOP5 总量 增持榜</h3>
          <div className="space-y-2">
            {topIncrease.map((item, idx) => (
              <div key={item.address} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{formatAddress(item.address)}</span>
                  <span className="font-bold">{item.change}</span>
                </div>
                <div
                  className="h-6 bg-gradient-to-r from-orange-400 to-orange-500 rounded bar-grow"
                  style={{ width: `${(item.change / (topIncrease[0]?.change || item.change || 1)) * 100}%` }}
                ></div>
                <div className="text-[10px] text-gray-500">持仓{item.held}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-2 gap-3">
        {/* Holdings Distribution */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <h3 className="text-xs font-semibold mb-3 text-center text-gray-700">持猫党分布</h3>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={holdingDistribution}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={60}
                paddingAngle={2}
                dataKey="count"
                activeIndex={activeDistributionIndex ?? undefined}
                activeShape={renderActiveDistributionShape}
                onClick={handleDistributionSliceClick}
              >
                {holdingDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <Label
                  position="center"
                  content={(props: any) => {
                    const { viewBox } = props;
                    if (!viewBox || activeDistributionIndex === null) return null;
                    const { cx, cy } = viewBox as { cx: number; cy: number };
                    const activeItem = holdingDistribution[activeDistributionIndex];
                    if (!activeItem) return null;
                    return (
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs font-bold fill-gray-800"
                      >
                        {activeItem.count}
                      </text>
                    );
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {holdingDistribution.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-[10px] cursor-pointer"
                onClick={() => handleDistributionLegendClick(index)}
              >
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span>{item.name}</span>
                </div>
                <span className="font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Holding Period Distribution */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <h3 className="text-xs font-semibold mb-3 text-center text-gray-700">持猫时间分布</h3>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={holdingPeriodData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={60}
                paddingAngle={2}
                dataKey="count"
                activeIndex={activeDurationIndex ?? undefined}
                activeShape={renderActiveDistributionShape}
                onClick={handleDurationSliceClick}
              >
                {holdingPeriodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <Label
                  position="center"
                  content={(props: any) => {
                    const { viewBox } = props;
                    if (!viewBox || activeDurationIndex === null) return null;
                    const { cx, cy } = viewBox as { cx: number; cy: number };
                    const activeItem = holdingPeriodData[activeDurationIndex];
                    if (!activeItem) return null;
                    return (
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs font-bold fill-gray-800"
                      >
                        {activeItem.count}
                      </text>
                    );
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {holdingPeriodData.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-[10px] cursor-pointer"
                onClick={() => handleDurationLegendClick(index)}
              >
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span>{item.name}</span>
                </div>
                <span className="font-semibold">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}