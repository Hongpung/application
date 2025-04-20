import { MainTabScreenProps } from "@hongpung/src/navigation/MainTabNavigation";
import { View } from "react-native";
import { NotificationIcon } from "@hongpung/src/features/notification/notReadNotification/ui/NotificationIcon/NotificationIcon";
import { SessionManageBottomSheet } from "@hongpung/src/widgets/session/ui/SessionManageBottomSheet";
type HomePageProps = MainTabScreenProps<"Home">;

const HomePage: React.FC<HomePageProps> = ({ navigation }) => {
  const navigateToNotificationPage = () => {
    navigation.navigate("Notification");
  };

  return (
    <View>
      <NotificationIcon
        navigateToNotificationPage={navigateToNotificationPage}
      />
      <SessionManageBottomSheet
        toggleBottomSheet={function (): void {
          throw new Error("Function not implemented.");
        }}
        isSlideUp={false}
        navigateToUsingManage={() => {
          navigation.navigate("SessionManagement", {
            screen: "SessionManage",
          });
        }}
      />
    </View>
  );
};

export default HomePage;
