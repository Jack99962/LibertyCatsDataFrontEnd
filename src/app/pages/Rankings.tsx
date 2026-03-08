import { TrendingUp, TrendingDown, Star, Send, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

// Top 30 addresses data
const top30Addresses = [
  { rank: 1, address: 'dead', lastMonth: 2126, thisMonth: 2126, change: 0, proportion: 21.46, note: '官方累积销毁2126pcs', isOfficial: true },
  { rank: 2, address: '04c4', lastMonth: 168, thisMonth: 170, change: 2, proportion: 1.68, note: '★创始人账号', isCreator: true },
  { rank: 3, address: 'ca3f', lastMonth: 81, thisMonth: 81, change: 0, proportion: 0.81 },
  { rank: 4, address: '263d', lastMonth: 73, thisMonth: 73, change: 0, proportion: 0.73 },
  { rank: 5, address: '8643', lastMonth: 67, thisMonth: 67, change: 0, proportion: 0.67 },
  { rank: 6, address: 'e5e6', lastMonth: 65, thisMonth: 65, change: 0, proportion: 0.65 },
  { rank: 7, address: '5ab0', lastMonth: 58, thisMonth: 58, change: 0, proportion: 0.58 },
  { rank: 8, address: '24d7', lastMonth: 42, thisMonth: 52, change: 10, proportion: 0.42, note: '★官方账号，回购', isOfficial: true },
  { rank: 9, address: 'ff5c', lastMonth: 51, thisMonth: 51, change: 0, proportion: 0.51 },
  { rank: 10, address: 'b081', lastMonth: 48, thisMonth: 48, change: 0, proportion: 0.48 },
  { rank: 11, address: 'bf88', lastMonth: 47, thisMonth: 47, change: 0, proportion: 0.47 },
  { rank: 12, address: '42c3', lastMonth: 41, thisMonth: 41, change: 0, proportion: 0.41 },
  { rank: 13, address: '8e1d', lastMonth: 37, thisMonth: 40, change: 3, proportion: 0.37 },
  { rank: 14, address: 'e7aa', lastMonth: 39, thisMonth: 39, change: 0, proportion: 0.39 },
  { rank: 15, address: 'ab6b', lastMonth: 38, thisMonth: 38, change: 0, proportion: 0.38 },
  { rank: 16, address: '52bb', lastMonth: 39, thisMonth: 38, change: -1, proportion: 0.39 },
  { rank: 17, address: '02d5', lastMonth: 35, thisMonth: 35, change: 0, proportion: 0.35 },
  { rank: 18, address: '1de0', lastMonth: 34, thisMonth: 33, change: -1, proportion: 0.34, note: '★猫猫公益账户' },
  { rank: 19, address: 'ef83', lastMonth: 32, thisMonth: 32, change: 0, proportion: 0.32 },
  { rank: 20, address: '1159', lastMonth: 28, thisMonth: 28, change: 0, proportion: 0.28 },
];

// Send/Receive TOP10
const sendTop10 = [
  { address: 'ff64', count: 14 },
  { address: 'f699', count: 8 },
  { address: '6698', count: 6 },
  { address: 'db07', count: 5 },
  { address: 'fb2f', count: 4 },
  { address: 'b8ea', count: 3 },
  { address: '3a92', count: 3 },
  { address: 'ed47', count: 3 },
  { address: 'ed4f', count: 3 },
  { address: 'b7d1', count: 3 },
];

const receiveTop10 = [
  { address: 'ff64', count: 17 },
  { address: '24d7', count: 10 },
  { address: 'f699', count: 8 },
  { address: 'a9ec', count: 8 },
  { address: 'f308', count: 6 },
  { address: '6698', count: 4 },
  { address: '45ce', count: 4 },
  { address: '3a92', count: 3 },
  { address: 'b7d1', count: 3 },
  { address: 'ed47', count: 3 },
];

export function Rankings() {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4">
      {/* Top 30 Addresses Table */}
      <div className="bg-white rounded-2xl p-4 shadow-lg">
        <h3 className="text-sm font-semibold mb-3 text-gray-700">{t('rankings.title')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 text-left font-semibold text-gray-600">{t('rankings.rank')}</th>
                <th className="py-2 text-left font-semibold text-gray-600">{t('rankings.address')}</th>
                <th className="py-2 text-right font-semibold text-gray-600">1月</th>
                <th className="py-2 text-right font-semibold text-gray-600">2月</th>
                <th className="py-2 text-center font-semibold text-gray-600">变化</th>
                <th className="py-2 text-right font-semibold text-gray-600">占比</th>
              </tr>
            </thead>
            <tbody>
              {top30Addresses.slice(0, 15).map((item) => (
                <tr key={item.address} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2">{item.rank}</td>
                  <td className="py-2 font-mono font-semibold">
                    <div className="flex items-center gap-1">
                      {item.address}
                      {item.isOfficial && <Star className="w-3 h-3 text-orange-500 fill-orange-500" />}
                      {item.isCreator && <Star className="w-3 h-3 text-blue-500 fill-blue-500" />}
                    </div>
                  </td>
                  <td className="py-2 text-right text-gray-600">{item.lastMonth}</td>
                  <td className="py-2 text-right font-semibold">{item.thisMonth}</td>
                  <td className="py-2 text-center">
                    {item.change !== 0 && (
                      <span className={`inline-flex items-center gap-1 ${item.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(item.change)}
                      </span>
                    )}
                    {item.change === 0 && <span className="text-gray-400">-</span>}
                  </td>
                  <td className="py-2 text-right text-gray-600">{item.proportion}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {top30Addresses.slice(0, 3).map((item) => item.note && (
          <div key={item.address} className="mt-2 text-[10px] text-gray-500 bg-orange-50 p-2 rounded">
            <span className="font-semibold">{item.address}</span>: {item.note}
          </div>
        ))}
      </div>

      {/* Send and Receive TOP10 */}
      <div className="grid grid-cols-2 gap-3">
        {/* Send TOP10 */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Send className="w-4 h-4 text-orange-500" />
            <h3 className="text-xs font-semibold text-gray-700">发送TOP10</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sendTop10} layout="vertical" margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="address" type="category" tick={{ fontSize: 10 }} width={40} />
              <Tooltip />
              <Bar dataKey="count" fill="#fdba74" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Receive TOP10 */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Download className="w-4 h-4 text-green-500" />
            <h3 className="text-xs font-semibold text-gray-700">接收TOP10</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={receiveTop10} layout="vertical" margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="address" type="category" tick={{ fontSize: 10 }} width={40} />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Source */}
      <div className="bg-orange-50 rounded-2xl p-3 text-xs text-gray-600 text-center">
        引用数据报告自 oklink、NFTSCAN、Coingecko 26年2月1日 至 2月28日
        <br />
        幻灵友情制作，仅供参考
      </div>
    </div>
  );
}