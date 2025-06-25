import { SubMenu } from "@hongpung/src/common";
import { MainStackParamList } from "@hongpung/src/common/navigation";

export const MY_ACTIVITIE_MENUS: SubMenu<MainStackParamList>[] = [
  { name: "다가오는 일정", link: "UpComingReservation" },
  { name: "내 활동", link: "MyLog" },
];
