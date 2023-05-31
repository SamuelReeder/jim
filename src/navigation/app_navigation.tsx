import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import { Image } from 'native-base';
import { useAuth } from './auth_provider';
import { ProfileStack, HomeStack } from './app_stacks';
import { LandingScreen, SearchScreen } from '../screens';

type AppTabsParamList = {
    ProfileStack: undefined,
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
                // headerStyle: { elevation: 0 },
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
                name="ProfileStack"
                component={ProfileStack}
                options={{
                    tabBarLabel: 'Profile',
                    // headerShown: true,
                    // headerStyle: {
                    //     // borderBottomWidth: 1, // remove border (set elevation to 0)
                    //     // paddingBottom: 10, // add bottom padding
                    //     // paddingTop: 10,
                    //     // height: 50, // set the height of the tab bar
                    //     elevation: 8,
                    // },
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