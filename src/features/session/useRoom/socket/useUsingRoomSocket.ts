import { useEffect, useRef } from "react";
import { Alert, AppState, AppStateStatus } from "react-native";

import { useAtom } from "jotai";
import { StackActions, useNavigation } from "@react-navigation/native";

import Toast from "react-native-toast-message";
import { io } from "socket.io-client";

import { getToken } from "@hongpung/src/common";

import { UseRoomState, ThisSessionState } from "@hongpung/src/entities/session";
import { Session } from "@hongpung/src/entities/session";


export const useUsingRoomSocket = () => {

    const socketRef = useRef<any>(null); // 소켓 참조를 저장할 useRef

    const navigation = useNavigation();

    const [sessionState, setSessionState] = useAtom(ThisSessionState)
    const [isUseRoom, setUseRoom] = useAtom(UseRoomState)

    const connectSocket = async () => {
        if (socketRef.current) {
            socketRef.current.disconnect(); // 기존 소켓 연결 해제
        }
        const token = await getToken('token')
        console.log(token)
        const socket = io(`${process.env.EXPO_PUBLIC_BASE_URL}/roomsession`, {
            transports: ['websocket'],
            auth: { token },
            reconnection: true,
        });

        socket.on('connect', () => {
            console.log('Connected to WebSocket Gateway');
            socket.emit('fetchCurrentSession');
        });

        socket.on('currentSession', handleCurrentSession);
        socket.on('fetchSessionUpdate', handleFetchSessionUpdate);
        socket.on('sessionEnded', handleSessionEnded);
        socket.on('forceEnded', handleForceEnded);
        socket.on('connect_error', handleConnectError);
        socket.on('invalid-user', handleInvalidUser);
        socket.on('disconnect', (reason) => {
            console.log('Disconnected:', reason);
        });

        socketRef.current = socket; // 소켓 참조 업데이트
    };

    const handleCurrentSession = (data: string) => {
        const currentSession = JSON.parse(data) as Session
        setSessionState(currentSession)
    }

    const handleFetchSessionUpdate = (data: string) => {
        console.log('fetchSessionUpdate')
        const changedSession = JSON.parse(data) as Session
        setSessionState(changedSession)
    }

    const handleSessionEnded = () => {
        console.log('sessionEnded');
        setUseRoom(false);
        setSessionState(null);
    }

    const handleForceEnded = () => {
        Alert.alert('세션 강제 종료');
        setUseRoom(false);
        setSessionState(null);
    }

    const handleConnectError = (error: any) => {
        console.log(error.name);
        Toast.show({
            type: 'error',
            text1: "서버에 연결할 수 없습니다.",
            position: 'bottom',
            bottomOffset: 60,
            visibilityTime: 3000,
        });
    }

    const handleInvalidUser = () => {
        Alert.alert('권한이 없습니다.');
        navigation.dispatch(StackActions.replace('HomeStack'));
        socketRef.current?.disconnect();
        setUseRoom(false);
        setSessionState(null);
    }

    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (nextAppState === "active") {
                console.log("App is active");
                connectSocket(); // 페이지 활성화 시 소켓 재연결
            } else {
                console.log("App is not active");
                if (socketRef.current) {
                    socketRef.current.disconnect(); // 페이지 비활성화 시 소켓 해제
                }
            }
        };

        if (isUseRoom && !socketRef.current)
            connectSocket();

        const subscription = AppState.addEventListener(
            "change",
            handleAppStateChange
        );

        return () => {
            // 컴포넌트 언마운트 시 소켓 해제 및 이벤트 리스너 제거
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            subscription.remove();
        };
    }, [isUseRoom]);


    return { connectSocket, socketRef, sessionState, isUseRoom }

}