import { deleteToken, getToken, saveToken } from "@hongpung/src/common/utils/TokenHandler";

export const vaildatePassword = (password: string) => {
    const regex: RegExp = /^[A-Za-z\d@$!%*?&]{8,12}$/;
    const newCondition = regex.test(password);
    console.log(password, newCondition)
    return newCondition;
}

export const verifyingEmail = async (email: string, code: string) => {
    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 6초 타임아웃

    let result = 500;

    try {

        console.log(`${process.env.EXPO_PUBLIC_BASE_URL}/verification/verify/password`, JSON.stringify({ email, code }))
        const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/verification/verify/password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, code }),
            signal
        });


        if (response.ok) {
            result = response.status;
        } else {
            console.error('서버에서 데이터 가져오기 실패: ', response.status);
            const { message } = await response.json();
            throw Error('Failed to Authorization: ' + message)
        }

        const data = await response.json();
        console.log(data)
        const { token } = await data;
        await saveToken('PWtoken', token)
    } catch (error) {
        console.error(error)
    } finally {
        clearTimeout(timeoutId);
    }

    return result;
}

export const changePassword = async (newPassword: string) => {
    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 6초 타임아웃


    try {
        const token = await getToken('PWtoken')
        console.log(token, JSON.stringify({ newPassword }))
        const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/auth/resetPW`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ newPassword }),
            signal
        });


        if (!response.ok) {
            throw Error('Failed to Change Password')
        }

        await deleteToken('PWtoken')

        return true;
    } catch (error) {
        console.error(error)
        return false
    } finally {
        clearTimeout(timeoutId);
    }
}