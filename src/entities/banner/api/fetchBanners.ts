export const bannerApi = {
    /**
     * 공용 api - 토큰 불필요
     */
    loadBanners: {
        method: 'GET',
        url: `${process.env.EXPO_PUBLIC_BASE_URL}/banners/on-post`
    }
};