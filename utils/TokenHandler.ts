import * as SecureStore from 'expo-secure-store';

// 토큰 저장
export const saveToken = async (key:string, value:string) => {
    await SecureStore.setItemAsync(key, value);
};

// 토큰 가져오기
export const getToken = async (key:string) => {
    return await SecureStore.getItemAsync(key);
};

// 토큰 삭제
export const deleteToken = async (key:string) => {
    await SecureStore.deleteItemAsync(key);
};