import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";

import React, { useState } from "react";
import { useAtomValue } from "jotai";

import {
  Alert,
  Color,
  Header,
  ImageModal,
  ImageWithSkeleton,
} from "@hongpung/src/common";
import { UserStatusState } from "@hongpung/src/entities/member";

import { useLoadInstrumentDetailFetch } from "@hongpung/src/entities/instrument/api/instrumentApi";

import { MainStackScreenProps } from "@hongpung/src/common/navigation";
import { debounce } from "lodash";

export const InstrumentDetailPage: React.FC<
  MainStackScreenProps<"InstrumentDetail">
> = ({ navigation, route }) => {
  const { instrumentId } = route.params;
  const { data, isLoading, error } = useLoadInstrumentDetailFetch({
    instrumentId,
  });

  const [imageModalVisible, setImageModalVisible] = useState(false);
  const loginUser = useAtomValue(UserStatusState);

  const navigateToEditInstrument = () => {
    navigation.navigate("EditInstrument", {
      instrument: JSON.stringify(data),
    });
  };

  const debouncedGoBack = debounce(
    () => {
      navigation.goBack();
    },
    500,
    {
      leading: true,
      trailing: false,
    },
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Color["blue500"]} />
      </View>
    );
  }

  if (error) {
    Alert.alert("오류", "악기 정보를 찾을 수 없습니다.");
    debouncedGoBack();
    return (
      <View>
        <Text>오류:기 정보를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Color["blue500"]} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {data.imageUrl && (
        <ImageModal
          isVisible={imageModalVisible}
          setIsVisible={setImageModalVisible}
          imageUrl={data.imageUrl!}
        />
      )}

      {loginUser?.club === data.club && loginUser?.role.length !== 0 ? (
        <Header
          LeftButton="close"
          headerName="악기 상세"
          RightButton="수정"
          rightAction={navigateToEditInstrument}
        />
      ) : (
        <Header LeftButton="close" headerName="악기 상세" />
      )}

      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.spacing} />

        <Pressable
          style={styles.imageContainer}
          onPress={() => {
            data.imageUrl && setImageModalVisible(true);
          }}
        >
          {data.imageUrl ? (
            <ImageWithSkeleton
              imageSource={{ uri: data.imageUrl }}
              style={styles.image}
            />
          ) : (
            <View
              style={[styles.image, { backgroundColor: Color["grey200"] }]}
            />
          )}
        </Pressable>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>악기 이름</Text>
            <Text style={styles.infoValue}>{data.name}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>악기 타입</Text>
            <Text style={styles.infoValue}>{data.instrumentType}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>대여 상태</Text>
            <View style={styles.statusContainer}>
              <Text
                style={[
                  styles.statusText,
                  {
                    color: data.borrowAvailable
                      ? Color["blue400"]
                      : Color["red400"],
                  },
                ]}
              >
                {data.borrowAvailable ? "대여 가능" : "대여 불가"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.spacing} />

        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>대여 내역</Text>
          <View style={styles.historyList}>
            {data.borrowHistory.length > 0 ? (
              data.borrowHistory.map((history) => (
                <View
                  key={history.borrowerName + history.borrowDate}
                  style={styles.historyItem}
                >
                  <View style={styles.historyHeader}>
                    <Text style={styles.borrowerName}>
                      {history.borrowerName}
                    </Text>
                    {history.borrowerNickname && (
                      <Text style={styles.borrowerNickname}>
                        {history.borrowerNickname}
                      </Text>
                    )}
                  </View>
                  <View style={styles.historyFooter}>
                    <Text style={styles.borrowDate}>{history.borrowDate}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyHistory}>
                <Text style={styles.emptyHistoryText}>
                  대여 내역이 없습니다...
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "center",
  },
  scrollView: {
    alignItems: "center",
  },
  spacing: {
    height: 12,
  },
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
  modalImage: {
    width: 308,
    height: 204,
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
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusText: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 16,
  },
  historyContainer: {
    alignSelf: "flex-start",
    paddingHorizontal: 28,
    width: "100%",
  },
  historyTitle: {
    fontSize: 18,
    fontFamily: "NanumSquareNeo-Bold",
  },
  historyList: {
    paddingVertical: 6,
  },
  historyItem: {
    width: 320,
    height: 76,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Color["grey200"],
    marginVertical: 6,
    padding: 14,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  borrowerName: {
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Regular",
    color: Color["grey700"],
    marginRight: 2,
  },
  borrowerNickname: {
    fontSize: 14,
    fontFamily: "NanumSquareNeo-Regular",
    color: Color["grey400"],
  },
  historyFooter: {
    position: "absolute",
    right: 12,
    bottom: 12,
  },
  borrowDate: {
    fontSize: 14,
    fontFamily: "NanumSquareNeo-Regular",
    color: Color["grey400"],
  },
  emptyHistory: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  emptyHistoryText: {
    fontSize: 17,
    fontFamily: "NanumSquareNeo-Regular",
    color: Color["grey400"],
  },
});
