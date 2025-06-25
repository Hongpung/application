import React from "react";

import { LongButton } from "@hongpung/src/common";

interface BorrowInstrumentsConfirmButtonProps {
  borrowInstrumentsLength: number;
  onPress: () => void;
}

export const BorrowInstrumentsConfirmButton: React.FC<
  BorrowInstrumentsConfirmButtonProps
> = ({ borrowInstrumentsLength, onPress }) => {
  return (
    <LongButton
      color="blue"
      isAble={true}
      innerContent={`선택완료 (${borrowInstrumentsLength} 개)`}
      onPress={onPress}
    />
  );
};
