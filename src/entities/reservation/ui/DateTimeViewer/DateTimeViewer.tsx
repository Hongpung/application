import { View, Text, ViewStyle, StyleProp } from "react-native";

import { Color, Icons } from "@hongpung/src/common";
import React, { useCallback } from "react";
import dayjs from "dayjs";

type DateTimeDisplayProps = {
  date?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  style?: StyleProp<ViewStyle> | null;
};

const useDateTimeHelpers = (
  date?: string | null,
  startTime?: string | null,
  endTime?: string | null,
) => {
  const DateString = useCallback(() => {
    if (date) {
      return dayjs(date).format("YYYY.MM.DD (ddd)");
    }
    return "";
  }, [date]);

  const TimeGapText = useCallback(() => {
    if (startTime && endTime) {
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      const timeGap = dayjs()
        .hour(endHour)
        .minute(endMinute)
        .diff(dayjs().hour(startHour).minute(startMinute), "minute");
      const hourGap = Math.floor(timeGap / 60);
      const minuteGap = timeGap % 60;

      return `${hourGap >= 1 ? `${hourGap}시간` : ""}${
        minuteGap > 0 && hourGap >= 1 ? `\n` : ""
      }${minuteGap > 0 ? `${minuteGap}분` : ""}`;
    }
    throw new Error("startTime 또는 endTime이 없습니다.");
  }, [startTime, endTime]);

  return { DateString, TimeGapText };
};

export const DateTimeViewer: React.FC<DateTimeDisplayProps> = ({
  style,
  ...props
}) => {
  const { date, startTime, endTime } = props;

  const { DateString, TimeGapText } = useDateTimeHelpers(
    date,
    startTime,
    endTime,
  );

  return (
    <View
      style={[{ flexDirection: "column", gap: 16, paddingVertical: 12 }, style]}
    >
      <Text
        style={{
          marginHorizontal: 24,
          fontSize: 16,
          fontFamily: "NanumSquareNeo-Regular",
          color: Color["grey500"],
        }}
      >
        예약 일시
      </Text>

      <View
        style={{
          height: 100,
          marginHorizontal: 40,
          padding: 8,
          backgroundColor: Color["grey100"],
          borderRadius: 10,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            paddingHorizontal: 4,
          }}
        >
          {date && (
            <>
              <View
                style={{
                  height: 24,
                  width: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icons
                  name="calendar-outline"
                  size={20}
                  color={Color["grey400"]}
                />
              </View>

              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "NanumSquareNeo-Light",
                  color: Color["grey700"],
                }}
              >
                {DateString()}
              </Text>
            </>
          )}
        </View>

        {startTime && endTime ? (
          <View
            style={{
              flexDirection: "row",
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "NanumSquareNeo-Regular",
                color: Color["grey700"],
              }}
            >{`${startTime}`}</Text>

            <View
              style={{
                width: 64,
                paddingVertical: 8,
                alignItems: "center",
                backgroundColor: "#FFF",
                borderRadius: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "NanumSquareNeo-Light",
                  textAlign: "center",
                  color: Color["grey700"],
                }}
              >
                {TimeGapText()}
              </Text>
            </View>

            <Text
              style={{
                fontSize: 18,
                fontFamily: "NanumSquareNeo-Regular",
                color: Color["grey700"],
              }}
            >{`${endTime}`}</Text>
          </View>
        ) : date ? (
          <View
            style={{
              flexGrow: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "NanumSquareNeo-Light",
                color: Color["grey700"],
              }}
            >
              시간 선택하러 가기
            </Text>
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "NanumSquareNeo-Light",
                color: Color["grey700"],
              }}
            >
              예약 일시 선택하러 가기
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
