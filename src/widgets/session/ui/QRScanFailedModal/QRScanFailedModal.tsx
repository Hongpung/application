import { View, Text, Modal, StyleSheet } from "react-native";
import { LongButton } from "@hongpung/src/common";

interface QRScanFailedModalProps {
  visible: boolean;
  onClose: () => void;
}

const QRScanFailedModal: React.FC<QRScanFailedModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.errorText}>유효하지 않은 QR코드 입니다.</Text>
          <Text style={styles.descriptionText}>확인 후 다시 촬영해주세요.</Text>
          <View style={styles.buttonContainer}>
            <LongButton
              color="blue"
              innerContent="확인"
              isAble={true}
              onPress={onClose}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  modalContent: {
    borderRadius: 20,
    minHeight: 200,
    paddingVertical: 24,
    marginHorizontal: 24,
    display: "flex",
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
  },
  descriptionText: {
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 16,
  },
});

export default QRScanFailedModal;
