import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTimeRange } from '../contexts/TimeRangeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { React } from 'react';

// Mock data generator based on time range
const generateTrendData = (range: '24H' | '7D' | '30D') => {
  const dataPoints = range === '24H' ? 24 : range === '7D' ? 7 : 28;
  const label = range === '24H' ? 'h' : 'day';

  return Array.from({ length: dataPoints }, (_, i) => ({
    [label]: i + 1,
    price: 8000 + Math.random() * 3000,
    volume: Math.floor(Math.random() * 10000) + 1000,
  }));
};

export function Overview() {
  const { timeRange } = useTimeRange();
  const { t } = useLanguage();
  const trendData = generateTrendData(timeRange);
  const xAxisKey = timeRange === '24H' ? 'h' : 'day';

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        <KPICard
          icon={<DollarSign className="w-5 h-5" />}
          label={t('overview.floorPrice')}
          value="$9,312"
          change="+12.65%"
          trend="up"
        />
        <KPICard
          icon={<DollarSign className="w-5 h-5" />}
          label={`${timeRange} ${t('overview.volume')}`}
          value="¥316.58M"
          change="+38.3%"
          trend="up"
        />
        <KPICard
          icon={<ShoppingCart className="w-5 h-5" />}
          label={`${timeRange} ${t('overview.transactions')}`}
          value="15263"
          change="+24.4%"
          trend="up"
        />
        <KPICard
          icon={<Package className="w-5 h-5" />}
          label={t('overview.listed')}
          value="102"
          change="+24.4%"
          trend="up"
        />
      </div>

      {/* Trend Chart */}
      <div className="bg-white rounded-2xl p-4 shadow-lg">
        <h3 className="text-sm font-semibold mb-3 text-gray-700">{t('overview.trendChart')} ({timeRange})</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={xAxisKey} tick={{ fontSize: 10 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="price"
              stroke="#fb923c"
              strokeWidth={2}
              name={t('overview.price')}
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="volume"
              stroke="#fdba74"
              strokeWidth={2}
              name={t('overview.volumeCount')}
              dot={{ fill: '#fdba74', r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insight Card */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl p-4 shadow-lg">
        <h3 className="text-sm font-semibold mb-2">{t('overview.insight')}</h3>
        <p className="text-sm leading-relaxed">
          {t('overview.insightText')}
        </p>
      </div>

      {/* Cat Holders Chart */}
      <div className="bg-white rounded-2xl p-4 shadow-lg">
        <h3 className="text-sm font-semibold mb-3 text-gray-700">{t('overview.holders')}</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={[
            { month: '11月', holders: 2963 },
            { month: '12月', holders: 2953 },
            { month: '1月', holders: 2950 },
            { month: '2月', holders: 2942 },
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="holders" fill="#fb923c" radius={[8, 8, 0, 0]} />
          </BarChart>
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
      <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        <span>{change}</span>
      </div>
    </div>
  );
}