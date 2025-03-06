import { createBaseApi } from "./createApi";

// baseApi 인스턴스 생성
export const baseApi = createBaseApi({ baseUrl: process.env.EXPO_PUBLIC_BASE_URL });

const example = baseApi.addEndpoints({
    endpoints: (build) => ({
        wrongExample: build.query<string, string>({
            query: () => ({
                url: 's'
            })
        }),
        ss: build.request<string, string>({
            recoilState: ssState,
            query: () => ({
                url: '',
                method: 'POST'
            }),
        })
    })
})