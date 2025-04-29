import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Modal } from "react-native";
import { LongButton } from "../buttons/LongButton";

interface ErrorModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  visible: externalVisible,
  title,
  message,
  onConfirm,
}) => {

  const [visible, setVisible] = useState(externalVisible);
  
  useEffect(() => {
    setVisible(externalVisible);
  }, [externalVisible]);
  return (
    <Modal visible={visible} transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.errorTitle}>{title}</Text>
          <Text style={styles.errorMessage}>{message}</Text>
          <LongButton
            color="blue"
            innerContent="확인"
            onPress={() => {
              setVisible(false);
              if (onConfirm) {
                onConfirm();
              }
            }}
            isAble={true}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    display: "flex",
    justifyContent: "center",
  },
  modalContent: {
    marginHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: "#FFF",
    display: "flex",
    gap: 16,
    borderRadius: 15,
  },
  errorTitle: {
    paddingHorizontal: 24,
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 20,
  },
  errorMessage: {
    paddingHorizontal: 24,
    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 16,
  },
});
