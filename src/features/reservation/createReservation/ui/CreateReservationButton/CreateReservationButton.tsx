import React from "react";

import { LongButton } from "@hongpung/src/common";
import { useCreateReservation } from "../../model/useCreateReservation.context";

type CreateReservationButtonProps = {
  isAgree: boolean;
  navigateToConfirmScreen: () => void;
};

export const CreateReservationButton: React.FC<
  CreateReservationButtonProps
> = ({ isAgree, navigateToConfirmScreen }) => {
  const { isValidReservation } = useCreateReservation();

  return (
    <LongButton
      innerContent="예약하기"
      color="blue"
      isAble={isAgree && isValidReservation}
      onPress={navigateToConfirmScreen}
    />
  );
};
