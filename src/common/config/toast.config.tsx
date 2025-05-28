import { Icons } from "../ui/Icons/Icons";
import { Color } from "../constant/color";
import { View, Text, Pressable } from "react-native";
import Toast, { BaseToastProps } from "react-native-toast-message";

export const toastConfig = {
  notification: (
    { text1: title, text2: content, ...rest }: BaseToastProps, //success시 알림 모양
  ) => (
    <View
      style={{
        width: "100%",
      }}
    >
      <Pressable
        style={(state) => ({
          backgroundColor: state.pressed ? "#DDD" : "#FFF",
          paddingVertical: 16,
          borderRadius: 12,
          paddingHorizontal: 12,
          marginHorizontal: 24,
          minHeight: 56,
          gap: 12,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 24,
          elevation: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        })}
        {...rest}
      >
        <Icons name="notifications" size={36} color={Color["blue500"]} />
        <View
          style={{
            flexDirection: "column",
            flex: 1,
            gap: 4,
          }}
        >
          <Text
            style={{
              color: "#000",
              fontSize: 16,
              fontFamily: "NanumSquareNeo-Bold",
              textAlign: "left",
              width: "100%",
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              color: Color["grey400"],
              lineHeight: 18,
              fontSize: 14,
              fontFamily: "NanumSquareNeo-Regular",
              textAlign: "left",
              width: "100%",
            }}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {content}
          </Text>
        </View>
      </Pressable>
    </View>
  ),
  successHasReturn: (
    { text1, text2, ...rest }: BaseToastProps, //success 및 되돌리기 버튼 포함
  ) => (
    <View style={{ width: "100%" }}>
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.8)",
          paddingVertical: 12,
          borderRadius: 50,
          paddingHorizontal: 24,
          marginHorizontal: 24,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        {...rest}
      >
        <View>
          <Text
            style={{
              color: "#FFF",
              fontSize: 14,
              fontWeight: "bold",
              maxWidth: "100%",
              fontFamily: "NanumSquareNeo-Bold",
            }}
          >
            {text1}
          </Text>
        </View>

        <Pressable
          style={{
            paddingHorizontal: 4,
            paddingVertical: 5,
            borderRadius: 5,
          }}
          onPress={() => {
            console.log("Undo action");
            Toast.hide();
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: Color["blue500"],
              fontFamily: "NanumSquareNeo-Bold",
            }}
          >
            되돌리기
          </Text>
        </Pressable>
      </View>
    </View>
  ),
  success: (
    { text1, text2, ...rest }: BaseToastProps, //success시 알림 모양
  ) => (
    <View style={{ width: "100%" }}>
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.8)",
          paddingVertical: 12,
          borderRadius: 50,
          paddingHorizontal: 24,
          marginHorizontal: 48,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
        {...rest}
      >
        <Text
          style={{
            color: "#FFF",
            fontSize: 14,
            fontWeight: "bold",
            fontFamily: "NanumSquareNeo-Bold",
            textAlign: "center",
          }}
        >
          {text1}
        </Text>
      </View>
    </View>
  ),
  fail: (
    { text1, text2, ...rest }: BaseToastProps, //fail 시 알림 모양
  ) => (
    <View style={{ width: "100%" }}>
      <View
        style={{
          backgroundColor: "rgba(242,107,87,0.8)",
          paddingVertical: 12,
          borderRadius: 50,
          paddingHorizontal: 24,
          marginHorizontal: 48,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
        {...rest}
      >
        <Text
          style={{
            color: "#FFF",
            fontSize: 14,
            fontFamily: "NanumSquareNeo-Bold",
            textAlign: "center",
            lineHeight: 20,
          }}
        >
          {text1}
        </Text>
      </View>
    </View>
  ),
};
