import { SubMenu } from "@hongpung/src/common";

type SettingParamList = {
  NotificationSetting: undefined;
  LoginSetting: undefined;
};

export const SETTING_MENUS: SubMenu<SettingParamList>[] = [
  { name: "알림 설정", link: "NotificationSetting" },
  { name: "로그인 설정", link: "LoginSetting" },
];
