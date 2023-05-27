import React from 'react';
// import {View, TouchableOpacity, Text} from 'react-native';
// import {createStackNavigator} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
// const Stack = createStackNavigator();
import LandingScreen from '../screens/landing';
import UserDetailsScreen from '../screens/create_username';
import SearchScreen from '../screens/search';
import ProfileScreen from '../screens/profile';
import { Image } from 'native-base';
import { useAuth } from './auth_provider';

type AppTabsParamList = {
    Profile: undefined,
    Search: undefined;
    UserDetails: undefined;
};

const Tab = createBottomTabNavigator<AppTabsParamList>();

const AppStack = () => {

    const { account } = useAuth();
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
                tabBarShowLabel: false,
                tabBarStyle: {
                    borderTopWidth: 0, // remove border (set elevation to 0)
                    paddingBottom: 10, // add bottom padding
                    paddingTop: 10,
                    height: 50, // set the height of the tab bar
                },
                tabBarActiveTintColor: '#e91e63',
            }}
            backBehavior="order"
            id="app-nav">
            <Tab.Screen
                name="UserDetails"
                component={LandingScreen}
                options={({ route }) => ({
                    tabBarLabel: 'Feed',
                    // tabBarVisible: route.state && route.state.index === 0,
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="home" size={size} color={color} />
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
                name="Search"
                component={SearchScreen}
                options={{
                    tabBarLabel: 'Search',
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="search1" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Image
                            source={{ uri: account?.photoURL }}
                            style={{
                                width: size,
                                height: size,
                                // tintColor: color,
                            }}
                            alt="Profile Picture"
                            rounded='full'
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default AppStack;