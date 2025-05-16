import React, { useEffect, useRef } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Member } from "@hongpung/src/entities/member";
import { Color, Icons } from "@hongpung/src/common";

interface SelectedParticipatorListProps {
  newParticipators: Member[];
  setNewParticipators: React.Dispatch<React.SetStateAction<Member[]>>;
}

const SelectedParticipatorList: React.FC<SelectedParticipatorListProps> = ({
  newParticipators,
  setNewParticipators,
}) => {
  const scrollRef = useRef<FlatList>(null);

  useEffect(() => {
    scrollRef.current?.scrollToOffset({
      offset: (newParticipators.length - 1) * 500,
      animated: true,
    });
  }, [newParticipators]);

  return (
    <>
      <View
        style={{
          paddingHorizontal: 28,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            paddingHorizontal: 4,
            fontFamily: "NanumSquareNeo-Regular",
          }}
        >
          선택한 인원
        </Text>
        <Pressable
          onPress={() => {
            Alert.alert(
              "확인",
              "선택한 인원을 전부 취소할까요?",
              [
                { text: "취소", style: "cancel" },
                {
                  text: "확인",
                  onPress: () => {
                    setNewParticipators([]);
                  },
                },
              ],
              { cancelable: true }
            );
          }}
          style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
        >
          <Text
            style={{
              fontFamily: "NanumSquareNeo-Regular",
              color: Color["grey400"],
            }}
          >
            전체 해제
          </Text>
          <Icons name="close" size={24} color={Color["grey400"]} />
        </Pressable>
      </View>

      <FlatList
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingHorizontal: 28, paddingVertical: 12 }}
        contentContainerStyle={{ gap: 8 }}
        data={newParticipators}
        keyExtractor={(_, index) => "selected-member-" + index}
        ListFooterComponent={<View style={{ width: 24 }} />}
        renderItem={({ item: participator }) => (
          <View style={styles.participantContainer}>
            <Text style={[styles.participantText, { color: Color["grey500"] }]}>
              {participator.name}
              {participator.nickname ? `(${participator.nickname})` : ""}
            </Text>

            <Pressable
              onPress={() => {
                setNewParticipators(
                  newParticipators.filter(
                    (participatorData) =>
                      participatorData.memberId != participator.memberId
                  )
                );
              }}
            >
              <Icons name="close-circle" size={24} color={Color["grey400"]} />
            </Pressable>
          </View>
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  participantContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Color["grey200"],
    justifyContent: "center",
    zIndex: 0,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  participantText: {
    fontFamily: "NanumSquareNeo-Regular",
  },
});

export default SelectedParticipatorList;
