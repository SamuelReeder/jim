import { createStackNavigator } from '@react-navigation/stack';
import LandingScreen from '../screens/landing';
import SignUpScreen from '../screens/sign_up';
import LogInScreen from '../screens/log_in';

type RootStackParamList = {
    Landing: undefined,
    SignUp: undefined;
    LogIn: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false, 
            headerStyle: { elevation: 0 },
            // cardStyle: { backgroundColor: '#000000' }
        }}>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{ title: 'Sign Up' }}
            />
            <Stack.Screen
                name="LogIn"
                component={LogInScreen}
                options={{ title: 'Log In' }}
            />
        </Stack.Navigator>
    )
}

export {
    RootStackParamList,
    RootStack
}
