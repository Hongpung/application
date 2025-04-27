import { StyleSheet, Modal, Pressable } from "react-native";
import { Icons } from "@hongpung/src/common";
import { Member } from "@hongpung/src/entities/member";
import { ProfileBox } from "../ProfileBox/ProfileBox";
import { useEffect, useState } from "react";

interface MemberDetailModalProps {
  selectedMember: Member | null;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  selectedMember,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(true);

  useEffect(() => {
    setIsModalVisible(true);
  }, [selectedMember]);

  if (!selectedMember) {
    return null;
  }

  return (
    <Modal transparent visible={isModalVisible && !!selectedMember}>
      <Pressable
        style={styles.overlay}
        onPress={(event) => {
          event.stopPropagation();
          setIsModalVisible(false);
        }}
      >
        <Pressable
          style={styles.modalContainer}
          onPress={(event) => event.stopPropagation()}
        >
          <ProfileBox member={selectedMember!} />
          <Pressable
            style={styles.closeButton}
            onPress={() => setIsModalVisible(false)}
          >
            <Icons name="close" color="#000" size={32} />
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    height: "100%",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    height: 256,
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 16,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
});
