import { MainTabScreenProps } from "@hongpung/src/navigation/MainTabNavigation";
import { ScrollView, View, StyleSheet, Text } from "react-native";
import { NotificationIcon } from "@hongpung/src/features/notification/notReadNotification/ui/NotificationIcon/NotificationIcon";
import { SessionManageBottomSheet } from "@hongpung/src/widgets/session/ui/SessionManageBottomSheet";
import { UseRoomState } from "@hongpung/src/entities/session";
import { useRecoilState, useRecoilValue } from "recoil";
import { useMemo, useState } from "react";
import TodaySchedule from "@hongpung/components/home/TodaySchedule";
import { UserStatusState } from "@hongpung/src/entities/member";
import { myTodayReservationState } from "@hongpung/src/entities/reservation";
import { Color } from "@hongpung/src/common";
import { BannerSlider } from "@hongpung/src/widgets/banner/ui/BannerSlider/BannerSlider";
import { ClubPortalPanel } from "@hongpung/src/widgets/club/ui/ClubPortalPanel/ClubPortalPanel";
import NoticePanel from "@hongpung/src/widgets/notice/ui/NoticePanel/NoticePanel";
import { useNoticePanel } from "@hongpung/src/widgets/notice/model/useNoticePanel";
import MainFooter from "@hongpung/src/common/ui/MainFooter/MainFooter";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

type HomePageProps = MainTabScreenProps<"Home">;

const HomePage: React.FC<HomePageProps> = ({ navigation }) => {
  const tabBarHeight = useBottomTabBarHeight();
  const isUsingSession = useRecoilValue(UseRoomState);
  const loginUser = useRecoilValue(UserStatusState);
  const today = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);
  const { noticeList, isLoading } = useNoticePanel();
  const [todayReservationsData, setTodayReservations] = useRecoilState(
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
          navigateToServiceTerms={function (): void {
            throw new Error("Function not implemented.");
          }}
          navigateToPrivacyPolicy={function (): void {
            throw new Error("Function not implemented.");
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
