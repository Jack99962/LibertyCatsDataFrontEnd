import { useQuery } from "@tanstack/react-query"
import { useAxios } from "../hooks/useAxios"

export type IndexTopTime = '1d' | '7d' | '30d' | 'all';

export interface IndexTopData {
    detail: Record<string, unknown>;
    volume: number;
    transactions: number;
    totalCount: number
}

export interface IndexTrendPoint {
    index: number;
    x: number;
    label: string;
    startTimeMs: number;
    endTimeMs: number;
    price: number | null;
    avgPrice: number | null;
    volume: number;
    count: number;
}

export interface IndexTrendData {
    time: IndexTopTime;
    points: IndexTrendPoint[];
}

export interface ActivityHeatmapPoint {
    hour: string;
    count: number;
}

export interface ActivityScatterPoint {
    /** 成交时间（毫秒时间戳） */
    timestampMs: number;
    /** 成交价格 */
    price: number;
}

export interface HolderTrendPoint {
    index: number;
    label: string;
    startTimeMs: number;
    endTimeMs: number;
    holders: number;
}

export interface HolderTrendData {
    points: HolderTrendPoint[];
}

export interface HoldingChangeItem {
    address: string;
    change: number;
    held: number;
}

export interface HoldingsTopChangeData {
    time: IndexTopTime;
    topIncrease: HoldingChangeItem[];
    topReduction: HoldingChangeItem[];
}

export interface HoldingBucketChangeBuckets {
    oneCat: number;
    twoToThreeCats: number;
    fourToTenCats: number;
    elevenToFiftyCats: number;
    fiftyOneToHundredCats: number;
    moreThanHundredCats: number;
}

export interface HoldingBucketChangeData {
    time: IndexTopTime;
    buckets: HoldingBucketChangeBuckets;
}

export interface HoldingBucketDistributionData {
  totalHolders: number;
  buckets: HoldingBucketChangeBuckets;
}

/** 持猫时间分布：各时长区间的数量（百分比由前端可自行计算） */
export interface HoldingDurationBucket {
  count: number;
  /** @deprecated 后端可不返回；前端用 count/totalTokens 计算 */
  percentage?: number;
}

export interface HoldingDurationDistributionData {
  totalTokens: number;
  buckets: {
    gt1Year: HoldingDurationBucket;
    threeMonthsToOneYear: HoldingDurationBucket;
    thirtyDaysToThreeMonths: HoldingDurationBucket;
    sevenToThirtyDays: HoldingDurationBucket;
    oneToSevenDays: HoldingDurationBucket;
    lessThan24Hours: HoldingDurationBucket;
  };
}

/** 当前总持有人数 */
export const useCurrentHoldersCount = () => {
    const { http } = useAxios();

    return useQuery<number>({
        queryKey: ['getCurrentHoldersCount'],
        queryFn: async () => {
            const res = await http({ url: '/holdings/holders-count' });
            return (res as { data: number }).data;
        },
    });
}

/** 平均持有量 */
export const useAverageHolding = () => {
    const { http } = useAxios();

    return useQuery<number>({
        queryKey: ['getAverageHolding'],
        queryFn: async () => {
            const res = await http({ url: '/holdings/avg-holding' });
            return (res as { data: number }).data;
        },
    });
}

/** 首页面板数据（集合详情 + 成交量 + 成交笔数），time 动态参数 */
export const useIndexTop = (time: IndexTopTime) => {
    const { http } = useAxios();

    return useQuery<IndexTopData>({
        queryKey: ['getIndexTop', time],
        queryFn: async () => {
            const res = await http({ url: `/index/getIndexTop/${time}` });
            return (res as { data: IndexTopData }).data;
        },
    });
}

/** 地板价与成交趋势（用于 Overview 折线图） */
export const useIndexTrend = (time: IndexTopTime) => {
    const { http } = useAxios();

    return useQuery<IndexTrendData>({
        queryKey: ['getFloorAndVolumeTrend', time],
        queryFn: async () => {
            const res = await http({ url: `/index/getFloorAndVolumeTrend/${time}` });
            return (res as { data: IndexTrendData }).data;
        },
    });
}

/** 持有人数趋势（全量，4 个时间段） */
export const useHolderTrend = () => {
    const { http } = useAxios();

    return useQuery<HolderTrendData>({
        queryKey: ['getHolderTrend'],
        queryFn: async () => {
            const res = await http({ url: '/index/getHolderTrend' });
            return (res as { data: HolderTrendData }).data;
        },
    });
}

/** Top5 总量增/减持榜（按时间维度） */
export const useHoldingsTopChange = (time: IndexTopTime) => {
    const { http } = useAxios();

    return useQuery<HoldingsTopChangeData>({
        queryKey: ['getHoldingsTopChange', time],
        queryFn: async () => {
            const res = await http({ url: `/holdings/top-change/${time}` });
            return (res as { data: HoldingsTopChangeData }).data;
        },
    });
}

/** 按持仓桶统计持猫党人数变化（同 Overview 时间维度） */
export const useHoldingBucketChange = (time: IndexTopTime) => {
    const { http } = useAxios();

    return useQuery<HoldingBucketChangeData>({
        queryKey: ['getHoldingBucketChange', time],
        queryFn: async () => {
            const res = await http({ url: `/holdings/bucket-change/${time}` });
            return (res as { data: HoldingBucketChangeData }).data;
        },
    });
}

/** 当前各持仓桶持猫党分布（用于 Holdings 环形图） */
export const useHoldingBucketDistribution = () => {
  const { http } = useAxios();

  return useQuery<HoldingBucketDistributionData>({
    queryKey: ['getHoldingBucketDistribution'],
    queryFn: async () => {
      const res = await http({ url: '/holdings/bucket-distribution' });
      return (res as { data: HoldingBucketDistributionData }).data;
    },
  });
}

/** 持猫时间分布（用于持猫时间分布圆环图） */
export const useHoldingDurationDistribution = () => {
  const { http } = useAxios();

  return useQuery<HoldingDurationDistributionData>({
    queryKey: ['getHoldingDurationDistribution'],
    queryFn: async () => {
      const res = await http({ url: '/holdings/duration-distribution' });
      return (res as { data: HoldingDurationDistributionData }).data;
    },
  });
}

/** 24 小时交易热力图 */
export const useActivityHeatmap = () => {
    const { http } = useAxios();

    return useQuery<ActivityHeatmapPoint[]>({
        queryKey: ['get24HHeatmap'],
        queryFn: async () => {
            const res = await http({ url: '/activity/get24HHeatmap' });
            return (res as { data: ActivityHeatmapPoint[] }).data;
        },
    });
}

/** 成交散点图（Activity 页面） */
export const useActivityScatter = (time: IndexTopTime) => {
    const { http } = useAxios();

    return useQuery<ActivityScatterPoint[]>({
        queryKey: ['getTransactionScatter', time],
        queryFn: async () => {
            const res = await http({ url: `/activity/getTransactionScatter/${time}` });
            return (res as { data: ActivityScatterPoint[] }).data;
        },
    });
}

/** 查询集合详情（仅详情，无时间维度）*/
export const useCollectionDetail = () => {
    const { http } = useAxios();

    return useQuery({
        queryKey: ['getCollectionDetail'],
        queryFn: async () => {
            return await http({ url: '/index/getCollectionDetail' });
        },
    });
}