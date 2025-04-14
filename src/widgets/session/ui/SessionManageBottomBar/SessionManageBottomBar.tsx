import { Color } from "@hongpung/ColorSet";
import { Icons, ErrorModal } from "@hongpung/src/common";
import { ThisSessionState } from "@hongpung/src/entities/session";
import { useCalculateTime } from "@hongpung/src/features/session/useRoom/model/useCalculateTime";
import { useUsingRoomSocket } from "@hongpung/src/features/session/useRoom/socket/useUsingRoomSocket";
import { SessionTimer } from "@hongpung/src/features/session/useRoom/ui/SessionTimer/SessionTimer";
import { debounce } from "lodash";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { useRecoilValue } from "recoil";

interface SessionManageBottomBarProps {
  toggleBottomSheet: () => void;
  isSlideUp: boolean;
}

export const SessionManageBottomBar: React.FC<
  SessionManageBottomBarProps & MainStackProps<"Home">
> = ({ toggleBottomSheet, isSlideUp, navigation }) => {
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
      <Pressable style={styles.toggleButton} onPress={toggleBottomSheet}>
        <Icons
          name={isSlideUp ? "chevron-down" : "chevron-up"}
          color={"#FFF"}
          size={24}
        />
      </Pressable>
      <View style={styles.infoContainer}>
        <View style={styles.timeInfo}>
          <Text style={styles.timeLabel}>남은 예약 시간</Text>
          <Text style={styles.timeRange}>
            ({usingSession.startTime}~{usingSession.endTime})
          </Text>
        </View>
        <SessionTimer
          remainingHour={remainingHour}
          remainingMinute={remainingMinute}
        />
        <Pressable
          style={styles.extendButton}
          onPress={debounce(() => navigation.push("UsingManage"), 1000, {
            leading: true,
            trailing: false,
          })}
        >
          <Text style={styles.extendButtonText}>연장/종료</Text>
        </Pressable>
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
  toggleButton: {
    display: "flex",
    alignItems: "center",
    marginTop: 8,
    justifyContent: "center",
  },
  infoContainer: {
    flexDirection: "row",
    marginHorizontal: 24,
    justifyContent: "space-between",
  },
  timeInfo: {
    justifyContent: "center",
    height: 64,
    alignItems: "center",
    gap: 4,
  },
  timeLabel: {
    fontFamily: "NanumSquareNeo-Bold",
    color: "#FFF",
    fontSize: 14,
  },
  timeRange: {
    fontFamily: "NanumSquareNeo-Bold",
    color: Color["grey300"],
    fontSize: 12,
  },
  extendButton: {
    justifyContent: "center",
  },
  extendButtonText: {
    fontFamily: "NanumSquareNeo-Bold",
    color: "#FFF",
    fontSize: 14,
    backgroundColor: `rgba(0,0,0,0.4)`,
    padding: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
});
