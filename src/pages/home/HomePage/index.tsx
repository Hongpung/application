import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  InteractionManager,
} from "react-native";
import { NotificationIcon } from "@hongpung/src/widgets/notification";
import { SessionManageBottomSheet } from "@hongpung/src/widgets/session/ui/SessionManageBottomSheet";
import { UseRoomState } from "@hongpung/src/entities/session";
import { useAtom, useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import TodaySchedule from "@hongpung/components/home/TodaySchedule";
import { UserStatusState } from "@hongpung/src/entities/member";
import { myTodayReservationState } from "@hongpung/src/entities/reservation";
import { Color, MainFooter } from "@hongpung/src/common";
import { BannerSlider } from "@hongpung/src/widgets/banner/ui/BannerSlider/BannerSlider";
import { ClubPortalPanel } from "@hongpung/src/widgets/club";
import { NoticePanel } from "@hongpung/src/widgets/notice";
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
    const start = Date.now();
    navigation.navigate("Notification");
    InteractionManager.runAfterInteractions(() => {
      const duration = Date.now() - start;
      console.log(`실제 사용자에게 보이기까지 걸린 시간: ${duration}ms`);
    });
  };

  const navigateToNoticeList = () => {
    const start = Date.now();
    navigation.navigate("Notice", {
      screen: "NoticeList",
    });
    InteractionManager.runAfterInteractions(() => {
      const duration = Date.now() - start;
      console.log(`실제 사용자에게 보이기까지 걸린 시간: ${duration}ms`);
    });
  };

  const navigateToNoticeDetail = (noticeId: number) => {
    const start = Date.now();
    navigation.navigate("Notice", {
      screen: "NoticeDetail",
      params: { noticeId },
    });
    InteractionManager.runAfterInteractions(() => {
      const duration = Date.now() - start;
      console.log(`실제 사용자에게 보이기까지 걸린 시간: ${duration}ms`);
    });
  };

  const navigateToClubHome = () => {
    const start = Date.now();
    navigation.push("Club", { screen: "ClubMain" });
    InteractionManager.runAfterInteractions(() => {
      const duration = Date.now() - start;
      console.log(`실제 사용자에게 보이기까지 걸린 시간: ${duration}ms`);
    });
  };
  const navigateToReservationDetail = (reservationId: number) => {
    const start = Date.now();
    navigation.navigate("Reservation", {
      screen: "ReservationDetail",
      params: { reservationId },
    });
    InteractionManager.runAfterInteractions(() => {
      const duration = Date.now() - start;
      console.log(`실제 사용자에게 보이기까지 걸린 시간: ${duration}ms`);
    });
  };

  const navigateToReservationCalendar = () => {
    const start = Date.now();
    navigation.push("Reservation", { screen: "ReservationCalendar" });
    InteractionManager.runAfterInteractions(() => {
      const duration = Date.now() - start;
      console.log(`실제 사용자에게 보이기까지 걸린 시간: ${duration}ms`);
    });
  };

  const navigateToServiceTerms = () => {
    const start = Date.now();
    navigation.push("WebView", {
      title: "서비스 이용약관",
      url: "https://storage.hongpung.com/terms/%EC%84%9C%EB%B9%84%EC%8A%A4+%EC%9D%B4%EC%9A%A9%EC%95%BD%EA%B4%80.html",
    });
    InteractionManager.runAfterInteractions(() => {
      const duration = Date.now() - start;
      console.log(`실제 사용자에게 보이기까지 걸린 시간: ${duration}ms`);
    });
  };

  const navigateToPrivacyPolicy = () => {
    const start = Date.now();
    navigation.push("WebView", {
      title: "개인정보 처리방침",
      url: "https://storage.hongpung.com/terms/%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%B3%B4+%EC%B2%98%EB%A6%AC%EB%B0%A9%EC%B9%A8.html",
    });
    InteractionManager.runAfterInteractions(() => {
      const duration = Date.now() - start;
      console.log(`실제 사용자에게 보이기까지 걸린 시간: ${duration}ms`);
    });
  };

  const navigateToUsingManage = () => {
    const start = Date.now();
    navigation.navigate("SessionManagement", {
      screen: "SessionManage",
    });
    InteractionManager.runAfterInteractions(() => {
      const duration = Date.now() - start;
      console.log(`실제 사용자에게 보이기까지 걸린 시간: ${duration}ms`);
    });

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
            navigateToReservationDetail={navigateToReservationDetail}
            navigateToReservationCalendar={navigateToReservationCalendar}
          />
          <BannerSlider banners={[]} />
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
          toggleBottomSheet={() => {
            setIsSlideUp(!isSlideUp);
          }}
          isSlideUp={isSlideUp}
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
