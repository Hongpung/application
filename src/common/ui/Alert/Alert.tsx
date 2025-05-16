// entities/common/ui/CustomAlertModal.tsx
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { useAtom } from "jotai";
import { alertAtom } from "../../atom/alertAtom";
import { LongButton, ShortButton } from "../buttons";

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

  return (
    <Modal visible={alertState.isVisible} transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.2)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            marginHorizontal: 24,
            paddingVertical: 16,
            backgroundColor: "#FFF",
            display: "flex",
            gap: 16,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              paddingHorizontal: 24,
              paddingVertical: 8,
              width: "100%",
              fontFamily: "NanumSquareNeo-Bold",
              fontSize: 16,
            }}
          >
            {alertState.title}
          </Text>
          <Text
            style={{
              width: "100%",
              fontFamily: "NanumSquareNeo-Regular",
              textAlign: "left",
              paddingHorizontal: 24,
              paddingVertical: 8,
              lineHeight: 20,
              fontSize: 14,
            }}
          >
            {alertState.message}
          </Text>
          {alertState.type === "alert" ? (
            <View style={{ paddingHorizontal: 24, paddingVertical: 8 }}>
              <LongButton
                color="blue"
                innerContent="확인"
                isAble
                onPress={handleConfirm}
              />
            </View>
          ) : (
            <View
              style={{
                paddingHorizontal: 24,
                paddingVertical: 8,
                flexDirection: "row",
                gap: 12,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ShortButton
                innerContent={alertState.cancelText}
                onPress={handleCancel}
                isFilled={false}
                color={"blue"}
              />
              <ShortButton
                innerContent={alertState.confirmText}
                onPress={handleConfirm}
                isFilled={true}
                color={"blue"}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
