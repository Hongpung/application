import { ScrollView, View, StyleSheet, Text } from "react-native";
import { NotificationIcon } from "@hongpung/src/features/notification/notReadNotification/ui/NotificationIcon/NotificationIcon";
import { SessionManageBottomSheet } from "@hongpung/src/widgets/session/ui/SessionManageBottomSheet";
import { UseRoomState } from "@hongpung/src/entities/session";
import { useAtom, useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import TodaySchedule from "@hongpung/components/home/TodaySchedule";
import { UserStatusState } from "@hongpung/src/entities/member";
import { myTodayReservationState } from "@hongpung/src/entities/reservation";
import { Color, MainFooter } from "@hongpung/src/common";
import { BannerSlider } from "@hongpung/src/widgets/banner/ui/BannerSlider/BannerSlider";
import { ClubPortalPanel } from "@hongpung/src/widgets/club/ui/ClubPortalPanel/ClubPortalPanel";
import NoticePanel from "@hongpung/src/widgets/notice/ui/NoticePanel/NoticePanel";
import { useNoticePanel } from "@hongpung/src/widgets/notice/model/useNoticePanel";
import { MainTabScreenProps } from "@hongpung/src/common/navigation";

const HomePage: React.FC<MainTabScreenProps<"Home">> = ({ navigation }) => {
  const isUsingSession = useAtomValue(UseRoomState);
  const loginUser = useAtomValue(UserStatusState);
  const today = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);
  const { noticeList, isLoading } = useNoticePanel();
  const [todayReservationsData, setTodayReservations] = useAtom(
    myTodayReservationState
  );
  const [isSlideUp, setIsSlideUp] = useState(false);
  const navigateToNotificationPage = () => {
    navigation.navigate("Notification");
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        contentContainerStyle={{
          flexGrow: 1,
          gap: 24,
          backgroundColor: "#FFF",
        }}
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: 24,
            gap: 24,
            backgroundColor: "#FFF",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: 24,
            }}
          >
            <View style={styles.text}>
              <Text style={styles.dateText}>
                {today.split("-")[0]}년 {today.split("-")[1]}월{" "}
                {today.split("-")[2]}일
              </Text>
              <Text style={styles.greetingText}>
                {loginUser?.nickname || loginUser?.name}님,{" "}
                {todayReservationsData && todayReservationsData.length > 0
                  ? "오늘 예약이 있어요!"
                  : `안녕하세요!`}
              </Text>
            </View>
            <NotificationIcon
              navigateToNotificationPage={navigateToNotificationPage}
            />
          </View>
          <TodaySchedule
            navigateToReservationDetail={(reservationId: number) => {
              navigation.navigate("Reservation", {
                screen: "ReservationDetail",
                params: { reservationId },
              });
            }}
            navigateToReservationCalendar={() => {
              navigation.push("Reservation", {
                screen: "ReservationCalendar",
              });
            }}
          />
          <BannerSlider banners={[]} />
          <ClubPortalPanel
            navigateToClubHome={() => {
              navigation.push("Club", { screen: "ClubMain" });
            }}
          />
          <NoticePanel
            noticeList={noticeList ?? []}
            isLoading={isLoading}
            navigateToNoticeDetail={function (noticeId: number): void {
              throw new Error("Function not implemented.");
            }}
            navigateToNoticeList={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        </View>
        <MainFooter
          navigateToServiceTerms={(): void => {
            navigation.push("WebView", {
              title: "서비스 이용약관",
              url: "https://storage.hongpung.com/terms/%EC%84%9C%EB%B9%84%EC%8A%A4+%EC%9D%B4%EC%9A%A9%EC%95%BD%EA%B4%80.html",
            });
          }}
          navigateToPrivacyPolicy={(): void => {
            navigation.push("WebView", {
              title: "개인정보 처리방침",
              url: "https://storage.hongpung.com/terms/%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4+%EC%B2%98%EB%A6%AC%EB%B0%A9%EC%B9%A8.html",
            });
          }}
        />
      </ScrollView>
      {isUsingSession && (
        <SessionManageBottomSheet
          toggleBottomSheet={() => {
            setIsSlideUp(!isSlideUp);
          }}
          isSlideUp={isSlideUp}
          navigateToUsingManage={() => {
            navigation.navigate("SessionManagement", {
              screen: "SessionManage",
            });
          }}
        />
      )}
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  text: {
    flexDirection: "column",
    gap: 8,
    alignItems: "flex-start",
    paddingHorizontal: 4,
  },
  greetingText: {
    position: "relative",
    textAlign: "right",
    color: Color["grey800"],
    fontSize: 18,
    fontFamily: "NanumSquareNeo-Bold",
  },
  dateText: {
    position: "relative",
    color: Color["grey800"],
    fontSize: 14,
    fontFamily: "NanumSquareNeo-Regular",
    lineHeight: 16,
  },
});
