import { LongButton } from "@hongpung/src/common";

type PermissionButtonProps = {
  onPress: () => void;
};

const PermissionButton: React.FC<PermissionButtonProps> = ({ onPress }) => {
  return (
    <LongButton
      innerContent={"계속하기"}
      color={"blue"}
      isAble={true}
      onPress={onPress}
    />
  );
};

export default PermissionButton;
