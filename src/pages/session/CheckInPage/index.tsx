import React, { useCallback, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";

import { Header, Color, Alert } from "@hongpung/src/common";
import { MainStackScreenProps } from "@hongpung/src/common/navigation";
import {
  CheckInButton,
  useCheckIn,
  CheckInSteps,
} from "@hongpung/src/features/session/checkInRoom";
import { useStepFlow } from "@hongpung/react-step-flow";

// 각 상태별 위젯들 import
import { LateSessionCompleteWidget } from "@hongpung/src/widgets/session/ui/LateSessionCompleteWidget/LateSessionCompleteWidget";
import { AttendSessionCompleteWidget } from "@hongpung/src/widgets/session/ui/AttendSessionCompleteWidget/AttendSessionCompleteWidget";
import { StartSessionCompleteWidget } from "@hongpung/src/widgets/session/ui/StartSessionCompleteWidget/StartSessionCompleteWidget";
import { AttendSessionConfirmWidget } from "@hongpung/src/widgets/session/ui/AttendSessionConfirmWidget/AttendSessionConfirmWidget";
import { StartSessionConfirmWidget } from "@hongpung/src/widgets/session/ui/StartSessionConfirmWidget/StartSessionConfirmWidget";
import { CreateSessionConfirmWidget } from "@hongpung/src/widgets/session/ui/CreateSessionConfirmWidget/CreateSessionConfirmWidget";

export const CheckInPage: React.FC<MainStackScreenProps<"CheckIn">> = ({
  navigation,
}) => {
  const CheckInStep = useStepFlow<CheckInSteps>({
    initialStep: "StartSessionConfirm",
  });

  const {
    sessionData,
    isLoading,
    checkinAttendStatus,
    participationAvailable,
    setParticipationAvailable,
    errorMessage,
    usingRoom,
    isCheckin,
    buttonHandler,
  } = useCheckIn();

  const navigateToHome = useCallback(() => {
    navigation.setOptions({ animation: "none" });
    navigation.navigate("MainTab", { screen: "Home" });
  }, [navigation]);

  const onError = useCallback(() => {
    Alert.alert(
      "오류",
      (sessionData?.status === "UNAVAILABLE" && errorMessage) ||
        "잘못된 접근입니다.",
      {
        onConfirm: () => {
          navigateToHome();
        },
      },
    );
  }, [sessionData, errorMessage, navigateToHome]);

  useEffect(() => {
    if (
      !isLoading &&
      (!sessionData ||
        (usingRoom && !isCheckin) ||
        sessionData.status === "UNAVAILABLE")
    ) {
      onError();
    }
  }, [isLoading, sessionData, usingRoom, isCheckin, onError]);

  if (isLoading || !sessionData) {
    return (
      <View style={styles.container}>
        <Header LeftButton="close" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Color["blue500"]} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header LeftButton="close" />
      <CheckInStep.Flow>
        <CheckInStep.Step
          name="StartSessionConfirm"
          component={StartSessionConfirmWidget}
          stepProps={{
            session:
              sessionData.status === "JOINABLE"
                ? sessionData.currentSession
                : null,
            participationAvailable,
            setParticipationAvailable,
            onStart: () => {
              buttonHandler(navigateToHome);
            },
          }}
        />
        <CheckInStep.Step
          name="AttendSessionConfirm"
          component={AttendSessionConfirmWidget}
          stepProps={{
            session:
              sessionData.status === "JOINABLE"
                ? sessionData.currentSession
                : null,
            onAttend: () => {
              buttonHandler(navigateToHome);
            },
          }}
        />
        <CheckInStep.Step
          name="CreateSessionConfirm"
          component={CreateSessionConfirmWidget}
          stepProps={{
            nextSession:
              "nextReservationSession" in sessionData
                ? sessionData.nextReservationSession
                : null,
            participationAvailable,
            setParticipationAvailable,
            onStart: () => {
              buttonHandler(navigateToHome);
            },
          }}
        />

        <CheckInStep.Step
          name="StartSessionComplete"
          component={StartSessionCompleteWidget}
          stepProps={{
            navigateToHome,
          }}
        />
        <CheckInStep.Step
          name="AttendSessionComplete"
          component={AttendSessionCompleteWidget}
          stepProps={{
            attendanceStatus: checkinAttendStatus ?? "출석",
            navigateToHome,
          }}
        />
        <CheckInStep.Step
          name="LateSessionComplete"
          component={LateSessionCompleteWidget}
          stepProps={{
            startTime:
              sessionData.status === "JOINABLE"
                ? sessionData.currentSession?.startTime
                : null,
            navigateToHome,
          }}
        />
      </CheckInStep.Flow>
      <CheckInButton
        isCheckin={isCheckin}
        sessionStatus={sessionData.status}
        onPress={() => {
          buttonHandler(navigateToHome);
        }}
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
