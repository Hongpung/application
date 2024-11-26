import { deleteToken, getToken, saveToken } from "@hongpung/utils/TokenHandler";

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

        const response = await fetch(`${process.env.SUB_API}/verification/verify/password`, {
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
            result = response.status;
            throw Error('Failed to Authorization')
        }

        const { token } = await response.json();
        await saveToken('PWtoken', token)
    } catch (error) {
        console.error(error)
    } finally {
        clearTimeout(timeoutId);
    }

    return result;
}

export const changePassword = async (password: string) => {
    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 6초 타임아웃

    try {
        const token = await getToken('PWtoken')

        const response = await fetch(`${process.env.BASE_URL}/member/password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, password }),
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