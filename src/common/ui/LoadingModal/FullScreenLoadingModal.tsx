import { Modal, View, ActivityIndicator } from "react-native";

export const FullScreenLoadingModal: React.FC<{ isLoading: boolean }> = ({
  isLoading,
}) => {
  if (!isLoading) return null;
  return (
    <Modal visible={isLoading} transparent>
      <View
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <ActivityIndicator size={"large"} color={"white"} />
      </View>
    </Modal>
  );
};
