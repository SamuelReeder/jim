import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import LandingScreen from '../screens/landing';
import UserDetailsScreen from '../screens/user_details';
import LogInScreen from '../screens/log_in';

type RootStackParamList = {
    Landing: undefined,
    LogIn: undefined;
    UserDetails: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootStack = (route) => {
    // const initial_route = log_in ? "Landing" : "LogIn";
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
                name="UserDetails"
                component={UserDetailsScreen}
                options={{ title: 'user Details' }}
            />
        </Stack.Navigator>
    )
}

export {
    RootStackParamList,
    RootStack
}
