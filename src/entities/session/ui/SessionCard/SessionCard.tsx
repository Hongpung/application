import { Session } from "../../model/type";
import { Color, Icons } from "@hongpung/src/common";
import { BlurView } from "expo-blur";
import {
  View,
  Pressable,
  Text,
  Dimensions,
  StyleSheet,
  Animated,
} from "react-native";
import React, { useEffect, useRef } from "react";

type SessionCardProps = {
  session: Session;
  navigateToDetail: (reservationId: number) => void;
};

const SessionCard: React.FC<SessionCardProps> = (props) => {
  const { session, navigateToDetail: onNavigateDetail } = props;

  const isPlayed = session?.status === "ONAIR" || false;
  const isAfter = session?.status === "AFTER";
  const color =
    session.sessionType === "RESERVED" && session?.reservationType === "REGULAR"
      ? "blue"
      : session.participationAvailable
        ? "green"
        : "red";
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.4,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.99,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, [opacity, scale]);

  return (
    <View>
      <View>
        {isPlayed && (
          <Animated.View
            style={[styles.playedOverlay, { opacity, transform: [{ scale }] }]}
          >
            <View
              style={[
                styles.playedBackground,
                { backgroundColor: Color[`${color}100`] },
              ]}
            />
            <View
              style={[
                styles.playedBackgroundNeon,
                { backgroundColor: Color[`${color}500`] },
              ]}
            />
            <BlurView
              experimentalBlurMethod="dimezisBlurView"
              intensity={6}
              tint="default"
              style={styles.blurView}
            />
          </Animated.View>
        )}

        {session.sessionType === "RESERVED" ? (
          <Pressable
            key={session.sessionId}
            style={[styles.reservedCard, { width: width - 48 }]}
            onPress={() => {
              onNavigateDetail(session.reservationId);
            }}
          >
            {session.reservationType === "REGULAR" ? (
              <View style={styles.bookmarkIcon}>
                <Icons
                  size={52}
                  name={"bookmark-sharp"}
                  color={Color["blue500"]}
                />
              </View>
            ) : (
              <View style={styles.creatorInfo}>
                <Text style={styles.creatorName}>{session.creatorName}</Text>
                {session.creatorNickname && (
                  <Text style={styles.creatorNickname}>
                    {session.creatorNickname}
                  </Text>
                )}
              </View>
            )}

            {session.status === "AFTER" ? (
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>종료됨</Text>
              </View>
            ) : (
              session.status === "DISCARDED" && (
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>취소됨</Text>
                </View>
              )
            )}

            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.sessionTitle}
            >
              {session.title}
            </Text>

            <View style={styles.sessionFooter}>
              {session.status === "DISCARDED" ? (
                <Text style={styles.sessionTime}>
                  {session.startTime} ~ --:--
                </Text>
              ) : (
                <Text
                  style={styles.sessionTime}
                >{`${session.startTime} ~ ${session.endTime}`}</Text>
              )}
              {session.reservationType !== "EXTERNAL" ? (
                <View style={styles.participators}>
                  <Icons size={24} name={"people"} color={Color["grey300"]} />
                  <Text style={styles.participatorsCount}>
                    {session.participators.length}
                  </Text>
                </View>
              ) : (
                <Text style={styles.externalUsage}>외부 인원 사용</Text>
              )}
            </View>
          </Pressable>
        ) : (
          <View
            key={session.sessionId}
            style={[styles.liveSessionCard, { width: width - 48 }]}
          >
            <View style={styles.creatorInfo}>
              <Text style={styles.creatorName}>{session.creatorName}</Text>
              {session.creatorNickname && (
                <Text style={styles.creatorNickname}>
                  {session.creatorNickname}
                </Text>
              )}
            </View>
            {session.status === "AFTER" && (
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>종료됨</Text>
              </View>
            )}
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                styles.sessionTitle,
                { color: isAfter ? Color["grey400"] : "black" },
              ]}
            >
              {session.title}
            </Text>
            <View style={styles.sessionFooter}>
              <Text
                style={styles.sessionTime}
              >{`${session.startTime} ~ ${session.endTime}`}</Text>
              <Text style={styles.liveReservation}>실시간 예약</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default React.memo(SessionCard);

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  playedOverlay: {
    position: "absolute",
    borderRadius: 10,
    height: "100%",
    width: width,
  },
  playedBackground: {
    position: "absolute",
    borderRadius: 10,
    height: "100%",
    left: -6,
    width: width - 36,
    overflow: "hidden",
  },
  playedBackgroundNeon: {
    position: "absolute",
    left: -2,
    top: 6,
    borderRadius: 10,
    height: 204,
    width: width - 44,
    overflow: "hidden",
  },
  blurView: {
    borderRadius: 10,
    height: "100%",
    width: width - 32,
    left: -8,
    overflow: "hidden",
  },
  reservedCard: {
    marginVertical: 8,
    height: 200,
    borderWidth: 1,
    backgroundColor: "#FFF",
    borderColor: Color["grey200"],
    borderRadius: 10,
  },
  bookmarkIcon: {
    position: "absolute",
    height: 56,
    width: 48,
    right: 20,
    top: -4,
  },
  creatorInfo: {
    position: "absolute",
    right: 20,
    top: 24,
    alignItems: "flex-end",
  },
  creatorName: {
    textAlign: "right",
    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 16,
    color: Color["grey700"],
  },
  creatorNickname: {
    textAlign: "right",
    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 12,
    color: Color["grey400"],
  },
  statusBadge: {
    position: "absolute",
    left: 12,
    bottom: 12,
  },
  statusText: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 12,
    color: Color["grey500"],
    backgroundColor: Color["grey100"],
    borderRadius: 5,
    padding: 6,
    marginLeft: 4,
  },
  sessionTitle: {
    fontFamily: "NanumSquareNeo-Bold",
    marginHorizontal: 64,
    top: 72,
    textAlign: "center",
    fontSize: 20,
  },
  sessionFooter: {
    position: "absolute",
    right: 24,
    bottom: 12,
    alignItems: "flex-end",
    gap: 4,
  },
  sessionTime: {
    textAlign: "right",
    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 14,
    color: Color["grey400"],
  },
  participators: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  participatorsCount: {
    textAlign: "right",
    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 14,
    color: Color["grey400"],
  },
  externalUsage: {
    textAlign: "right",
    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 14,
    color: Color["grey400"],
  },
  liveSessionCard: {
    marginVertical: 8,
    height: 200,
    borderWidth: 1,
    backgroundColor: "#FFF",
    borderColor: Color["grey200"],
    borderRadius: 10,
  },
  liveReservation: {
    textAlign: "right",
    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 14,
    color: Color["grey400"],
  },
});
