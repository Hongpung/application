import React, { forwardRef } from "react";
import { ScrollView, View, Text, ScrollViewProps } from "react-native";

import { Color, TimeLineArray } from "@hongpung/src/common";

type TimeLineProps = {
  children: React.ReactNode;
} & ScrollViewProps & {
    ref?: React.RefObject<ScrollView>;
  };
/**
 *   AM 10~ PM10까지의 타임 라인(눈금 표시)
 *   children에는 위에 표시할 것들을 삽입
 */
export const TimeLine = forwardRef<ScrollView, TimeLineProps>(
  ({ children, ...rest }, ref) => {
    return (
      <ScrollView
        ref={ref}
        contentContainerStyle={{ flexGrow: 1, backgroundColor: "#FFF" }}
        {...rest}
      >
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
                    paddingHorizontal: 36,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      height: 0,
                      borderWidth: 1,
                      borderStyle: "dotted",
                      borderColor: Color[`grey100`],
                    }}
                  />
                </View>
              )}
            </React.Fragment>
          );
        })}

        {children}
      </ScrollView>
    );
  }
);
