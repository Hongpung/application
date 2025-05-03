import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackActions } from "@react-navigation/native";
import { useAtomValue, useAtom } from "jotai";
import { UserStatusState } from "@hongpung/src/entities/member";
import { UseRoomState } from "@hongpung/src/entities/session";
import { CheckInAttendStatus, CheckInStartStatus } from "@hongpung/src/features/session/checkInRoom/model/type";
import {
    useCheckInPossibilityFetch,
    useStartSessionRequest,
    useAttendSessionRequest,
} from "@hongpung/src/features/session/checkInRoom/api/checkInApi";
import { Alert } from "react-native";

export const useCheckIn = () => {
    const navigation = useNavigation();

    const loginUser = useAtomValue(UserStatusState);
    const [usingRoom,setUseRoom] = useAtom(UseRoomState);
    const [isCheckin, setIsCheckin] = useState(false);

    const [checkinStatus, setCheckinStatus] = useState<CheckInAttendStatus | CheckInStartStatus | null>(null);
    const [participationAvailable, setParticipationAvailable] = useState(false);

    const { data: sessionData, isLoading } = useCheckInPossibilityFetch();
    const { request: startSession } = useStartSessionRequest();
    const { request: attendSession } = useAttendSessionRequest();

    const handleStartSession = async () => {
        try {
            if (!loginUser) throw new Error("유저 정보가 없습니다.");

            const response = await startSession({ participationAvailable });
            if (response === 'failed') throw new Error("연습 시작에 실패했습니다.");
            setCheckinStatus(response);
            setIsCheckin(true);

            if (response) {
                setUseRoom(true);
            }
        } catch (e) {
            if (e instanceof Error) {
                Alert.alert('오류', e.message);
            } else {
                Alert.alert('오류', '알 수 없는 오류가 발생했습니다.');
            }
        }
    };

    const handleAttendSession = async () => {
        try {
            if (!loginUser) throw new Error("유저 정보가 없습니다.");

            const response = await attendSession();
            setCheckinStatus(response);
            setIsCheckin(true);

            if (response) {
                setUseRoom(true);
            }
        } catch (e) {
            if (e instanceof Error) {
                Alert.alert('오류', e.message);
            } else {
                Alert.alert('오류', '알 수 없는 오류가 발생했습니다.');
            }
        }
    };

    const handleConfirm = () => {
        navigation.dispatch(StackActions.replace("HomeStack"));
    };
    
    return {
        usingRoom,
        isCheckin,
        checkinStatus,
        participationAvailable,
        setParticipationAvailable,
        sessionData,
        isLoading,
        handleStartSession,
        handleAttendSession,
        handleConfirm,
    };
}; 