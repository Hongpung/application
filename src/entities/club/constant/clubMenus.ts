import { SubMenu } from "@hongpung/src/common";
import { ClubParamList } from "@hongpung/src/common/navigation";

export const CLUB_MENUS: SubMenu<ClubParamList>[] = [
  { name: "부원 관리", link: "ClubMembers" },
  { name: "악기 관리", link: "ClubInstruments" },
  { name: "연습 기록 보기", link: "ClubLogs" },
]; 