import { TextInput, Text, View } from "react-native";

import { useAtomValue } from "jotai";

import { Color } from "@hongpung/src/common";
import { UserStatusState } from "@hongpung/src/entities/member";

type TitleInputProps = {
  title?: string;
  setTitle: (newTitle: string) => void;
};

export const TitleInput: React.FC<TitleInputProps> = ({ title, setTitle }) => {
  const userStatus = useAtomValue(UserStatusState);

  return (
    <View>
      <View style={{ marginHorizontal: 24 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "NanumSquareNeo-Regular",
            color: Color["grey500"],
          }}
        >
          예약명
        </Text>
        <View
          style={{ marginTop: 20, marginHorizontal: 16, borderBottomWidth: 1 }}
        >
          <TextInput
            style={{ marginHorizontal: 12, paddingVertical: 4, fontSize: 16 }}
            textAlign="right"
            placeholder={`${userStatus?.nickname ? userStatus.nickname : userStatus?.name}의 연습`}
            value={title}
            onChangeText={setTitle}
          />
        </View>
      </View>
    </View>
  );
};
