import React from "react";

import { LongButton } from "@hongpung/src/common";

interface LogoutButtonProps {
  onPress: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ onPress }) => {
  return (
    <LongButton
      color="red"
      innerContent="로그아웃"
      isAble={true}
      onPress={onPress}
    />
  );
};
