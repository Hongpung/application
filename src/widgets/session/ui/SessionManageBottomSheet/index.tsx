import { ErrorModal } from "@hongpung/src/common";
import { ThisSessionState } from "@hongpung/src/entities/session";
import { useCalculateTime } from "@hongpung/src/features/session/useRoom/model/useCalculateTime";
import { useUsingRoomSocket } from "@hongpung/src/features/session/useRoom/socket/useUsingRoomSocket";
import { View, StyleSheet } from "react-native";
import { useRecoilValue } from "recoil";
import { Header } from "./Header";
import { TimeInfo } from "./TimeInfo";
import { ExtendButton } from "./ExtendButton";

interface SessionManageBottomSheetProps {
  toggleBottomSheet: () => void;
  isSlideUp: boolean;
  navigateToUsingManage: () => void;
}

export const SessionManageBottomSheet: React.FC<SessionManageBottomSheetProps> = ({
  toggleBottomSheet,
  isSlideUp,
  navigateToUsingManage,
}) => {
  useUsingRoomSocket();

  const usingSession = useRecoilValue(ThisSessionState);
  const { remainingHour, remainingMinute } = useCalculateTime();

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
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: `rgba(0,0,0,0.8)`,
    flex: 1,
    borderRadius: 15,
    overflow: "hidden",
  },
  infoContainer: {
    flexDirection: "row",
    marginHorizontal: 24,
    justifyContent: "space-between",
  },
}); 