import React from "react";
import { LongButton } from "@hongpung/src/common";

interface DeleteReservationButtonProps {
  onButtonPressed: () => void;
}

export const DeleteReservationButton: React.FC<
  DeleteReservationButtonProps
> = ({ onButtonPressed }) => {
  return (
    <LongButton
      innerContent="취소하기"
      color="red"
      isAble={true}
      onPress={onButtonPressed}
    />
  );
};
