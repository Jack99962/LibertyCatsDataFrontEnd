import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'zh' | 'en' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  zh: {
    // Header
    'app.title': 'Liberty Cats',
    'app.live': '实时',
    
    // Navigation
    'nav.overview': '总览',
    'nav.activity': '市场',
    'nav.holdings': '持仓',
    'nav.rankings': '地址',
    
    // Time Range
    'time.24h': '24H',
    'time.7d': '7D',
    'time.30d': '30D',
    
    // Overview Page
    'overview.floorPrice': '地板价 (USD)',
    'overview.volume': '成交额',
    'overview.transactions': '成交笔数',
    'overview.listed': '当前上架数',
    'overview.trendChart': '地板价与成交数趋势',
    'overview.insight': '今日结论',
    'overview.insightText': '价格震荡偏强，16:00 为峰值时段，成交额较昨日 +24.4%',
    'overview.holders': '持猫人数',
    'overview.price': '地板价 (USD)',
    'overview.volumeCount': '成交数 (pcs)',
    
    // Activity Page
    'activity.title': '市场活动',
    'activity.heatmap': '24小时交易热力图',
    'activity.hourlyVolume': '小时成交量分布',
    'activity.priceDistribution': '成交价格分布',
    'activity.topTraders': 'Top 交易者',
    'activity.address': '地址',
    'activity.trades': '交易次数',
    'activity.volume.label': '成交量',
    'activity.price': '价格区间',
    'activity.count': '成交数',
    
    // Holdings Page
    'holdings.title': '持仓分析',
    'holdings.totalHolders': '总持有人数',
    'holdings.avgHolding': '平均持有量',
    'holdings.trend': '持有人数趋势',
    'holdings.distribution': '持仓分布',
    'holdings.whales': '巨鲸 (100+)',
    'holdings.large': '大户 (50-99)',
    'holdings.medium': '中户 (10-49)',
    'holdings.small': '散户 (1-9)',
    'holdings.topHolders': 'Top 持有者',
    'holdings.cats': '只猫',
    
    // Rankings Page
    'rankings.title': '地址排名',
    'rankings.byVolume': '按交易额排名',
    'rankings.byTransactions': '按交易次数排名',
    'rankings.rank': '排名',
    'rankings.address': '地址',
    'rankings.volume': '交易额',
    'rankings.transactions': '交易次数',
  },
  en: {
    // Header
    'app.title': 'Liberty Cats',
    'app.live': 'Live',
    
    // Navigation
    'nav.overview': 'Overview',
    'nav.activity': 'Activity',
    'nav.holdings': 'Holdings',
    'nav.rankings': 'Rankings',
    
    // Time Range
    'time.24h': '24H',
    'time.7d': '7D',
    'time.30d': '30D',
    
    // Overview Page
    'overview.floorPrice': 'Floor Price (USD)',
    'overview.volume': 'Volume',
    'overview.transactions': 'Transactions',
    'overview.listed': 'Listed',
    'overview.trendChart': 'Price & Volume Trend',
    'overview.insight': 'Today\'s Insight',
    'overview.insightText': 'Price fluctuates strongly, peak at 16:00, volume +24.4% vs yesterday',
    'overview.holders': 'Cat Holders',
    'overview.price': 'Floor Price (USD)',
    'overview.volumeCount': 'Volume (pcs)',
    
    // Activity Page
    'activity.title': 'Market Activity',
    'activity.heatmap': '24H Trading Heatmap',
    'activity.hourlyVolume': 'Hourly Volume Distribution',
    'activity.priceDistribution': 'Price Distribution',
    'activity.topTraders': 'Top Traders',
    'activity.address': 'Address',
    'activity.trades': 'Trades',
    'activity.volume.label': 'Volume',
    'activity.price': 'Price Range',
    'activity.count': 'Count',
    
    // Holdings Page
    'holdings.title': 'Holdings Analysis',
    'holdings.totalHolders': 'Total Holders',
    'holdings.avgHolding': 'Avg Holdings',
    'holdings.trend': 'Holders Trend',
    'holdings.distribution': 'Holdings Distribution',
    'holdings.whales': 'Whales (100+)',
    'holdings.large': 'Large (50-99)',
    'holdings.medium': 'Medium (10-49)',
    'holdings.small': 'Small (1-9)',
    'holdings.topHolders': 'Top Holders',
    'holdings.cats': 'Cats',
    
    // Rankings Page
    'rankings.title': 'Address Rankings',
    'rankings.byVolume': 'By Volume',
    'rankings.byTransactions': 'By Transactions',
    'rankings.rank': 'Rank',
    'rankings.address': 'Address',
    'rankings.volume': 'Volume',
    'rankings.transactions': 'Transactions',
  },
  ja: {
    // Header
    'app.title': 'Liberty Cats',
    'app.live': 'ライブ',
    
    // Navigation
    'nav.overview': '概要',
    'nav.activity': '市場',
    'nav.holdings': '保有',
    'nav.rankings': 'ランキング',
    
    // Time Range
    'time.24h': '24H',
    'time.7d': '7D',
    'time.30d': '30D',
    
    // Overview Page
    'overview.floorPrice': 'フロア価格 (USD)',
    'overview.volume': '取引高',
    'overview.transactions': '取引数',
    'overview.listed': '出品数',
    'overview.trendChart': '価格と取引量のトレンド',
    'overview.insight': '今日のインサイト',
    'overview.insightText': '価格は強く変動し、16:00にピーク、取引高は昨日比+24.4%',
    'overview.holders': 'ホルダー数',
    'overview.price': 'フロア価格 (USD)',
    'overview.volumeCount': '取引量 (個)',
    
    // Activity Page
    'activity.title': '市場活動',
    'activity.heatmap': '24時間取引ヒートマップ',
    'activity.hourlyVolume': '時間別取引量分布',
    'activity.priceDistribution': '価格分布',
    'activity.topTraders': 'トップトレーダー',
    'activity.address': 'アドレス',
    'activity.trades': '取引回数',
    'activity.volume.label': '取引量',
    'activity.price': '価格帯',
    'activity.count': '件数',
    
    // Holdings Page
    'holdings.title': '保有分析',
    'holdings.totalHolders': '総保有者数',
    'holdings.avgHolding': '平均保有量',
    'holdings.trend': '保有者数トレンド',
    'holdings.distribution': '保有分布',
    'holdings.whales': 'クジラ (100+)',
    'holdings.large': '大口 (50-99)',
    'holdings.medium': '中口 (10-49)',
    'holdings.small': '小口 (1-9)',
    'holdings.topHolders': 'トップホルダー',
    'holdings.cats': '匹',
    
    // Rankings Page
    'rankings.title': 'アドレスランキング',
    'rankings.byVolume': '取引高順',
    'rankings.byTransactions': '取引数順',
    'rankings.rank': 'ランク',
    'rankings.address': 'アドレス',
    'rankings.volume': '取引高',
    'rankings.transactions': '取引数',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
