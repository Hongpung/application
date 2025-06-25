import { Modal, Pressable, View, Text, StyleSheet } from "react-native";

import { useAtomValue } from "jotai";

import { Input, Color, ShortButton, Icons } from "@hongpung/src/common";

import { UserStatusState } from "@hongpung/src/entities/member";

import { useEditPersonalInfo } from "@hongpung/src/features/member/changeProfile";

const CANT_CHANGE_INFO_TEXT =
  "이름, 동아리, 이메일 등 변경 불가능한 정보는 의장에게 문의해주세요.";

interface EditPersonalInfoModalProps {
  onClose: () => void;
  onConfirm: (data: {
    nickname: string | undefined;
    enrollmentNumber: string;
  }) => void;
  initialValues: {
    nickname: string | undefined;
    enrollmentNumber: string;
  };
}

export const EditPersonalInfoModal: React.FC<EditPersonalInfoModalProps> = ({
  onClose,
  onConfirm,
  initialValues,
}) => {
  const {
    nickname: initialNickname,
    enrollmentNumber: initialEnrollmentNumber,
  } = initialValues;
  const loginUser = useAtomValue(UserStatusState);

  const {
    nickname,
    enrollmentNumber,
    setNickname,
    setEnrollmentNumber,
    nicknameValidation,
    enrollmentNumberValidation,
    validateNickname,
    validateEnrollmentNumber,
  } = useEditPersonalInfo({
    initialValues: {
      nickname: initialNickname,
      enrollmentNumber: initialEnrollmentNumber,
    },
  });

  const onReset = () => {
    if (loginUser) {
      onConfirm({
        nickname: loginUser.nickname,
        enrollmentNumber: loginUser.enrollmentNumber,
      });
    }
  };

  return (
    <Modal transparent={true} visible={true} key={"editPersonalModal"}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
        }}
        onPress={onClose}
      >
        <Pressable
          style={{
            marginHorizontal: 12,
            backgroundColor: "#FFF",
            borderRadius: 12,
            paddingBottom: 12,
            paddingTop: 28,
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={[styles.title, { color: "#000" }]}>개인정보 변경</Text>
            <View
              style={{ gap: 8, paddingHorizontal: 12, paddingVertical: 24 }}
            >
              <Input
                label="패명"
                color="green"
                inputValue={nickname || ""}
                setInputValue={(value) => setNickname(value)}
                validationCondition={nicknameValidation}
                onBlur={validateNickname}
              />
              <Input
                label="학번"
                requireMark={true}
                inputValue={enrollmentNumber ?? ""}
                setInputValue={(value) => setEnrollmentNumber(value)}
                color={"green"}
                isRequired
                keyboardType="number-pad"
                maxLength={2}
                validationCondition={enrollmentNumberValidation}
                onBlur={validateEnrollmentNumber}
              />
            </View>
          </View>

          <View style={{ gap: 12 }}>
            <View
              style={{
                flexDirection: "row",
                gap: 12,
                justifyContent: "center",
                paddingHorizontal: 20,
              }}
            >
              <ShortButton
                innerContent={"되돌리기"}
                isFilled={false}
                color={"blue"}
                onPress={onReset}
              />
              <ShortButton
                innerContent={"변경하기"}
                isFilled={true}
                isAble={
                  nicknameValidation.state === "VALID" &&
                  enrollmentNumberValidation.state === "VALID"
                }
                color={"blue"}
                onPress={() => onConfirm({ nickname, enrollmentNumber })}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 2,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icons
                name="alert-circle-outline"
                size={16}
                color={Color["grey400"]}
              />
              <Text
                style={{
                  color: Color["grey400"],
                  fontSize: 11,
                  fontFamily: "NanumSquareNeo-Regular",
                }}
              >
                {CANT_CHANGE_INFO_TEXT}
              </Text>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontFamily: "NanumSquareNeo-Bold",
    color: Color["grey400"],
    textAlign: "left",
  },
  detailContainer: {
    paddingHorizontal: 16,
    marginHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 16,
    color: Color["grey400"],
    fontFamily: "NanumSquareNeo-Light",
    textAlign: "left",
  },
  detailValue: {
    fontSize: 16,
    fontFamily: "NanumSquareNeo-Regular",
    textAlign: "right",
  },
});
