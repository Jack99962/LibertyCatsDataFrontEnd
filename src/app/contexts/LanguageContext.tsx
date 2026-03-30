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
    'overview.trendChart': '成交数趋势',
    'overview.insight': '今日结论',
    'overview.insightText': '价格震荡偏强，16:00 为峰值时段，成交额较昨日 +24.4%',
    'overview.holders': '持猫人数',
    'overview.price': '地板价 (USD)',
    'overview.volumeCount': '成交数 (pcs)',
    'overview.totalNumber': "藏品总数",
    'overview.avgTradePrice': '平均成交价格',
    'overview.tradeVolume': '交易额',
    'overview.tradeCount': '成交数量',

    // Activity Page
    'activity.title': '市场活动',
    'activity.heatmap': '24小时交易热力图',
    'activity.hourlyVolume': '小时成交量分布',
    'activity.priceDistribution': '成交价格分布',
    'activity.topTraders': 'Top 交易者',
    'activity.address': '地址',
    'activity.trades': '交易次数',
    'activity.volume.label': '成交量',
    'activity.price': '成交价格',
    'activity.count': '成交数',
    'activity.transactionDistribution': '交易分布',
    'activity.top1': '最高价',
    'activity.bottom': '最低价',
    'activity.scatterLoading': '加载中…',
    'activity.scatterEmpty': '暂无成交数据',
    'activity.scatterEmptyHint': '当前时间范围内没有记录，可尝试切换时间范围',

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
    'holdings.bucketChanges': '持猫党人数变化',
    'holdings.top5Reduction': 'TOP5 总量 减持榜',
    'holdings.top5Increase': 'TOP5 总量 增持榜',
    'holdings.held': '持仓',
    'holdings.bucketDistribution': '持猫党分布',
    'holdings.durationDistribution': '持猫时间分布',
    'holdings.bucket.oneCat': '一猫党',
    'holdings.bucket.twoToThreeCats': '2-3猫党',
    'holdings.bucket.fourToTenCats': '4-10猫党',
    'holdings.bucket.elevenToFiftyCats': '11-50猫党',
    'holdings.bucket.fiftyOneToHundredCats': '51-100猫党',
    'holdings.bucket.moreThanHundredCats': '>100猫党',
    'holdings.duration.gt1Year': '>1Y',
    'holdings.duration.threeMonthsToOneYear': '3M-1Y',
    'holdings.duration.thirtyDaysToThreeMonths': '30-3M',
    'holdings.duration.sevenToThirtyDays': '7-30D',
    'holdings.duration.oneToSevenDays': '1-7D',
    'holdings.duration.lessThan24Hours': '<24H',

    // Rankings Page
    'rankings.title': '地址排名',
    'rankings.byVolume': '按交易额排名',
    'rankings.byTransactions': '按交易次数排名',
    'rankings.rank': '排名',
    'rankings.address': '地址',
    'rankings.lastMonth': '上月',
    'rankings.thisMonth': '本月',
    'rankings.change': '变化',
    'rankings.proportion': '占比',
    'rankings.volume': '交易额',
    'rankings.transactions': '交易次数',
    'rankings.sendTop10': '发送TOP10',
    'rankings.receiveTop10': '接收TOP10',
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
    'overview.totalNumber': 'Total Supply',
    'overview.avgTradePrice': 'Avg Trade Price',
    'overview.tradeVolume': 'Volume',
    'overview.tradeCount': 'Trades',


    // Activity Page
    'activity.title': 'Market Activity',
    'activity.heatmap': '24H Trading Heatmap',
    'activity.hourlyVolume': 'Hourly Volume Distribution',
    'activity.priceDistribution': 'Price Distribution',
    'activity.topTraders': 'Top Traders',
    'activity.address': 'Address',
    'activity.trades': 'Trades',
    'activity.volume.label': 'Volume',
    'activity.price': 'Transaction Price',
    'activity.count': 'Count',
    'activity.transactionDistribution': 'Transaction Distribution',
    'activity.top1': 'Top',
    'activity.bottom': 'Bottom',
    'activity.scatterLoading': 'Loading…',
    'activity.scatterEmpty': 'No transactions yet',
    'activity.scatterEmptyHint': 'No records in this range — try another time range',

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
    'holdings.bucketChanges': 'Holders Change by Bucket',
    'holdings.top5Reduction': 'TOP5 Total Reduction',
    'holdings.top5Increase': 'TOP5 Total Increase',
    'holdings.held': 'Held ',
    'holdings.bucketDistribution': 'Holder Bucket Distribution',
    'holdings.durationDistribution': 'Holding Duration Distribution',
    'holdings.bucket.oneCat': '1 Cat',
    'holdings.bucket.twoToThreeCats': '2-3 Cats',
    'holdings.bucket.fourToTenCats': '4-10 Cats',
    'holdings.bucket.elevenToFiftyCats': '11-50 Cats',
    'holdings.bucket.fiftyOneToHundredCats': '51-100 Cats',
    'holdings.bucket.moreThanHundredCats': '100+ Cats',
    'holdings.duration.gt1Year': '>1Y',
    'holdings.duration.threeMonthsToOneYear': '3M-1Y',
    'holdings.duration.thirtyDaysToThreeMonths': '30D-3M',
    'holdings.duration.sevenToThirtyDays': '7D-30D',
    'holdings.duration.oneToSevenDays': '1D-7D',
    'holdings.duration.lessThan24Hours': '<24H',

    // Rankings Page
    'rankings.title': 'Address Rankings',
    'rankings.byVolume': 'By Volume',
    'rankings.byTransactions': 'By Transactions',
    'rankings.rank': 'Rank',
    'rankings.address': 'Address',
    'rankings.lastMonth': 'Last month',
    'rankings.thisMonth': 'This month',
    'rankings.change': 'Change',
    'rankings.proportion': 'Proportion',
    'rankings.volume': 'Volume',
    'rankings.transactions': 'Transactions',
    'rankings.sendTop10': 'Send TOP10',
    'rankings.receiveTop10': 'Receive TOP10',
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
    'overview.totalNumber': '総発行数',
    'overview.avgTradePrice': '平均取引価格',
    'overview.tradeVolume': '取引高',
    'overview.tradeCount': '取引数',

    // Activity Page
    'activity.title': '市場活動',
    'activity.heatmap': '24時間取引ヒートマップ',
    'activity.hourlyVolume': '時間別取引量分布',
    'activity.priceDistribution': '価格分布',
    'activity.topTraders': 'トップトレーダー',
    'activity.address': 'アドレス',
    'activity.trades': '取引回数',
    'activity.volume.label': '取引量',
    'activity.price': '成約価格',
    'activity.count': '件数',
    'activity.transactionDistribution': '取引分布',
    'activity.top1': '最高値',
    'activity.bottom': '最安値',
    'activity.scatterLoading': '読み込み中…',
    'activity.scatterEmpty': '取引データがありません',
    'activity.scatterEmptyHint': 'この期間に記録がありません。期間を変更してください',

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
    'holdings.bucketChanges': '保有区分別の増減',
    'holdings.top5Reduction': 'TOP5 総量 減少',
    'holdings.top5Increase': 'TOP5 総量 増加',
    'holdings.held': '保有',
    'holdings.bucketDistribution': '保有区分分布',
    'holdings.durationDistribution': '保有期間分布',
    'holdings.bucket.oneCat': '1匹',
    'holdings.bucket.twoToThreeCats': '2-3匹',
    'holdings.bucket.fourToTenCats': '4-10匹',
    'holdings.bucket.elevenToFiftyCats': '11-50匹',
    'holdings.bucket.fiftyOneToHundredCats': '51-100匹',
    'holdings.bucket.moreThanHundredCats': '100匹以上',
    'holdings.duration.gt1Year': '>1Y',
    'holdings.duration.threeMonthsToOneYear': '3M-1Y',
    'holdings.duration.thirtyDaysToThreeMonths': '30日-3M',
    'holdings.duration.sevenToThirtyDays': '7-30日',
    'holdings.duration.oneToSevenDays': '1-7日',
    'holdings.duration.lessThan24Hours': '<24H',

    // Rankings Page
    'rankings.title': 'アドレスランキング',
    'rankings.byVolume': '取引高順',
    'rankings.byTransactions': '取引数順',
    'rankings.rank': 'ランク',
    'rankings.address': 'アドレス',
    'rankings.lastMonth': '先月',
    'rankings.thisMonth': '今月',
    'rankings.change': '変化',
    'rankings.proportion': '割合',
    'rankings.volume': '取引高',
    'rankings.transactions': '取引数',
    'rankings.sendTop10': '送信TOP10',
    'rankings.receiveTop10': '受信TOP10',
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
