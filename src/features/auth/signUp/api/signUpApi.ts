import { baseApi } from "@hongpung/src/common/api";
import { SignUpRequestBody } from "./type";

const signUpApi = baseApi.addEndpoints({
  endpoints: (builder) => ({
    isDuplicatedEmail: builder.request<
      { isRegistered: boolean },
      { email: string }
    >({
      query: (email) => ({
        url: "/auth/check-email",
        method: "POST",
        body: { email },
      }),
    }),
    signUp: builder.request<void, SignUpRequestBody>({
      query: (body) => ({ url: "/signup", method: "POST", body }),
    }),
    sendVerificationCode: builder.request<void, { email: string }>({
      query: (body) => ({
        url: "/auth/send-verification-code",
        method: "POST",
        body,
      }),
    }),
    verifyCode: builder.request<
      { isVerified: boolean },
      { email: string; code: string }
    >({
      query: (body) => ({
        url: "/auth/verify-code",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useSignUpRequest,
  useIsDuplicatedEmailRequest,
  useSendVerificationCodeRequest,
  useVerifyCodeRequest,
} = signUpApi;
