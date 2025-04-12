import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { io } from "socket.io-client";
import Toast from "react-native-toast-message";
import { getToken } from "@hongpung/src/common/lib/TokenHandler";
import { Session } from "../types";

const useSessionListSocket = (): Session[] => {
  const socketRef = useRef<any>(null);
  const [sessionList, setSessionList] = useState<Session[] | null>(null);

  const connectSocket = async () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const token = await getToken("token");

    const socket = io(`${process.env.EXPO_PUBLIC_BASE_URL}/reservation`, {
      transports: ["websocket"],
      reconnection: true,
      auth: { token },
    });

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

    socketRef.current = socket;
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === "active") {
      connectSocket();
    } else {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    }
  };

  useEffect(() => {
    connectSocket();
    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      subscription.remove();
    };
  }, []);

  return sessionList ?? [];
};

export default useSessionListSocket;
