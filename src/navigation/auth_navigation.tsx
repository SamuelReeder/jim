import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import LandingScreen from '../screens/landing';
import CreateUsernameScreen from '../screens/create_username';
import LogInScreen from '../screens/log_in';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { PageLoader } from '../components/page_loader';


type RootStackParamList = {
    Landing: undefined,
    LogIn: undefined;
    CreateUsername: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootStack = () => {

    const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
    let route: keyof RootStackParamList;

    useEffect(() => {
        AsyncStorage.getItem('alreadyLaunched').then((value) => {
            if (value == null) {
                AsyncStorage.setItem('alreadyLaunched', 'true'); // No need to wait for `setItem` to finish, although you might want to handle errors
                setIsFirstLaunch(true);
            } else {
                setIsFirstLaunch(false);
            }
        }).catch(error => {
            console.log("Could not retrieve async data", error);
        }); // Add some error handling, also you can simply do setIsFirstLaunch(null)

    }, []);

    if (isFirstLaunch === null) {
        return <PageLoader />;
        // return null; // This is the 'tricky' part: The query to AsyncStorage is not finished, but we have to present something to the user. Null will just render nothing, so you can also put a placeholder of some sort, but effectively the interval between the first mount and AsyncStorage retrieving your data won't be noticeable to the user. But if you want to display anything then you can use a LOADER here
    } else if (isFirstLaunch == true) {
        route = 'LogIn';
    } else {
        route = 'LogIn';
    }

    return (
        <Stack.Navigator
            initialRouteName={route}
            screenOptions={{
                headerShown: false,
                headerStyle: { elevation: 0 },
            }}>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen
                name="LogIn"
                component={LogInScreen}
                options={{ title: 'Log In' }}
            />
            <Stack.Screen
                name="CreateUsername"
                component={CreateUsernameScreen}
                options={{ title: 'user Details' }}
            />
        </Stack.Navigator>
    )
}

export {
    RootStackParamList,
    RootStack
}
