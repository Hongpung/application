import { getToken, saveToken, deleteToken } from "../lib/TokenHandler";

/**
 * RefreshToken을 사용하여 새로운 AccessToken을 발급받습니다.
 */
export const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const refreshToken = await getToken("refreshToken");
    
    if (!refreshToken) {
      throw new Error("RefreshToken이 없습니다.");
    }

    // RefreshToken으로 새로운 AccessToken 요청
    const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("토큰 갱신에 실패했습니다.");
    }

    const data = await response.json();
    
    // 새로운 토큰들을 저장
    await saveToken("token", data.accessToken);
    if (data.refreshToken) {
      await saveToken("refreshToken", data.refreshToken);
    }

    return true;
  } catch (error) {
    console.error("토큰 갱신 실패:", error);
    // 토큰 갱신 실패 시 로그아웃 처리
    await deleteToken("token");
    await deleteToken("refreshToken");
    return false;
  }
};
