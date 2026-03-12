import { TrendingUp, TrendingDown, Star, Send, Download } from 'lucide-react';
import * as Recharts from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { useEffect, useMemo, useState } from 'react';
import { useAxios } from '../../hooks/useAxios';

const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = Recharts as any;

type Top30Item = {
  rank: number;
  address: string;
  fullAddress: string;
  lastMonth: number;
  thisMonth: number;
  change: number;
  proportion: number;
  note?: string | null;
  isOfficial?: boolean;
  isCreator?: boolean;
};

type TopItem = {
  address: string;
  fullAddress: string;
  count: number;
  isOfficial?: boolean;
  isCreator?: boolean;
};

export function Rankings() {
  const { t } = useLanguage();
  const { http } = useAxios();

  const [top30Addresses, setTop30Addresses] = useState<Top30Item[]>([]);
  const [sendTop10, setSendTop10] = useState<TopItem[]>([]);
  const [receiveTop10, setReceiveTop10] = useState<TopItem[]>([]);
  const [monthLabels, setMonthLabels] = useState<{ lastMonth: string; thisMonth: string }>({
    lastMonth: '上月',
    thisMonth: '本月',
  });

  useEffect(() => {
    let mounted = true;
    http
      .get('/ranking/monthly-holdings')
      .then((res) => {
        const data = res.data;
        if (!mounted) return;
        setTop30Addresses(data?.top30 ?? []);
        setSendTop10(data?.sendTop10 ?? []);
        setReceiveTop10(data?.receiveTop10 ?? []);
        if (data?.monthLabels?.lastMonth && data?.monthLabels?.thisMonth) {
          setMonthLabels({ lastMonth: data.monthLabels.lastMonth, thisMonth: data.monthLabels.thisMonth });
        }
      })
      .catch(() => {
        // 静默失败：保持空数据
      });
    return () => {
      mounted = false;
    };
  }, [http]);

  const topNotes = useMemo(() => top30Addresses.filter((it) => !!it.note), [top30Addresses]);
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
                <th className="py-2 text-right font-semibold text-gray-600">{t('rankings.lastMonth')}</th>
                <th className="py-2 text-right font-semibold text-gray-600">{t('rankings.thisMonth')}</th>
                <th className="py-2 text-center font-semibold text-gray-600">{t('rankings.change')}</th>
                <th className="py-2 text-right font-semibold text-gray-600">{t('rankings.proportion')}</th>
              </tr>
            </thead>
            <tbody>
              {top30Addresses.slice(0, 15).map((item) => (
                <tr key={item.address} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2">{item.rank}</td>
                  <td className="py-2 font-mono font-semibold">
                    <div className="flex items-center gap-1">
                      <span
                        style={
                          item.isOfficial || item.isCreator
                            ? { color: '#ff6900' }
                            : undefined
                        }
                      >
                        {item.address}
                      </span>
                      {item.isOfficial && (
                        <Star className="w-3 h-3" style={{ color: '#ff6900' }} />
                      )}
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
        <div className='flex flex-wrap gap-2'>

          {topNotes.map((item) => (
            <div key={item.fullAddress ?? item.address} className="mt-2 text-[10px] text-gray-500 bg-orange-50 p-2 rounded">
              <span className="font-semibold text-[#ff6900]">{item.address}</span>: {item.note}
            </div>
          ))}
        </div>
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
        引用数据报告自 Polygonscan 以及 OKX Api
        <br />
        Jack-hu 制作，仅供参考
        <br />
      </div>
    </div >
  );
}