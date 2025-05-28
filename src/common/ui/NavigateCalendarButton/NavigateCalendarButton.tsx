import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Color } from "../../constant/color";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

interface NavigateCalendarButtonProps {
  navigateReservationCalendar: () => void;
}

const NavigateCalendarButton: React.FC<NavigateCalendarButtonProps> = ({
  navigateReservationCalendar,
}) => {
  const tabBarHeight = useBottomTabBarHeight();
  return (
    <TouchableOpacity
      style={[styles.bottomContainer, { bottom: tabBarHeight + 24 }]}
      onPress={navigateReservationCalendar}
    >
      <Image
        source={require("@hongpung/assets/icons/ReservationIcon.png")}
        style={styles.reservationIcon}
        cachePolicy="memory-disk"
      />
      <View style={styles.reservationBox}>
        <Text style={styles.reservationText}>연습실 예약</Text>
      </View>
    </TouchableOpacity>
  );
};

//이미지 조건 때문에 absolute사용
const styles = StyleSheet.create({
  bottomContainer: {
    position: "absolute",
    width: "100%",
    paddingHorizontal: 24,
  },
  reservationIcon: {
    position: "absolute",
    width: 120,
    height: 120,
    right: 32,
    bottom: -4,
    zIndex: 2,
  },
  reservationBox: {
    borderWidth: 1,
    borderColor: Color["grey200"],
    borderRadius: 10,
    height: 88,
    backgroundColor: "#FFF",
  },
  reservationText: {
    position: "absolute",
    left: 8,
    bottom: 8,
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Heavy",
    color: Color["grey700"],
  },
});

export { NavigateCalendarButton };
