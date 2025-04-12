import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Color } from "@hongpung/ColorSet";

interface NavigateCalendarButtonProps {
    navigateReservationCalendar: () => void;
}

const NavigateCalendarButton: React.FC<NavigateCalendarButtonProps> = ({ navigateReservationCalendar }) => {
    return (
        <TouchableOpacity style={styles.bottomContainer} onPress={navigateReservationCalendar}>
            <Image source={require("@hongpung/assets/icons/ReservationIcon.png")} style={styles.reservationIcon} />
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
        bottom: 92,
        width: "100%",
        paddingHorizontal: 24,
    },
    reservationIcon: {
        position: "absolute",
        width: 120,
        height: 120,
        right: 24,
        bottom: -4,
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

export {NavigateCalendarButton};
