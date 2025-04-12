import { useRef, useState } from "react";

import { StackActions, useNavigation } from "@react-navigation/native";
import { useSetRecoilState } from "recoil";

import { io } from "socket.io-client";
import Toast from "react-native-toast-message";

import { getToken } from "@hongpung/src/common";

import { Session } from "../../../entities/session/model/type";
import { UseRoomState } from "../../../entities/session/model/UseRoomState";
import { ThisSessionState } from "../../../entities/session/model/ThisSessionState";


export const useUsingRoomSocket = () => {

    const socketRef = useRef<any>(null); // 소켓 참조를 저장할 useRef
    
    const navigation = useNavigation();

    const setSessionState = useSetRecoilState(ThisSessionState)
    const setUseRoom = useSetRecoilState(UseRoomState)

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

        socket.on('currentSession', (data) => {
            const currentSession = JSON.parse(data)
            setSessionState(currentSession)
        })

        socket.on('fetchSessionUpdate', (data) => {

            console.log('fetchSessionUpdate')
            const changedSession = JSON.parse(data)
            setSessionState(changedSession)

        })

        socket.on('sessionEnded', () => {
            console.log('sessionEnded');
            setUseRoom(false);
            setSessionState(null);
        })

        socket.on('forceEnded', () => {
            alert('세션 강제 종료');
            setUseRoom(false);
            setSessionState(null);
        })

        socket.on('connect_error', (error) => {
            console.log(error.name)
            Toast.show({
                type: 'error',
                text1: error.message,
                position: 'bottom',
                bottomOffset: 60,
                visibilityTime: 3000,
            });
        });


        socket.on('invalid-user', () => {
            alert('권한이 없습니다.')
            navigation.dispatch(StackActions.replace('HomeStack'))
            socket.disconnect()
            setUseRoom(false)
        });

        socket.on('disconnect', (reason) => {
            console.log('Disconnected:', reason);
        });

        socketRef.current = socket; // 소켓 참조 업데이트
    };

    return { connectSocket, socketRef }

}