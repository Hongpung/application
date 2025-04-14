import { Session } from "@hongpung/src/entities/session";
import { PhotoFileFormat } from "@hongpung/src/common/types/PhotoFileFormat";
import { josa } from "es-hangul";

interface UseCameraGuideTextProps {
  session: Session;
  photos: PhotoFileFormat[];
  shootingCount: number;
}

export const useCameraGuideText = ({
  session,
  photos,
  shootingCount,
}: UseCameraGuideTextProps) => {
  const getGuideText = () => {
    if (session?.borrowInstruments && session.borrowInstruments.length > photos.length) {
      return `${josa(session.borrowInstruments[photos.length].name, "을/를")} 촬영해주세요.`;
    }
    if (photos.length === shootingCount - 2) {
      return "연습실 전체가 보이게 촬영해주세요";
    }
    if (photos.length === shootingCount - 1) {
      return "제습기를 비우고 가동하는 모습을 촬영해주세요";
    }
    return "";
  };

  return {
    guideText: getGuideText(),
  };
}; 