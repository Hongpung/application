import { useGetNoticeListFetch } from "../api/noticeWidgetsApi";

export const useNoticePanel = () => {
  const { data, isLoading } = useGetNoticeListFetch();
  return {
    noticeList: data,
    isLoading,
  };
};
