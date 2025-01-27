import ActivitiesScreen from "@hongpung/_unused/ExtaraActivities/ActivitiesListScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const ExtraActivitiesStack = createNativeStackNavigator();

const ExtraActivitiesStacks = () => {
    return (
        <ExtraActivitiesStack.Navigator initialRouteName="ActivitiesList" screenOptions={{ headerShown: false, animationDuration: 100, animation: 'slide_from_right' }}>
            <ExtraActivitiesStack.Screen
                name='ActivitiesList'
                component={ActivitiesScreen}
            />
        </ExtraActivitiesStack.Navigator>
    );
};

export default ExtraActivitiesStacks;