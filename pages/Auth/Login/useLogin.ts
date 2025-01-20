/**
 * 1. 로그인 정보를 담는 상태관리 변수 email, password가 있어야 함
 * 2. 로그인 정보의 상태를 담는 상태관리 변수가 있어야 하므로
 *    {password:string, state: error, errorText?:string}
 *     이런 식으로 구성하는게 더 이로움
 * 그렇게 하려면 inputComponet를 더 분리 해서 써야 함
 * 지금 해야될 일이 바로 그거네 inputComponent 리팩토링하고 즉각 적용하기
 */

import { useCallback, useState } from "react";

type validationCondition = | { state: 'PENDING' | 'BEFORE' | 'VALID' } | { state: 'ERROR', errorText: string }

export const useEmailInput = () => {
    const [email, setEmail] = useState('');
    const [emailValidation, setEmailValidation] = useState<validationCondition>({ state: 'BEFORE' })

    const validateEmail = useCallback((email: string) => {
        const emailFormRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailFormRegex.test(email)) {
            setEmailValidation({ state: 'VALID' })
            return;
        }
        setEmailValidation({ state: 'ERROR', errorText: '이메일 형식이 올바르지 않습니다.' })
    }, [])

    return { email, setEmail, setEmailValidation, emailValidation, validateEmail }
}

export const usePasswordInput = () => {

    const [password, setPassword] = useState('');

    const [passwordValidation, setPasswordValidation] = useState<validationCondition>({ state: 'BEFORE' })

    const validatePassword = useCallback((password: string) => {
        const regex: RegExp = /^[A-Za-z\d@$!%*?&]{8,12}$/;
        if (regex.test(password)) {
            setPasswordValidation({ state: 'VALID' })
            return;
        }
        setPasswordValidation({ state: 'ERROR', errorText: '비밀번호는 8~12자 입니다.' })
    }, [])

    return { password, setPassword, setPasswordValidation, passwordValidation, validatePassword }
}


export const useLogin = () => {
    const { email, setEmail, setEmailValidation, emailValidation, validateEmail } = useEmailInput();
    const { password, setPassword, setPasswordValidation, passwordValidation, validatePassword } = usePasswordInput();

    
}