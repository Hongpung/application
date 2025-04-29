import { baseApi } from "@hongpung/src/common/api";
import { RequestLoginBody, SignUpRequestBody } from "./type";

const authApi = baseApi.addEndpoints({
  endpoints: (builder) => ({
    changePassword: builder.request<
      { message: string },
      { currentPassword: string; newPassword: string }
    >({
      query: ({ currentPassword, newPassword }) => ({
        url: "/auth/change-password",
        method: "POST",
        options: { headers: { "Content-Type": "application/json" } },
        body: { currentPassword, newPassword },
      }),
    }),
    login: builder.request<{ token: string }, RequestLoginBody>({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
        withAuthorize: false,
        options: {
          headers: {
            "Content-Type": "application/json",
          },
        },
      }),
    }),
    logout: builder.request<void, void>({
      query: () => ({
        method: "POST",
        url: "/auth/logout",
      }),
    }),
    isRegisteredEmail: builder.request<
      { isRegistered: boolean },
      { email: string }
    >({
      query: (email) => ({
        url: "/auth/check-email",
        method: "POST",
        body: email,
        options: {
          headers: {
            "Content-Type": "application/json",
          },
        },
      }),
    }),
    signUp: builder.request<void, SignUpRequestBody>({
      query: (body) => ({ url: "/signup", method: "POST", body }),
    }),

    sendSignUpVerificationCode: builder.request<
      { message: string },
      { email: string }
    >({
      query: (body) => ({
        url: "/verification/send/id",
        method: "POST",
        body,
        options: {
          headers: {
            "Content-Type": "application/json",
          },
        },
      }),
    }),
    verifySignUpVerificationCode: builder.request<
      { isVerified: boolean },
      { email: string; code: string }
    >({
      query: (body) => ({
        url: "/verification/verify/id",
        method: "POST",
        body,
        options: {
          headers: {
            "Content-Type": "application/json",
          },
        },
      }),
    }),
    sendResetPasswordVerificationCode: builder.request<
      { message: string },
      { email: string }
    >({
      query: (body) => ({
        url: "/verification/send/password",
        method: "POST",
        withAuthorize: false,
        options: {
          headers: {
            "Content-Type": "application/json",
          },
        },
        body,
      }),
    }),
    verifyResetPasswordVerificationCode: builder.request<
      { token: string },
      { email: string; code: string }
    >({
      query: (body) => ({
        url: "/verification/verify/password",
        method: "POST",
        body,
        withAuthorize: false,
        options: {
          headers: {
            "Content-Type": "application/json",
          },
        },
      }),
    }),
    resetPassword: builder.request<
      void,
      { email: string; newPassword: string; oneTimeToken: string }
    >({
      query: ({ oneTimeToken, ...body }) => {
        return {
          url: "/auth/resetPW",
          method: "PATCH",
          body,
          withAuthorize: false,
          options: {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${oneTimeToken}`,
            },
          },
        };
      },
    }),
  }),
});

export const {
  useChangePasswordRequest,
  useLoginRequest,
  useLogoutRequest,
  useIsRegisteredEmailRequest,
  useSignUpRequest,
  useSendSignUpVerificationCodeRequest,
  useVerifySignUpVerificationCodeRequest,
  useSendResetPasswordVerificationCodeRequest,
  useVerifyResetPasswordVerificationCodeRequest,
  useResetPasswordRequest,
} = authApi;
