import { ErrorModal } from "@hongpung/src/common";
import { ThisSessionState } from "@hongpung/src/entities/session";
import { useCalculateTime } from "@hongpung/src/features/session/useRoom/model/useCalculateTime";
import { useUsingRoomSocket } from "@hongpung/src/features/session/useRoom/socket/useUsingRoomSocket";
import { View, StyleSheet, Animated } from "react-native";
import { useAtomValue } from "jotai";
import { Header } from "./Header";
import { TimeInfo } from "./TimeInfo";
import { ExtendButton } from "./ExtendButton";
import { useEffect, useRef } from "react";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
interface SessionManageBottomSheetProps {
  toggleBottomSheet: () => void;
  isSlideUp: boolean;
  navigateToUsingManage: () => void;
}

export const SessionManageBottomSheet: React.FC<
  SessionManageBottomSheetProps
> = ({ toggleBottomSheet, isSlideUp, navigateToUsingManage }) => {
  useUsingRoomSocket();
  const BottomSheetHeight = useBottomTabBarHeight();

  const usingSession = useAtomValue(ThisSessionState);
  const { remainingHour, remainingMinute } = useCalculateTime();

  const bottomAnim = useRef(new Animated.Value(0)).current;

  const moveUp = () => {
    Animated.timing(bottomAnim, {
      toValue: -50+BottomSheetHeight, // 이동하고자 하는 bottom 값
      duration: 300, // 애니메이션 시간 (ms)
      useNativeDriver: false, // layout 관련 속성은 false
    }).start();
  };

  const moveDown = () => {
    Animated.timing(bottomAnim, {
      toValue: -140+BottomSheetHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (isSlideUp) {
      moveUp();
    } else {
      moveDown();
    }
  }, [isSlideUp]);
  if (!usingSession)
    return (
      <ErrorModal
        visible={true}
        title={"세션 종료"}
        message={"세션이 존재하지 않아요."}
        onConfirm={() => {}}
      />
    );

  return (
    <Animated.View
      style={[
        styles.container,
        { bottom: bottomAnim },
      ]}
    >
      <Header isSlideUp={isSlideUp} toggleBottomSheet={toggleBottomSheet} />
      <View style={styles.infoContainer}>
        <TimeInfo
          startTime={usingSession.startTime}
          endTime={usingSession.endTime}
          remainingHour={remainingHour}
          remainingMinute={remainingMinute}
        />
        <ExtendButton navigateToUsingManage={navigateToUsingManage} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    backgroundColor: `rgba(0,0,0,0.8)`,
    flex: 1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: "hidden",
    paddingBottom: 50,
  },
  infoContainer: {
    flexDirection: "row",
    marginHorizontal: 24,
    paddingVertical: 16,
    justifyContent: "space-between",
  },
});
