import { View } from "react-native";

interface SpaceProps {
  height: number;
  backgroundColor?: string;
}

export const Space : React.FC<SpaceProps> = ({ height, backgroundColor }) => {
  return <View style={{ height, backgroundColor: backgroundColor || "transparent" }} />;
};