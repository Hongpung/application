// entities/common/ui/CustomAlertModal.tsx
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Pressable,
  BackHandler,
} from "react-native";
import { useAtom } from "jotai";
import { alertAtom } from "../../atom/alertAtom";
import { LongButton, ShortButton } from "../buttons";
import { useEffect } from "react";
import { Color } from "../../constant/color";

export const AlertModal: React.FC = () => {
  const [alertState, setAlertState] = useAtom(alertAtom);

  const close = () => setAlertState((prev) => ({ ...prev, isVisible: false }));

  const handleConfirm = () => {
    if (alertState.onConfirm !== undefined) {
      alertState.onConfirm();
    }
    close();
  };

  const handleCancel = () => {
    if (alertState.onCancel !== undefined) {
      alertState.onCancel();
    }
    close();
  };

  useEffect(() => {
    if (!alertState.isVisible) return;

    const onBackPress = () => {
      handleCancel(); // or close();
      return true; // 기본 백버튼 동작 막기
    };

    const backHandlerSubscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => {
      backHandlerSubscription.remove();
    };
  }, [alertState.isVisible]);

  return (
    <Modal visible={alertState.isVisible} transparent>
      <Pressable
        onPress={alertState.cancelable ? handleCancel : undefined}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.2)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
          }}
          style={{
            marginHorizontal: 24,
            paddingVertical: 8,
            backgroundColor: "#FFF",
            display: "flex",
            gap: 16,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              paddingHorizontal: 28,
              paddingTop: 16,
              paddingBottom: 8,
              color: Color["grey600"],
              fontFamily: "NanumSquareNeo-ExtraBold",
              fontSize: 20,
            }}
          >
            {alertState.title}
          </Text>
          <Text
            style={{
              fontFamily: "NanumSquareNeo-Regular",
              textAlign: "left",
              paddingHorizontal: 28,
              paddingVertical: 8,
              lineHeight: 20,
              fontSize: 16,
            }}
          >
            {alertState.message}
          </Text>
          {alertState.type === "alert" ? (
            <View style={{ paddingVertical: 8 }}>
              <LongButton
                color={alertState.confirmButtonColor}
                innerContent={
                  <Text
                    style={{
                      fontFamily: "NanumSquareNeo-Bold",
                      fontSize: 16,
                      color: "#FFF",
                    }}
                  >
                    {alertState.confirmText}
                  </Text>
                }
                isAble
                onPress={handleConfirm}
              />
            </View>
          ) : (
            <View
              style={{
                paddingVertical: 8,
                flexDirection: "row",
                gap: 12,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ShortButton
                innerContent={
                  <Text
                    style={{
                      fontFamily: "NanumSquareNeo-Bold",
                      fontSize: 16,
                      color: Color[alertState.confirmButtonColor + "600"],
                    }}
                  >
                    {alertState.cancelText}
                  </Text>
                }
                onPress={handleCancel}
                isFilled={false}
                color={alertState.cancelButtonColor}
              />
              <ShortButton
                innerContent={
                  <Text
                    style={{
                      fontFamily: "NanumSquareNeo-Bold",
                      fontSize: 16,
                      color: "#FFF",
                    }}
                  >
                    {alertState.confirmText}
                  </Text>
                }
                onPress={handleConfirm}
                isFilled={true}
                color={alertState.confirmButtonColor}
              />
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};
