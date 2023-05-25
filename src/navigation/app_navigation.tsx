import React from 'react';
// import {View, TouchableOpacity, Text} from 'react-native';
// import {createStackNavigator} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
// const Stack = createStackNavigator();
import LandingScreen from '../screens/landing';
import UserDetailsScreen from '../screens/user_details';
import ProfileScreen from '../screens/profile';

type AppTabsParamList = {
    Profile: undefined,
    Search: undefined;
    UserDetails: undefined;
};

const Tab = createBottomTabNavigator<AppTabsParamList>();

const AppStack = () => {
    //   const getTabBarVisibility = (route) => {
    //     const routeName = route.state
    //       ? route.state.routes[route.state.index].name
    //       : '';

    //     if (routeName === 'Chat') {
    //       return false;
    //     }
    //     return true;
    //   };

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                headerStyle: { elevation: 0 },
            }}>
            <Tab.Screen
                name="Profile"
                component={LandingScreen}
                options={({ route }) => ({
                    tabBarLabel: 'Profile',
                    // tabBarVisible: route.state && route.state.index === 0,
                    tabBarIcon: () => (
                        <AntDesign name="profile" size={24} color="black" />
                    ),
                })}
            />
            {/* <Tab.Screen
        name="Messages"
        component={MessageStack}
        options={({route}) => ({
          tabBarVisible: getTabBarVisibility(route),
          // Or Hide tabbar when push!
          // https://github.com/react-navigation/react-navigation/issues/7677
          // tabBarVisible: route.state && route.state.index === 0,
          // tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Ionicons
              name="chatbox-ellipses-outline"
              color={color}
              size={size}
            />
          ),
        })}
      /> */}
            <Tab.Screen
                name="UserDetails"
                component={UserDetailsScreen}
                options={{
                    // tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="profile" size={24} color="black" />
                    ),
                }}
            />
            <Tab.Screen
                name="Search"
                component={ProfileScreen}
                options={{
                    // tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="profile" size={24} color="black" />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default AppStack;