import { MotiTransitionProp } from "moti/build/core";
import { Color } from "../constant/color";

export const defaultSkeletonConfig = {
  transition: {
    type: "spring",
    duration: 400,
    delay: 100,
  } satisfies MotiTransitionProp,
  radius: 4,
  colors: [Color["grey100"], Color["grey300"]],
};
