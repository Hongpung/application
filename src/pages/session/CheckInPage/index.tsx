import React from "react";
import { View, StyleSheet } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { useCheckIn } from "@hongpung/src/features/session/checkInRoom/model/useCheckIn";
import { CheckInButton } from "@hongpung/src/features/session/checkInRoom/ui/CheckInButton/CheckInButton";
import { ErrorModal } from "@hongpung/src/common/ui/ErrorModal/ErrorModal";
import { StartSessionConfirmWidget } from "@hongpung/src/widgets/session/ui/StartSessionConfirmWidget/StartSessionConfirmWidget";
import { AttendSessionConfirmWidget } from "@hongpung/src/widgets/session/ui/AttendSessionConfirmWidget/AttendSessionConfirmWidget";
import { CreateSessionConfirmWidget } from "@hongpung/src/widgets/session/ui/CreateSessionConfirmWidget/CreateSessionConfirmWidget";
import LateSessionCompleteWidget from "@hongpung/src/widgets/session/ui/LateSessionCompleteWidget/LateSessionCompleteWidget";
import AttendSessionCompleteWidget from "@hongpung/src/widgets/session/ui/AttendSessionCompleteWidget/AttendSessionCompleteWidget";
import StartSessionCompleteWidget from "@hongpung/src/widgets/session/ui/StartSessionCompleteWidget/StartSessionCompleteWidget";

const CheckInPage: React.FC = () => {
  const {
    usingRoom,
    checkinStatus,
    sessionData,
    isLoading,
    participationAvailable,
    setParticipationAvailable,
    handleStartSession,
    handleAttendSession,
    handleConfirm,
    isCheckin,
  } = useCheckIn();

  if (usingRoom) {
    return (
      <ErrorModal
        visible={true}
        title="오류"
        message="이미 참여중인 세션입니다."
        onConfirm={handleConfirm}
      />
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <SkeletonPlaceholder>
          <View style={styles.skeletonContainer}></View>
        </SkeletonPlaceholder>
      </View>
    );
  }

  if (!sessionData || !checkinStatus) {
    return (
      <ErrorModal
        visible={true}
        title="오류"
        message="알 수 없는 오류가 발생 했습니다. 다시 시도해주세요."
        onConfirm={handleConfirm}
      />
    );
  }

  if (sessionData.status === "UNAVAILABLE") {
    return (
      <ErrorModal
        visible={true}
        title="오류"
        message={sessionData.errorMessage}
        onConfirm={handleConfirm}
      />
    );
  }

  const getContent = () => {
    if (isCheckin) {
      if (checkinStatus === "지각" && sessionData.status === "JOINABLE") {
        return (
          <LateSessionCompleteWidget startTime={sessionData.currentSession.startTime} />
        );
      }
      if (checkinStatus === "참가" || checkinStatus === "출석") {
        return <AttendSessionCompleteWidget attendanceStatus={checkinStatus} />;
      }
      return <StartSessionCompleteWidget />;
    }

    if (sessionData.status === "JOINABLE" && sessionData.currentSession) {
      return <AttendSessionConfirmWidget session={sessionData.currentSession} />;
    }

    if (sessionData.status === "STARTABLE" && sessionData.nextReservationSession) {
      return <StartSessionConfirmWidget session={sessionData.nextReservationSession} />;
    }

    if (sessionData.status === "CREATABLE") {
      return (
        <CreateSessionConfirmWidget
          nextSession={sessionData.nextReservationSession}
          participationAvailable={participationAvailable}
          onParticipationAvailableChange={setParticipationAvailable}
        />
      );
    }

    return null;
  };

  const getButtonAction = () => {
    if (isCheckin) {
      return handleConfirm;
    }

    if (sessionData.status === "JOINABLE") {
      return handleAttendSession;
    }

    return handleStartSession;
  };

  return (
    <View style={styles.container}>
      {getContent()}
      <CheckInButton
        isCheckin={isCheckin}
        sessionStatus={sessionData.status}
        onPress={getButtonAction()}
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

export default CheckInPage;
