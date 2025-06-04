import { DescriptionBox } from "@hongpung/src/common";
import { ScrollView } from "react-native";
import { useWithdrawAuth } from "@hongpung/src/features/auth/withdrawAuth/model/useWithdrawAuth";
import { WithdrawalAuthForm } from "@hongpung/src/features/auth/withdrawAuth/ui/WithdrawalAuthForm/WithdrawalAuthForm";
import { useAtomValue } from "jotai";
import { UserStatusState } from "@hongpung/src/entities/member";

const WithdrawalSection: React.FC = () => {
  const loginUser = useAtomValue(UserStatusState);
  const withdrawForm = useWithdrawAuth();

  const descriptions = [
    `${loginUser?.name} 님의 계정을 홍풍에서 삭제해요.`,
    "탈퇴를 원하시면 사용중인 비밀번호와",
    "아래의 확인 문자를 입력해주세요.",
  ];

  return (
    <ScrollView
      style={{ flex: 1 }}
      bounces={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1, gap: 16 }}
    >
      <DescriptionBox descriptions={descriptions} />
      <WithdrawalAuthForm {...withdrawForm} />
    </ScrollView>
  );
};

export default WithdrawalSection;
