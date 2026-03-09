import { useQuery } from "@tanstack/react-query"
import { useAxios } from "../hooks/useAxios"

/** 查询集合详情*/
export const useCollectionDetail = (time: '1d' | '7d' | '30d' | 'all' = '1d') => {
    const { http } = useAxios();

    return useQuery({
        queryKey: ['getCollectionDetail', time],
        queryFn: async () => {
            // 确保 http 返回的是数据，或者是等待它请求完成
            return await http({
                url: '/index/getIndexTop/7d'
            });
        }
    });
}