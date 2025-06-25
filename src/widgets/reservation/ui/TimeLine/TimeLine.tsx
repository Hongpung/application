import React from "react";
import {
  ScrollView,
  View,
  Text,
  ScrollViewProps,
  RefreshControl,
} from "react-native";

import { Color, DeferredComponent, TimeLineArray } from "@hongpung/src/common";

import { ReservationCardSkeleton } from "@hongpung/src/entities/reservation";

type TimeLineProps = {
  children: React.ReactNode;
  isLoading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  ref?: React.Ref<ScrollView>;
} & ScrollViewProps;

export const TimeLine: React.FC<TimeLineProps> = ({
  children,
  refreshing,
  onRefresh,
  isLoading,
  ref,
  ...rest
}) => {
  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          colors={[Color["blue500"], Color["blue300"]]}
          tintColor={Color["blue200"]}
          titleColor={Color["blue100"]}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      ref={ref}
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "#FFF",
      }}
      {...rest}
    >
      {isLoading && (
        <DeferredComponent delay={120}>
          {Array.from({ length: 3 }).map((_, index) => {
            const cardTopPosition = 12 + index * (80 + 40);
            const cardHeight = Math.random() > 0.5 ? 80 : 120;
            return (
              <ReservationCardSkeleton
                key={index + "-reservation-skeleton-container"}
                style={{
                  top: cardTopPosition,
                  height: cardHeight,
                  marginHorizontal: 36,
                  zIndex: 1000,
                }}
              />
            );
          })}
        </DeferredComponent>
      )}
      {TimeLineArray.map((time, index) => {
        return (
          <React.Fragment key={time}>
            <View
              key={time + "over"}
              style={{
                flexDirection: "row",
                paddingHorizontal: 24,
                alignItems: "center",
                height: 24,
                opacity: refreshing ? 0.5 : 1,
              }}
            >
              <View
                style={{
                  height: 1,
                  backgroundColor: Color["grey200"],
                  overflow: "visible",
                  flex: 1,
                }}
              />
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 16,
                  width: 56,
                  textAlign: "center",
                  color: Color[`grey300`],
                  fontFamily: "NanumSquareNeo-Regular",
                }}
              >
                {time}
              </Text>
              <View
                style={{
                  height: 1,
                  backgroundColor: Color["grey200"],
                  overflow: "visible",
                  flex: 1,
                }}
              />
            </View>

            {index < TimeLineArray.length - 1 && (
              <View
                key={time + "under"}
                style={{
                  height: 56,
                  display: "flex",
                  paddingHorizontal: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: refreshing ? 0.5 : 1,
                }}
              >
                <View
                  style={{
                    height: 0,
                    width: "100%",
                    borderWidth: 0.5,
                    borderStyle: "dotted",
                    borderColor: Color["grey200"],
                    opacity: 0.5,
                  }}
                />
              </View>
            )}
          </React.Fragment>
        );
      })}

      {!refreshing && children}
    </ScrollView>
  );
};
