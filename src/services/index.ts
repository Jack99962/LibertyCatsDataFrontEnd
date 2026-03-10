import { useQuery } from "@tanstack/react-query"
import { useAxios } from "../hooks/useAxios"

export type IndexTopTime = '1d' | '7d' | '30d' | 'all';

export interface IndexTopData {
    detail: Record<string, unknown>;
    volume: number;
    transactions: number;
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