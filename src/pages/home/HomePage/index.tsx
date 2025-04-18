import { MainTabScreenProps } from "@hongpung/src/navigation/MainTabNavigation";
import { View } from "react-native";

type HomePageProps = MainTabScreenProps<'Home'>

const HomePage: React.FC<HomePageProps> = ({ navigation }) => {
    return(
        <View>
            
        </View>
    )
}

export default HomePage;
