import { useQuery } from "@tanstack/react-query"
import { useAxios } from "../hooks/useAxios"

/** * 修改点：将 getCollectionDetail 改名为 useCollectionDetail
 * 这样它就是一个标准的自定义 Hook 了
 */
export const useCollectionDetail = () => {
    const { http } = useAxios();

    return useQuery({
        queryKey: ['getCollectionDetail'],
        queryFn: async () => {
            // 确保 http 返回的是数据，或者是等待它请求完成
            const response = await http({
                url: '/index/getCollectionDetail'
            });
            return response;
        }
    });
}