import { Color } from "@hongpung/src/common";
import { Member } from "@hongpung/src/entities/member/@x/reservation";
import { View, Text, Image } from "react-native";

type ParticipatorsViewerProps = {
  participators: Member[];
};

export const ParticipatorsViewer: React.FC<ParticipatorsViewerProps> = (
  props
) => {
  const { participators } = props;

  return (
    <View>
      {participators.length > 0 ? (
        <View
          style={{
            justifyContent: "flex-end",
            borderRadius: 10,
            height: 72,
            backgroundColor: Color["grey200"],
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                flex: 1,
                paddingVertical: 8,
                paddingHorizontal: 12,
              }}
            >
              {participators.slice(0, 5).map((member, index, array) =>
                member.profileImageUrl ? (
                  <View
                    key={member.memberId}
                    style={{
                      width: 42,
                      height: 56,
                      marginLeft:
                        index === 0
                          ? 0
                          : array.length === 4
                            ? -12
                            : array.length === 5
                              ? -16
                              : -8,
                      borderRadius: 5,
                      overflow: "hidden",
                      backgroundColor: Color["grey300"],
                      borderColor: Color["grey200"],
                      borderWidth: 1,
                    }}
                  >
                    <Image
                      key={member.memberId}
                      source={{ uri: member.profileImageUrl }}
                      style={{
                        width: "100%",
                        height: "100%",
                        zIndex: 5
                      }}
                    />
                  </View>
                ) : (
                  <View
                    key={member.memberId}
                    style={{
                      width: 42,
                      height: 56,
                      marginLeft:
                        index === 0
                          ? 0
                          : array.length === 4
                            ? -12
                            : array.length === 5
                              ? -16
                              : -8,
                              
                      overflow: "hidden",
                      backgroundColor: Color["grey300"],
                      borderColor: Color["grey200"],
                      borderWidth: 1,
                      borderRadius: 5,
                    }}
                  />
                )
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "flex-end",
                flex: 1,
                bottom: 12,
                gap: 8,
                paddingHorizontal: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "NanumSquareNeo-Bold",
                  color: Color["grey400"],
                }}
                numberOfLines={1}
              >
                {participators
                  .slice(0, 2)
                  .map((user) => `${user.name}`)
                  .filter(Boolean)
                  .join(", ")}
                {participators.length >= 3 && `등`}
              </Text>

              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: "NanumSquareNeo-Bold",
                    color: Color["blue500"],
                  }}
                >
                  {participators.length}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "NanumSquareNeo-Bold",
                    color: Color["grey700"],
                  }}
                >
                  {` 명`}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            borderWidth: 4,
            height: 72,
            borderColor: Color["grey200"],
            borderStyle: "dashed",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "NanumSquareNeo-Bold",
              color: Color["grey300"],
            }}
          >
            추가 참여자가 없습니다.
          </Text>
        </View>
      )}
    </View>
  );
};
