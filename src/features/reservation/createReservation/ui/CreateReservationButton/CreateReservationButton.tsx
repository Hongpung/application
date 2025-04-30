import React from "react";

import { LongButton } from "@hongpung/src/common";
import { useCreateReservation } from "../../model/useCreateReservation.context";

type CreateReservationButtonProps = {
  isAgree: boolean;
};

export const CreateReservationButton: React.FC<
  CreateReservationButtonProps
> = ({ isAgree }) => {
  const { isValidReservation , requestCreateReservation} = useCreateReservation();

  return (
    <LongButton
      innerContent="예약 확정하기"
      color="blue"
      isAble={isAgree && isValidReservation}
      onPress={requestCreateReservation}
    />
  );
};
