import { useEffect, useRef, useState } from "react";
import { Session } from "@hongpung/src/entities/session/model/type";
import { getToken } from "@hongpung/src/common";
import { io, Socket } from "socket.io-client";
import Toast from "react-native-toast-message";
import { useIsFocused } from "@react-navigation/native";

export const useSessionListSocket = () => {
  const socketRef = useRef<any>(null); // 소켓 참조를 저장할 useRef
  const [sessionList, setSessionList] = useState<Session[] | null>(null);
  const isFocused = useIsFocused();

  const connectSocket = async () => {
    if (socketRef.current) {
      socketRef.current.disconnect(); // 기존 소켓 연결 해제
    }

    const token = await getToken("token");
    console.log("token", token);
    const socket = io(`${process.env.EXPO_PUBLIC_BASE_URL}/reservation`, {
      transports: ["websocket"],
      reconnection: true,
      auth: { token },
    });

    setupSocketHandlers(socket); // 소켓 이벤트 핸들러 설정
    socketRef.current = socket; // 소켓 참조 업데이트
  };

  const setupSocketHandlers = (socket: Socket) => {
    socket.on("connect", () => {
      console.log("세션 리스트 연결됨");
    });

    socket.on("reservationsFetched", (data) => {
      const loadSessionList = JSON.parse(data) as Session[];
      console.log("Session-List Updated:", loadSessionList);
      setSessionList(loadSessionList);
    });

    socket.on("connect_error", (error) => {
      Toast.show({
        type: "error",
        text1: error.message,
        position: "bottom",
        bottomOffset: 60,
        visibilityTime: 3000,
      });
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
    });
  };

  useEffect(() => {
    if (isFocused) {
      connectSocket();
    }

    return () => {
      if (socketRef.current && !isFocused) {
        socketRef.current.disconnect();
      }
    };
  }, [isFocused]);

  return { sessionList, connectSocket, socketRef };
};
