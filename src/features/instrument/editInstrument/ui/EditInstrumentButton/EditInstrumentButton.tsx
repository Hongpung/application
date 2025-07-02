import React from "react";
import { LongButton } from "@hongpung/src/common";

interface EditInstrumentButtonProps {
  onPress: () => void;
}

export const EditInstrumentButton: React.FC<EditInstrumentButtonProps> = ({
  onPress,
}) => {
  return (
    <LongButton
      innerContent="수정하기"
      color="green"
      isAble={true}
      onPress={onPress}
    />
  );
};
