import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ViewToken,
  ViewabilityConfig,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { SessionLog } from "@hongpung/src/entities/session-log";
import { SessionLogCard } from "@hongpung/src/entities/session-log/ui/SessionLogCard/SessionLogCard";
import { Color } from "@hongpung/src/common";
import dayjs from "dayjs";

interface SessionLogListProps {
  sessions: [string, SessionLog[]][];
  onSessionPress: (sessionId: number) => void;
  isLoading?: boolean;
  onViewableItemsChanged?: (info: { viewableItems: ViewToken[] }) => void;
  viewabilityConfig?: ViewabilityConfig;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  ref: React.Ref<FlatList<[string, SessionLog[]]>>;
}

export const SessionLogList: React.FC<SessionLogListProps> = (props) => {
  const {
    sessions,
    onSessionPress,
    isLoading = true,
    onViewableItemsChanged,
    viewabilityConfig,
    onScroll,
    ref,
  } = props;

  const [isScrolling, setIsScrolling] = useState(false);

  const renderItem = ({
    item: [date, sessionList],
  }: {
    item: [string, SessionLog[]];
  }) => {
    const dateString = dayjs(date).format("YYYY.MM.DD (ddd)");

    return (
      <View style={{ gap: 16 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "NanumSquareNeo-Bold",
            color: Color["grey300"],
          }}
        >
          {dateString}
        </Text>
        <View style={{ gap: 8 }}>
          {sessionList?.map((session) => (
            <SessionLogCard
              key={session.sessionId}
              session={session}
              onPress={onSessionPress}
            />
          ))}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Color["blue400"]} />
      </View>
    );
  }

  return (
    <FlatList
      ref={ref}
      style={{ flex: 1 }}
      data={sessions}
      renderItem={renderItem}
      keyExtractor={(item) => item[0]}
      contentContainerStyle={styles.container}
      onViewableItemsChanged={(e) => {
        if (!isScrolling) return;
        onViewableItemsChanged?.(e);
      }}
      viewabilityConfig={viewabilityConfig}
      onScrollBeginDrag={() => setIsScrolling(true)}
      onScroll={onScroll}
      onMomentumScrollEnd={() => setIsScrolling(false)}
      scrollEventThrottle={16}
      ListEmptyComponent={
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "NanumSquareNeo-Regular",
              color: Color["grey400"],
              paddingBottom: "60%",
            }}
          >
            연습 내역이 없어요.
          </Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    gap: 16,
    paddingHorizontal: 24,
  },
});
