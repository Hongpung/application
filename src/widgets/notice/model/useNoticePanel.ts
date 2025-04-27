import { useGetNoticeListFetch } from "../api/noticeWidgetsApi";

export const useNoticePanel = () => {
    const { data, isLoading } = useGetNoticeListFetch();
    console.log(data);
    return {
        noticeList: !!data ? data : null,
        isLoading,
    };
};