import { StyleSheet, Modal, Pressable } from "react-native";
import { Color, Icons } from "@hongpung/src/common";
import { Member } from "@hongpung/src/entities/member";
import { ProfileBox } from "../ProfileBox/ProfileBox";
import { useEffect, useState } from "react";

interface MemberDetailModalProps {
  selectedMember: Member | null;
  resetMember?: () => void;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  selectedMember,
  resetMember = () => {},
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
        onPress={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsModalVisible(false);
          resetMember();
        }}
      >
        <Pressable
          style={styles.modalContainer}
          onPress={(event) => event.stopPropagation()}
        >
          <ProfileBox member={selectedMember} />
          <Pressable
            style={styles.closeButton}
            onPress={() => {
              setIsModalVisible(false);
              resetMember();
            }}
          >
            <Icons name="close" color={Color["grey400"]} size={32} />
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
