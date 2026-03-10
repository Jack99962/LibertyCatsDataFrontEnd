import { useQuery } from "@tanstack/react-query"
import { useAxios } from "../hooks/useAxios"

export type IndexTopTime = '1d' | '7d' | '30d' | 'all';

export interface IndexTopData {
    detail: Record<string, unknown>;
    volume: number;
    transactions: number;
}

/** 首页面板数据（集合详情 + 成交量 + 成交笔数），time 动态参数 */
export const useIndexTop = (time: IndexTopTime) => {
    const { http } = useAxios();

    return useQuery({
        queryKey: ['getIndexTop', time],
        queryFn: async (): Promise<IndexTopData> => {
            const res = await http({ url: `/index/getIndexTop/${time}` });
            return (res as { data: IndexTopData }).data;
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