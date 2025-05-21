import React, { useCallback, useMemo } from "react";
import { View, StyleSheet } from "react-native";

import { useCheckIn } from "@hongpung/src/features/session/checkInRoom/model/useCheckIn";
import { CheckInButton } from "@hongpung/src/features/session/checkInRoom/ui/CheckInButton/CheckInButton";
import { ErrorModal } from "@hongpung/src/common/ui/ErrorModal/ErrorModal";
import { Alert, FullScreenLoadingModal, Header } from "@hongpung/src/common";

export const CheckInPage: React.FC = () => {
  const {
    usingRoom,

    sessionData,
    isLoading,
    isCheckin,

    content,

    buttonAction,
  } = useCheckIn();

  console.log("CheckInPage sessionData", sessionData);

  const onError = useCallback(() => {
    Alert.alert(
      "오류",
      (sessionData?.status === "UNAVAILABLE" && sessionData?.errorMessage) ||
        "잘못된 접근입니다."
    );
  }, [sessionData]);

  if (isLoading) {
    return <FullScreenLoadingModal isLoading />;
  }

  if (!sessionData || usingRoom || sessionData.status === "UNAVAILABLE") {
    onError();
    return <View style={{ flex: 1, backgroundColor: "#FFF" }} />;
  }

  return (
    <View style={styles.container}>
      <Header leftButton={"close"} />
      {content}
      <CheckInButton
        isCheckin={isCheckin}
        sessionStatus={sessionData.status}
        onPress={buttonAction}
      />
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
    justifyContent: "center",
    alignItems: "center",
  },
  skeletonContainer: {
    width: 320,
    height: 180,
    borderRadius: 5,
    borderWidth: 1,
    marginVertical: 24,
  },
});
