import { Users, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTimeRange } from '../contexts/TimeRangeContext';
import { useLanguage } from '../contexts/LanguageContext';

// Mock data generator for holder trends based on time range
const generateHolderTrendData = (range: '24H' | '7D' | '30D') => {
  const dataPoints = range === '24H' ? 24 : range === '7D' ? 7 : 28;
  const label = range === '24H' ? 'h' : 'day';

  return Array.from({ length: dataPoints }, (_, i) => ({
    [label]: i + 1,
    holders: 115 + Math.floor(Math.random() * 40),
  }));
};

// Holdings distribution data
const holdingDistribution = [
  { name: '一猫党', value: 64.5, count: 1900, color: '#10b981' },
  { name: '2-3猫党', value: 22.1, count: 651, color: '#fb923c' },
  { name: '4-10猫党', value: 8.6, count: 253, color: '#f97316' },
  { name: '11-50猫党', value: 4.3, count: 126, color: '#0ea5e9' },
  { name: '51-100猫党', value: 0.3, count: 9, color: '#a78bfa' },
  { name: '>100猫党', value: 0.2, count: 6, color: '#6b7280' },
];

// Holding period distribution
const holdingPeriodData = [
  { name: '>1Y', value: 54.6, color: '#10b981' },
  { name: '3M-1Y', value: 43.2, color: '#fb923c' },
  { name: '30-3M', value: 1.0, color: '#f97316' },
  { name: '7-30D', value: 1.2, color: '#0ea5e9' },
  { name: '1-7D', value: 0.0, color: '#a78bfa' },
  { name: '<24H', value: 0.7, color: '#fbbf24' },
];

// Holder changes by category
const holderChangesData = [
  { category: '一猫党', change: -10, color: '#06b6d4' },
  { category: '2-3猫党', change: 5, color: '#fb923c' },
  { category: '4-10猫党', change: -4, color: '#f87171' },
  { category: '11-50猫党', change: -1, color: '#60a5fa' },
  { category: '51-100猫党', change: 1, color: '#f87171' },
  { category: '>100猫党', change: 0, color: '#a3e635' },
];

// Top 5 reduction and increase
const topReduction = [
  { address: 'ff64', count: 14, held: 3 },
  { address: 'db07', count: 5, held: 3 },
  { address: 'fb2f', count: 4, held: 0 },
  { address: 'b8ea', count: 3, held: 0 },
  { address: 'e4df', count: 3, held: 1 },
];

const topIncrease = [
  { address: 'ff64', count: 17, held: 3 },
  { address: 'f699', count: 8, held: 0 },
  { address: 'f308', count: 6, held: 12 },
  { address: '45ce', count: 4, held: 24 },
  { address: '24d7', count: 4, held: 52 },
];

export function Holdings() {
  const { timeRange } = useTimeRange();
  const { t } = useLanguage();
  const holderTrendData = generateHolderTrendData(timeRange);
  const xAxisKey = timeRange === '24H' ? 'h' : 'day';

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-2 text-gray-600">
            <Users className="w-5 h-5" />
            <span className="text-xs">{t('holdings.totalHolders')}</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">2,945</div>
          <div className="flex items-center gap-1 text-xs font-medium text-red-600 mt-1">
            <TrendingDown className="w-3 h-3" />
            <span>-9 (30D)</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-2 text-gray-600">
            <Users className="w-5 h-5" />
            <span className="text-xs">{t('holdings.avgHolding')}</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">3.4 {t('holdings.cats')}</div>
          <div className="flex items-center gap-1 text-xs font-medium text-green-600 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+0.2 (30D)</span>
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
      {/* <div className="bg-white rounded-2xl p-4 shadow-lg">
        <h3 className="text-sm font-semibold mb-3 text-gray-700">持猫党人数变化</h3>
        <div className="space-y-2">
          {holderChangesData.map((item) => (
            <div key={item.category} className="flex items-center gap-2">
              <div className="w-24 text-xs text-gray-600">{item.category}:</div>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden flex items-center">
                  {item.change !== 0 && (
                    <div
                      className="h-full flex items-center justify-center text-white text-xs font-bold"
                      style={{
                        width: `${Math.abs(item.change) * 10}%`,
                        backgroundColor: item.color,
                        marginLeft: item.change < 0 ? '0' : 'auto',
                      }}
                    >
                      {item.change > 0 ? `+${item.change}` : item.change}
                    </div>
                  )}
                </div>
                <div
                  className="w-8 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: item.color }}
                >
                  {item.change > 0 ? `+${item.change}` : item.change === 0 ? '0' : item.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}

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
                  <span className="font-medium">{item.address}</span>
                  <span className="font-bold">{item.count}</span>
                </div>
                <div className="h-6 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded" style={{ width: `${(item.count / 14) * 100}%` }}></div>
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
                  <span className="font-medium">{item.address}</span>
                  <span className="font-bold">{item.count}</span>
                </div>
                <div className="h-6 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded" style={{ width: `${(item.count / 17) * 100}%` }}></div>
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
                dataKey="value"
              >
                {holdingDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {holdingDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-[10px]">
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
                dataKey="value"
              >
                {holdingPeriodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {holdingPeriodData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span>{item.name}</span>
                </div>
                <span className="font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}