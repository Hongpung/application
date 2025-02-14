import { useRecoilCallback } from "recoil";
import { bannersState } from "../state/useBannerState";
import fetchBanners from "../api/fetchBanners";

export const useFetchBanners = () => {
    return useRecoilCallback(({ set }) => async () => {
        // API 호출 전 PENDING 상태로 전환
        set(bannersState, { status: 'PENDING', value: null });

        try {
            const banners = await fetchBanners();
            // 데이터 성공적으로 로드되면 LOADED 상태로 전환
            set(bannersState, { status: 'LOADED', value: banners });
        } catch (error) {
            console.error('Error fetching banners:', error);
            // 실패 시 FAILED 상태로 전환, 에러 메시지 포함
            set(bannersState, {
                status: 'FAILED',
                value: null,
            });
        }
    });
};


export default useFetchBanners;