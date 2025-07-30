import { ScrollView, View, StyleSheet, Text } from "react-native";

import { useAtomValue } from "jotai";
import dayjs from "dayjs";

import { Color, defaultSkeletonConfig, MainFooter } from "@hongpung/src/common";
import { MainTabScreenProps } from "@hongpung/src/common/navigation";

import { useLoadMyTodayReservationFetch } from "@hongpung/src/entities/reservation";
import { UseRoomState } from "@hongpung/src/entities/session";

import { ClubPortalPanel } from "@hongpung/src/widgets/club";
import { NotificationIcon } from "@hongpung/src/widgets/notification";
import { SessionManageBottomSheet } from "@hongpung/src/widgets/session";
import { NoticePanel } from "@hongpung/src/widgets/notice";
import { BannerSlider } from "@hongpung/src/widgets/banner";

import { TodaySchedulePanel } from "@hongpung/src/widgets/reservation";
import { Skeleton } from "moti/skeleton";
import { debounce } from "lodash";
import { UserStatusState } from "@hongpung/src/entities/member";

const HomePage: React.FC<MainTabScreenProps<"Home">> = ({ navigation }) => {
  const isUsingSession = useAtomValue(UseRoomState);
  const loginUser = useAtomValue(UserStatusState);
  const { data: todayReservationsData, isLoading: isLoadingTodayReservations } =
    useLoadMyTodayReservationFetch();

  const navigateToNotificationPage = () => {
    navigation.navigate("Notification");
  };

  const navigateToNoticeList = () => {
    navigation.navigate("Notice", {
      screen: "NoticeList",
    });
  };

  const navigateToNoticeDetail = debounce(
    (noticeId: number) => {
      navigation.push("Notice", {
        screen: "NoticeList",
      });
      navigation.push("Notice", {
        screen: "NoticeDetail",
        params: { noticeId },
      });
    },
    500,
    {
      leading: true,
      trailing: false,
    },
  );

  const navigateToBannerList = () => {
    navigation.navigate("BannerList");
  };

  const navigateToClubHome = () => {
    navigation.navigate("Club", { screen: "ClubMain" });
  };

  const navigateToReservationDetail = debounce(
    (reservationId: number) => {
      navigation.push("Reservation", {
        screen: "ReservationDetail",
        params: { reservationId },
      });
    },
    500,
    {
      leading: true,
      trailing: false,
    },
  );

  const navigateToReservationCalendar = () => {
    navigation.navigate("Reservation", { screen: "ReservationCalendar" });
  };

  const navigateToServiceTerms = () => {
    navigation.navigate("WebView", {
      title: "서비스 이용약관",
      url: "https://storage.hongpung.com/terms/%EC%84%9C%EB%B9%84%EC%8A%A4+%EC%9D%B4%EC%9A%A9%EC%95%BD%EA%B4%80.html",
    });
  };

  const navigateToPrivacyPolicy = () => {
    navigation.navigate("WebView", {
      title: "개인정보 처리방침",
      url: "https://storage.hongpung.com/terms/%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4+%EC%B2%98%EB%A6%AC%EB%B0%A9%EC%B9%A8.html",
    });
  };

  const navigateToUsingManage = () => {
    navigation.navigate("SessionManage");
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
                {dayjs().format("YYYY년 M월 D일")}
              </Text>
              {isLoadingTodayReservations ? (
                <View>
                  <Skeleton
                    {...defaultSkeletonConfig}
                    width={160}
                    height={28}
                    radius={4}
                  ></Skeleton>
                </View>
              ) : (
                <Text style={styles.greetingText}>
                  {loginUser?.nickname || loginUser?.name}님,{" "}
                  {todayReservationsData && todayReservationsData.length > 0
                    ? "오늘 예약이 있어요!"
                    : `안녕하세요!`}
                </Text>
              )}
            </View>
            <NotificationIcon
              navigateToNotificationPage={navigateToNotificationPage}
            />
          </View>
          <TodaySchedulePanel
            navigateToReservationDetail={navigateToReservationDetail}
            navigateToReservationCalendar={navigateToReservationCalendar}
          />
          <BannerSlider
            onPressIndicator={navigateToBannerList}
            showAllButton={true}
          />
          <ClubPortalPanel navigateToClubHome={navigateToClubHome} />
          <NoticePanel
            navigateToNoticeDetail={navigateToNoticeDetail}
            navigateToNoticeList={navigateToNoticeList}
          />
        </View>
        <MainFooter
          navigateToServiceTerms={navigateToServiceTerms}
          navigateToPrivacyPolicy={navigateToPrivacyPolicy}
        />
      </ScrollView>
      {isUsingSession && (
        <SessionManageBottomSheet
          navigateToUsingManage={navigateToUsingManage}
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
