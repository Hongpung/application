
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

        const response = await fetch(`${process.env.WEB_API}/verificationCode/verifying`, {
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
        }
    } catch (error) {
        console.error(error)
    } finally {
        clearTimeout(timeoutId);
    }

    return result;
}