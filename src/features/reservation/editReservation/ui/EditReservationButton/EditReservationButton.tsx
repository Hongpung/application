import React from "react";

import { LongButton } from "@hongpung/src/common";

interface EditReservationButtonProps {
  isAgree: boolean;
  onPress: () => void;
}

export const EditReservationButton: React.FC<EditReservationButtonProps> = ({
  isAgree,
  onPress,
}) => {
  return (
    <LongButton
      innerContent="변경하기"
      color="blue"
      isAble={isAgree}
      onPress={onPress}
    />
  );
};
