import { View, Text, ScrollView, FlatList } from "react-native";
import {
  AttendanceSummary,
  SessionImageGallery,
  SessionInfoSummary,
} from "@hongpung/src/entities/session";

import { SessionLog } from "@hongpung/src/entities/session-log";

import { Member } from "@hongpung/src/entities/member";

import { BorrowInstrumentCard } from "@hongpung/src/entities/instrument";
import { Color, ImageModal } from "@hongpung/src/common";
import { useState } from "react";

type SessionLogInfoWidgetProps = {
  sessionLog: SessionLog;
  navigateToInstrumentDetail?: (instrumentId: number) => void;
};

export const SessionLogInfoWidget: React.FC<SessionLogInfoWidgetProps> = ({
  sessionLog,
  navigateToInstrumentDetail = () => {},
}) => {
  console.log(sessionLog);
  const attendanceList: Record<string, Member[]> =
    sessionLog.attendanceList.reduce(
      (acc, attendance) => {
        if (attendance.status === "참가") {
          acc["참가"] = [attendance.user];
        } else {
          acc[attendance.status] = [attendance.user];
        }
        return acc;
      },
      {} as Record<string, Member[]>,
    );
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1, gap: 16 }}
    >
      <View style={{ gap: 32, paddingVertical: 12 }}>
        <SessionInfoSummary sessionData={sessionLog} />
      </View>
      <AttendanceSummary
        attendanceList={attendanceList}
        sessionType={sessionLog.sessionType}
      />
      {sessionLog.borrowInstruments &&
        sessionLog.borrowInstruments.length > 0 && (
          <View style={{ gap: 16 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "NanumSquareNeo-Bold",
                color: Color["grey400"],
                paddingHorizontal: 28,
              }}
            >
              대여 악기 목록
            </Text>
            <View>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={sessionLog.borrowInstruments}
                ListHeaderComponent={<View style={{ width: 0 }} />}
                ListFooterComponent={<View style={{ width: 0 }} />}
                contentContainerStyle={{
                  gap: 8,
                  flexGrow: 1,
                  flexShrink: 0,
                  paddingHorizontal: 28,
                }}
                keyExtractor={(item) => item.instrumentId.toString()}
                renderItem={({ item }) => (
                  <BorrowInstrumentCard
                    instrument={item}
                    isPicked={false}
                    onClickInstrument={({ instrumentId }) =>
                      navigateToInstrumentDetail(instrumentId)
                    }
                  />
                )}
              />
            </View>
          </View>
        )}
      <SessionImageGallery
        images={sessionLog.returnImageUrl || []}
        onImagePress={(imageUrl) => {
          setImageModalVisible(true);
          setImageUrl(imageUrl);
        }}
      />

      {sessionLog.returnImageUrl && imageUrl && (
        <ImageModal
          isVisible={imageModalVisible}
          setIsVisible={setImageModalVisible}
          imageUrl={imageUrl}
        />
      )}
    </ScrollView>
  );
};
