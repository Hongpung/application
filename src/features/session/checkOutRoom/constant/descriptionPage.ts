import { PageContent } from "@hongpung/src/common/types/PageContent";

export const INSTRUMENT_PAGES: PageContent[] = [
  {
    lottieSource: require("@hongpung/assets/lotties/Instrument.json"),
    description: "사용한 악기를 제자리에 돌려놓고 찍어주세요",
    speed: 1,
  },
  {
    lottieSource: require("@hongpung/assets/lotties/Trash.json"),
    description: "바닥을 정리하고 섭취한 음료들을\n버리고 연습실을 찍어주세요",
    speed: 1.6,
  },
  {
    lottieSource: require("@hongpung/assets/lotties/Dehumidifier.json"),
    description: "제습기를 비우고 다시 틀어주세요\n이 세가지 사진을 보여주세요",
    speed: 1.6,
  },
];

export const NO_INSTRUMENT_PAGES: PageContent[] = [
  {
    lottieSource: require("@hongpung/assets/lotties/Trash.json"),
    description: "바닥을 정리하고 섭취한 음료들을\n버리고 연습실을 찍어주세요",
    speed: 1.6,
  },
  {
    lottieSource: require("@hongpung/assets/lotties/Dehumidifier.json"),
    description:
      "제습기를 비우고 다시 틀어주세요\n이 두 가지 사진을 보여주세요",
    speed: 0.8,
  },
];
