import React from 'react'

import { LongButton } from '@hongpung/src/common';
import { useLogoutButton } from './useLogoutButton';

export const LogoutButton: React.FC = () => {

    const { logoutHandler } = useLogoutButton();

    return (
        <LongButton color='red' innerContent='로그아웃' isAble={true} onPress={logoutHandler} />
    )
}
