import { View, Text, Pressable, StyleSheet, Modal } from "react-native";
import { Image } from "expo-image";
import { Instrument } from "@hongpung/src/entities/instrument";
import { Color } from "@hongpung/src/common";
import { useEffect, useState } from "react";

const InstrumentModal: React.FC<{ instrument: Instrument | null }> = ({
  instrument,
}) => {
  const [visible, setVisible] = useState(!!instrument);
  useEffect(() => {
    setVisible(!!instrument);
  }, [instrument]);

  if (!instrument) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={() => {
        setVisible(false);
      }}
    >
      <Pressable
        style={styles.modalContainer}
        onPress={() => setVisible(false)}
      >
        <Pressable
          style={styles.modalContainer}
          onPress={(e) => {
            e.stopPropagation();
          }}
        >
          <View style={styles.imageContainer}>
            {instrument.imageUrl ? (
              <Image
                source={{ uri: instrument.imageUrl }}
                style={styles.image}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
            ) : (
              <View
                style={[styles.image, { backgroundColor: Color["grey200"] }]}
              />
            )}
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>악기 이름</Text>
              <Text style={styles.infoValue}>{instrument.name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>악기 타입</Text>
              <Text style={styles.infoValue}>{instrument.instrumentType}</Text>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default InstrumentModal;

const styles = StyleSheet.create({
  imageContainer: {
    overflow: "hidden",
    width: 308,
    height: 204,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 308,
    height: 204,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  instrumentBoxCantiner: {
    marginHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFF",
    borderRadius: 10,
  },
  infoContainer: {
    flexDirection: "column",
    gap: 12,
    paddingVertical: 24,
  },
  infoRow: {
    flexDirection: "row",
    height: 40,
    width: 342,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  infoLabel: {
    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 16,
    color: Color["grey400"],
  },
  infoValue: {
    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 16,
    color: Color["grey700"],
  },
});
