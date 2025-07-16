import { Session } from "@hongpung/src/entities/session";
import { josa } from "es-hangul";

interface UseCameraGuideTextProps {
  session: Session;
  photoLength: number;
  demadingPhotoCount: number;
}

export const useCameraGuideText = ({
  session,
  photoLength,
  demadingPhotoCount,
}: UseCameraGuideTextProps) => {
  const getGuideText = () => {
    if (
      session?.borrowInstruments &&
      session.borrowInstruments.length > photoLength
    ) {
      return `${josa(session.borrowInstruments[photoLength].name, "을/를")} 촬영해주세요.`;
    }
    if (photoLength === demadingPhotoCount - 2) {
      return "연습실 전체가 보이게 촬영해주세요";
    }
    if (photoLength === demadingPhotoCount - 1) {
      return "제습기를 비우고 가동하는 모습을 촬영해주세요";
    }
    return "";
  };

  return {
    guideText: getGuideText(),
  };
};
