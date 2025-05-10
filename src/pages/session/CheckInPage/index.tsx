import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";

import { useCheckIn } from "@hongpung/src/features/session/checkInRoom/model/useCheckIn";
import { CheckInButton } from "@hongpung/src/features/session/checkInRoom/ui/CheckInButton/CheckInButton";
import { ErrorModal } from "@hongpung/src/common/ui/ErrorModal/ErrorModal";
import { FullScreenLoadingModal } from "@hongpung/src/common";

export const CheckInPage: React.FC = () => {
  const {
    usingRoom,

    sessionData,
    isLoading,
    isCheckin,

    handleConfirm,
    
    content,
    errorMessage,

    buttonAction,
  } = useCheckIn();

  if (isLoading) {
    return <FullScreenLoadingModal isLoading />;
  }

  if (!sessionData || usingRoom || sessionData.status === "UNAVAILABLE") {
    return (
      <ErrorModal
        visible
        title="오류"
        message={errorMessage}
        onConfirm={handleConfirm}
      />
    );
  }

  return (
    <View style={styles.container}>
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
