import React, { useState } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";

import { useAtomValue } from "jotai";
import { ThisSessionState } from "@hongpung/src/entities/session";
import { Alert, Color, ErrorModal, Header, Icons } from "@hongpung/src/common";
import MemberList from "@hongpung/src/widgets/member/ui/MemberList/MemberList";
import { useCalculateTime } from "@hongpung/src/features/session/useRoom/model/useCalculateTime";
import {
  BorrowInstrumentCard,
  Instrument,
} from "@hongpung/src/entities/instrument";
import { useExtendSessionRequest } from "@hongpung/src/entities/session";
import { FullScreenLoadingModal } from "@hongpung/src/common/ui/LoadingModal/FullScreenLoadingModal";
import { extendSessionSuccessToast } from "@hongpung/src/features/session/useRoom/lib/toast";
import { SessionControlButton } from "@hongpung/src/features/session/useRoom/ui/SessionControlButton/SessionControlButton";
import { useSeperateMember } from "@hongpung/src/features/session/useRoom/model/useSeperateMember";
import InstrumentModal from "@hongpung/src/widgets/instrument/ui/InstrumentModal/InstrumentModal";
import { SessionManagementScreenProps } from "@hongpung/src/common/navigation";

const UsingManageScreen: React.FC<
  SessionManagementScreenProps<"SessionManage">
> = ({ navigation }) => {
  const usingSession = useAtomValue(ThisSessionState);

  const { canExtand, canReturn } = useCalculateTime();
  const { request: extendRequest, isLoading } = useExtendSessionRequest();
  const { absentUsers, attendUsers, lateUsers } =
    useSeperateMember(usingSession);

  const [instrument, setInstrument] = useState<Instrument | null>(null);

  console.log("usingSession", usingSession);

  const handleExtendSession = async () => {
    try {
      if (!canExtand) throw new Error("세션 연장 불가능");
      const { message } = await extendRequest();
      if (message === "Success") {
        extendSessionSuccessToast();
        navigation.goBack();
      } else {
        throw new Error("세션 연장 실패" + message);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("오류", error.message);
      } else {
        Alert.alert("오류", "세션 연장에 실패했어요.");
      }
    }
  };

  if (!usingSession)
    return (
      <ErrorModal
        visible={true}
        title={"오류"}
        message={"세션 정보가 존재하지 않아요."}
        onConfirm={() => {
          navigation.goBack();
        }}
      />
    );

  return (
    <View style={styles.container}>
      <FullScreenLoadingModal isLoading={isLoading} />
      <Header leftButton={"close"} />
      <InstrumentModal instrument={instrument} />
      <View style={styles.container}>
        <View style={styles.headerSpacing} />
        <Text style={styles.title}>연습 예정 시간</Text>
        <View style={styles.headerSpacing} />
        <View style={styles.timeContainer}>
          <Icons name="time-outline" color={Color["grey400"]} />
          <Text style={styles.timeText}>
            {usingSession.startTime} ~ {usingSession.endTime}
          </Text>
        </View>

        {usingSession?.borrowInstruments &&
          usingSession?.borrowInstruments?.length > 0 && (
            <>
              <View style={styles.headerSpacing} />
              <View style={styles.instrumentListContainer}>
                <Text style={styles.title}>대여한 악기 목록</Text>
                <FlatList
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                  data={usingSession?.borrowInstruments}
                  renderItem={({ item }) => (
                    <BorrowInstrumentCard
                      instrument={item}
                      isPicked={false}
                      onClickInstrument={() => {
                        setInstrument(item);
                      }}
                    />
                  )}
                  keyExtractor={(item) => item.instrumentId + "-key"}
                  horizontal={true}
                  ListHeaderComponent={<View style={styles.listHeaderFooter} />}
                  ListFooterComponent={<View style={styles.listHeaderFooter} />}
                />
              </View>
            </>
          )}
        <View style={styles.headerSpacing} />
        <View style={styles.attendanceContainer}>
          <Text style={styles.title}>
            {usingSession?.sessionType === "RESERVED"
              ? "출석한 사람"
              : "참여한 사람"}
          </Text>
          <MemberList members={attendUsers} />

          {usingSession.sessionType === "RESERVED" && (
            <>
              {lateUsers.length > 0 && (
                <>
                  <Text style={styles.title}>지각한 사람</Text>
                  <MemberList members={lateUsers} />
                </>
              )}
              {absentUsers.length > 0 && (
                <>
                  <Text style={styles.title}>아직 안 온 사람</Text>
                  <MemberList members={absentUsers} />
                </>
              )}
            </>
          )}
          <View style={styles.headerSpacing} />
        </View>
      </View>
      <SessionControlButton
        canExtand={canExtand}
        canReturn={canReturn}
        handleExtendSession={handleExtendSession}
        handleReturnSession={() => {
          navigation.replace("SessionManagement", {
            screen: "CheckOutSession"
          });
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
  headerSpacing: {
    height: 16,
  },
  title: {
    marginHorizontal: 32,
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 18,
  },
  timeContainer: {
    flexDirection: "row",
    width: 176,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  timeText: {
    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 20,
  },
  instrumentListContainer: {
    gap: 12,
  },
  attendanceContainer: {
    marginHorizontal: 24,
    display: "flex",
    gap: 8,
  },

  listHeaderFooter: {
    width: 36,
  },
});

export default UsingManageScreen;
