import { Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { useEffect, useMemo, useState } from 'react';
import { useTimeRange } from '../contexts/TimeRangeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useActivityHeatmap, useActivityScatter, useActivityTopAndBottom, type IndexTopTime } from '../../services';
import { useAxios } from '../../hooks/useAxios';

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
  const { t, language } = useLanguage();
  const { data: heatmapData, isPending } = useActivityHeatmap();
  const { timeRange } = useTimeRange();
  const backendTime = timeRangeToBackend[timeRange] ?? '7d';
  const { data: scatterData, isPending: isScatterPending } = useActivityScatter(backendTime);
  const { data: topBottomData, isPending: isTopBottomPending } = useActivityTopAndBottom(backendTime);
  const { http } = useAxios();

  const cards = useMemo(
    () => {
      const top = topBottomData?.top;
      const bottom = topBottomData?.bottom;
      return [
        {
          key: 'top1',
          label: t('activity.top1'),
          tokenId: top?.tokenId ?? '',
          priceLabel: typeof top?.price === 'number' ? `${top.price} USD` : isTopBottomPending ? '...' : '-',
        },
        {
          key: 'bottom',
          label: t('activity.bottom'),
          tokenId: bottom?.tokenId ?? '',
          priceLabel: typeof bottom?.price === 'number' ? `${bottom.price} USD` : isTopBottomPending ? '...' : '-',
        },
      ];
    },
    [t, topBottomData, isTopBottomPending],
  );

  const [imageByTokenId, setImageByTokenId] = useState<Record<string, string | null>>({});

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const tokenIds: string[] = [];
      for (const c of cards) {
        if (!c.tokenId) continue;
        if (tokenIds.indexOf(c.tokenId) === -1) tokenIds.push(c.tokenId);
      }
      await Promise.all(
        tokenIds.map(async (tokenId) => {
          try {
            const res = await http.get(`/nft/image/${tokenId}`);
            const imageUrl = (res as { data?: { imageUrl?: string | null } })?.data?.imageUrl ?? null;
            if (!cancelled) {
              setImageByTokenId((prev) => (prev[tokenId] === imageUrl ? prev : { ...prev, [tokenId]: imageUrl }));
            }
          } catch {
            if (!cancelled) {
              setImageByTokenId((prev) => (prev[tokenId] === null ? prev : { ...prev, [tokenId]: null }));
            }
          }
        }),
      );
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [cards, http]);

  const finalScatterData =
    scatterData?.map((item) => ({
      timestampMs: item.timestampMs,
      price: item.price,
    })) ?? [];
  const finalHeatmapData = heatmapData && heatmapData.length > 0 ? heatmapData : defaultHeatmapData;

  const locale = language === 'zh' ? 'zh-CN' : language === 'ja' ? 'ja-JP' : 'en-US';
  const formatTs = (value: number, withSeconds: boolean) => {
    const d = new Date(value);
    const formatter = new Intl.DateTimeFormat(locale, {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: withSeconds ? '2-digit' : undefined,
      hour12: false,
    });
    return formatter.format(d);
  };

  return (
    <div className="space-y-4">

      {/* Transaction Distribution */}
      <div className="bg-white rounded-2xl p-4 shadow-lg">
        <h3 className="text-sm font-semibold mb-3 text-gray-700">{t('activity.transactionDistribution')}</h3>
        <ResponsiveContainer width="100%" height={250}>
          <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="timestampMs"
              type="number"
              tick={{ fontSize: 10 }}
              domain={['auto', 'auto']}
              tickFormatter={(value: number) => formatTs(value, false)}
            />
            <YAxis dataKey="price" tick={{ fontSize: 10 }} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0]?.payload as { timestampMs?: number; price?: number } | undefined;
                const ts = p?.timestampMs;
                const price = p?.price;

                return (
                  <div className="grid min-w-[12rem] gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-xl">
                    <div className="font-medium text-gray-900">{ts ? formatTs(ts, true) : '-'}</div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-500">{t('activity.price')}</span>
                      <span className="font-mono font-medium tabular-nums text-gray-900">
                        {typeof price === 'number' ? price.toLocaleString() : '-'}
                      </span>
                    </div>
                  </div>
                );
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
          {cards.map((card) => {
            const imageUrl = imageByTokenId[card.tokenId];
            return (
              <div key={card.key} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  {typeof imageUrl === 'string' && imageUrl.length > 0 ? (
                    <img src={imageUrl} alt={card.key} className="w-8 h-8 object-cover" />
                  ) : (
                    <Clock className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="font-semibold">
                    {card.label}: {card.tokenId ? `#${card.tokenId}` : isTopBottomPending ? '...' : '#-'}
                  </div>
                  <div className="text-gray-500">{card.priceLabel}</div>
                </div>
              </div>
            );
          })}
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