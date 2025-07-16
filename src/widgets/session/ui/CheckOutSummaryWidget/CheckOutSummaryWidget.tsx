import { LongButton, useEntryAnimation } from "@hongpung/src/common";
import { StepProps } from "@hongpung/react-step-flow";
import { View, StyleSheet, ScrollView, Animated } from "react-native";

import { CheckOutStepProps } from "@hongpung/src/features/session/checkOutRoom/model/types";
// entities에서 도메인별 dumb UI 컴포넌트들 import (widgets → entities 허용)
import {
  useAttendanceData,
  SessionInfoSummary,
  SessionImageGallery,
  AttendanceSummary,
} from "@hongpung/src/entities/session";

type CheckOutSummaryWidgetProps = StepProps<
  CheckOutStepProps,
  "CheckOutSummary"
>;

export const CheckOutSummaryWidget: React.FC<CheckOutSummaryWidgetProps> = ({
  stepProps: { endSessionData, onHome },
}) => {
  const { animatedStyle } = useEntryAnimation();
  const { attendanceList } = useAttendanceData(endSessionData);

  console.log({ endSessionData });
  console.log(endSessionData?.returnImageUrl);
  if (!endSessionData) return null;

  // const handleViewAllAttendance = () => {
  //   // TODO: 출석 전체 보기 네비게이션 로직
  //   console.log("View all attendance");
  // };

  const handleImagePress = (imageUrl: string) => {
    // TODO: 이미지 상세 보기 네비게이션 로직
    console.log("Image pressed:", imageUrl);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, gap: 28 }}
      >
        <SessionInfoSummary
          sessionData={endSessionData}
          animatedStyle={animatedStyle}
        />

        <AttendanceSummary
          attendanceList={attendanceList}
          animatedStyle={animatedStyle}
          sessionType={endSessionData.sessionType}
        />

        <SessionImageGallery
          images={endSessionData.returnImageUrl || []}
          animatedStyle={animatedStyle}
          onImagePress={handleImagePress}
        />
      </ScrollView>

      <Animated.View style={[styles.footerContainer, animatedStyle]}>
        <LongButton
          color="blue"
          innerContent="홈으로 돌아가기"
          onPress={onHome}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  footerContainer: {
    backgroundColor: "#FFF",
    paddingTop: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});
