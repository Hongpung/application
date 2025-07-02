import React from "react";

import { LongButton } from "@hongpung/src/common";

export const CreateInstrumentButton: React.FC<{ onPress: () => void }> = ({
  onPress,
}) => {
  return (
    <LongButton
      innerContent="악기 추가하기"
      color="blue"
      isAble={true}
      onPress={onPress}
    />
  );
};
