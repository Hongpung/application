import { Icons, Color } from "@hongpung/src/common";

import { StyleSheet, Pressable, View } from "react-native";
import { useGetNotReadNotificationFetch } from "@hongpung/src/features/notification/notReadNotification";

type NotificationIconProps = {
  navigateToNotificationPage: () => void;
};

export const NotificationIcon: React.FC<NotificationIconProps> = ({
  navigateToNotificationPage,
}: NotificationIconProps) => {
  const { data: isNotRead } = useGetNotReadNotificationFetch();

  return (
    <Pressable
      style={styles.icons}
      onPress={navigateToNotificationPage}
      testID="notification-icon-pressable"
      accessibilityRole="button"
      accessibilityLabel="알림 페이지로 이동"
      accessibilityHint={
        isNotRead?.status ? "읽지 않은 알림이 있습니다." : undefined
      }
    >
      <Icons size={28} name={"notifications"} color={Color["grey400"]} />
      {isNotRead?.status && (
        <View style={styles.notReadMarker} testID="not-read-marker" />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  icons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
  },
  notReadMarker: {
    position: "absolute",
    width: 12,
    height: 12,
    backgroundColor: Color["red400"],
    borderWidth: 2,
    borderColor: "#FFF",
    bottom: 4,
    right: 4,
    borderRadius: 100,
  },
});
