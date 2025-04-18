import { SubMenu } from "@hongpung/src/common";
import { ClubStackParamList } from "@hongpung/src/navigation/ClubStackNavigation";

export const CLUB_MENUS: SubMenu<ClubStackParamList>[] = [
  { name: "부원 관리", link: "ClubMembers" },
  { name: "악기 관리", link: "ClubInstruments" },
  { name: "연습 기록 보기", link: "ClubLogs" },
]; 