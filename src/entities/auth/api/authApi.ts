import { baseApi } from "@hongpung/src/common";
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
      queryOptions: {
        mutationKey: ["changePassword"],
      },
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
      queryOptions: {
        mutationKey: ["user-status", "token"],
      },
    }),

    logout: builder.request<void, void>({
      query: () => ({
        method: "POST",
        url: "/auth/logout",
      }),
      queryOptions: {
        mutationKey: ["user-status", "token"],
      },
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
      queryOptions: {
        mutationKey: ["isRegisteredEmail"],
      },
    }),

    signUp: builder.request<void, SignUpRequestBody>({
      query: (body) => ({
        url: "/auth/signup",
        method: "POST",
        body,
        options: {
          headers: {
            "Content-Type": "application/json",
          },
        },
      }),
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
      queryOptions: {
        mutationKey: ["sendSignUpVerificationCode"],
      },
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
      queryOptions: {
        mutationKey: ["verifySignUpVerificationCode"],
      },
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
      queryOptions: {
        mutationKey: ["sendResetPasswordVerificationCode"],
      },
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
      queryOptions: {
        mutationKey: ["verifyResetPasswordVerificationCode"],
      },
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
      queryOptions: {
        mutationKey: ["resetPassword"],
      },
    }),

    withdraw: builder.request<void, { password: string }>({
      query: (body) => ({
        url: "/auth/withdraw",
        method: "POST",
        body,
        options: {
          headers: {
            "Content-Type": "application/json",
          },
        },
        withAuthorize: true,
      }),
      queryOptions: {
        mutationKey: ["withdraw"],
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
  useWithdrawRequest,
} = authApi;
