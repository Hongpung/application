import { Color } from "@hongpung/src/common";
import { View, Text, Pressable, StyleSheet } from "react-native";

type ReservationTypeSelectorProps = {
  reservationType: Exclude<ReservationType, "EXTERNAL">;
  setReservationType: (
    changeType: Exclude<ReservationType, "EXTERNAL">,
  ) => void;
  participationAvailable: boolean;
  setParticipationAvailable: (changeAvailable: boolean) => void;
};

export const ReservationTypeSelector: React.FC<ReservationTypeSelectorProps> = (
  props,
) => {
  const {
    reservationType,
    participationAvailable,
    setReservationType,
    setParticipationAvailable,
  } = props;

  return (
    <View>
      <Text
        style={{
          marginHorizontal: 24,
          fontSize: 16,
          fontFamily: "NanumSquareNeo-Regular",
          color: Color["grey500"],
        }}
      >
        예약유형
      </Text>
      <View style={{ height: 24 }} />
      <View
        style={{
          marginHorizontal: 44,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: "NanumSquareNeo-Regular",
            color: Color["grey400"],
          }}
        >
          정규 일정
        </Text>
        <View
          style={{
            width: 218,
            height: 36,
            borderRadius: 5,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Pressable
            style={[
              {
                width: 108,
                alignItems: "center",
                borderBottomLeftRadius: 5,
                borderTopLeftRadius: 5,
                height: 36,
                justifyContent: "center",
                borderWidth: 1,
                borderRightWidth: 0.5,
                borderColor:
                  reservationType === "REGULAR"
                    ? Color["blue500"]
                    : Color["red500"],
              },
              reservationType === "REGULAR" && {
                backgroundColor: Color["blue100"],
              },
            ]}
            onPress={() => {
              setReservationType("REGULAR");
              setParticipationAvailable(false);
            }}
          >
            <Text
              style={[
                style.buttonText,
                reservationType === "REGULAR"
                  ? { color: Color["blue600"] }
                  : { color: Color["red300"] },
              ]}
            >
              예
            </Text>
          </Pressable>
          <Pressable
            style={[
              {
                width: 108,
                alignItems: "center",
                borderBottomRightRadius: 5,
                borderTopRightRadius: 5,
                height: 36,
                justifyContent: "center",
                borderWidth: 1,
                borderLeftWidth: 0.5,
                borderColor:
                  reservationType === "REGULAR"
                    ? Color["blue500"]
                    : Color["red500"],
              },
              reservationType !== "REGULAR" && {
                backgroundColor: Color["red100"],
              },
            ]}
            onPress={() => setReservationType("COMMON")}
          >
            <Text
              style={[
                style.buttonText,
                reservationType === "REGULAR"
                  ? { color: Color["blue300"] }
                  : { color: Color["red600"] },
              ]}
            >
              아니오
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={{ height: 20 }} />

      <View
        style={{
          marginHorizontal: 44,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: "NanumSquareNeo-Regular",
            color: Color["grey400"],
          }}
        >
          열린 연습
        </Text>
        <View
          style={{
            width: 218,
            height: 36,
            borderRadius: 5,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Pressable
            style={[
              {
                width: 108,
                alignItems: "center",
                borderBottomLeftRadius: 5,
                borderTopLeftRadius: 5,
                height: 36,
                justifyContent: "center",
                borderWidth: 1,
                borderRightWidth: 0.5,
                borderColor:
                  reservationType === "REGULAR"
                    ? Color["grey400"]
                    : participationAvailable
                      ? Color["blue500"]
                      : Color["red500"],
              },
              reservationType !== "REGULAR" &&
                participationAvailable && { backgroundColor: Color["blue100"] },
            ]}
            disabled={reservationType === "REGULAR"}
            onPress={() =>
              reservationType !== "REGULAR" && setParticipationAvailable(true)
            }
          >
            <Text
              style={[
                style.buttonText,
                reservationType === "REGULAR"
                  ? { color: Color["grey300"] }
                  : participationAvailable
                    ? { color: Color["blue600"] }
                    : { color: Color["red300"] },
              ]}
            >
              예
            </Text>
          </Pressable>
          <Pressable
            style={[
              {
                width: 108,
                alignItems: "center",
                borderBottomRightRadius: 5,
                borderTopRightRadius: 5,
                height: 36,
                justifyContent: "center",
                borderWidth: 1,
                borderLeftWidth: 0.5,
                borderColor:
                  reservationType === "REGULAR"
                    ? Color["grey400"]
                    : participationAvailable
                      ? Color["blue500"]
                      : Color["red500"],
              },
              reservationType === "REGULAR"
                ? { backgroundColor: Color["grey100"] }
                : !participationAvailable && {
                    backgroundColor: Color["red100"],
                  },
            ]}
            disabled={reservationType === "REGULAR"}
            onPress={() =>
              reservationType !== "REGULAR" && setParticipationAvailable(false)
            }
          >
            <Text
              style={[
                style.buttonText,
                reservationType === "REGULAR"
                  ? { color: Color["grey400"] }
                  : participationAvailable
                    ? { color: Color["blue300"] }
                    : { color: Color["red600"] },
              ]}
            >
              아니오
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  buttonText: { fontFamily: "NanumSquareNeo-Bold", fontSize: 14 },
});
