import { Modal, Pressable, View, Text, StyleSheet } from "react-native";

import { useAtomValue } from "jotai";

import { Input, Color, ShortButton } from "@hongpung/src/common";

import { UserStatusState } from "@hongpung/src/entities/member";

import { useEditSNSAdress } from "@hongpung/src/features/member/changeProfile";

interface EditSNSAddressModalProps {
  initialValues: {
    instagramUrl?: string;
    blogUrl?: string;
  };
  onClose: () => void;
  onConfirm: (data: { instagramUrl?: string; blogUrl?: string }) => void;
}

export const EditSNSAddressModal: React.FC<EditSNSAddressModalProps> = ({
  initialValues,
  onClose,
  onConfirm,
}) => {
  const loginUser = useAtomValue(UserStatusState);
  const { instagramUrl: initialInstagramUrl, blogUrl: initialBlogUrl } =
    initialValues;

  const {
    instagramUrl,
    blogUrl,
    setInstagramUrl,
    setBlogUrl,
    instagramUrlValidation,
    blogUrlValidation,
    validateInstagramUrl,
    validateBlogUrl,
  } = useEditSNSAdress({
    initialValues: {
      instagramUrl: initialInstagramUrl,
      blogUrl: initialBlogUrl,
    },
  });

  const onReset = () => {
    if (loginUser) {
      onConfirm({
        instagramUrl: loginUser.instagramUrl,
        blogUrl: loginUser.blogUrl,
      });
    }
  };
  return (
    <Modal transparent={true} visible={true} key={"editSNSAddressModal"}>
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
            paddingVertical: 28,
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={[styles.title, { color: "#000" }]}>SNS 주소 변경</Text>
            <View
              style={{ gap: 8, paddingHorizontal: 12, paddingVertical: 24 }}
            >
              <Input
                label="인스타그램"
                color="green"
                placeholder="instagram의 아이디를 입력해주세요."
                inputValue={instagramUrl || ""}
                setInputValue={setInstagramUrl}
                validationCondition={instagramUrlValidation}
                onBlur={validateInstagramUrl}
              />
              <Input
                label="블로그"
                color="green"
                placeholder="블로그 주소를 입력해주세요."
                inputValue={blogUrl || ""}
                setInputValue={setBlogUrl}
                validationCondition={blogUrlValidation}
                onBlur={validateBlogUrl}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: 12,
              justifyContent: "center",
              paddingHorizontal: 20,
            }}
          >
            <ShortButton
              innerContent={"초기화"}
              isFilled={false}
              color={"blue"}
              onPress={onReset}
            />
            <ShortButton
              innerContent={"저장하기"}
              isFilled={true}
              color={"blue"}
              onPress={() => onConfirm({ instagramUrl, blogUrl })}
            />
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
