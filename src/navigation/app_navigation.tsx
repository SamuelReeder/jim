import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Image, Button, Icon } from 'native-base';
import { useAuth } from './auth_provider';
import * as Screens from '../screens';
import { createStackNavigator } from '@react-navigation/stack';
import { Post } from '../components';


type AppTabsParamList = {
    Profile: undefined,
    Search: undefined;
    Statistics: undefined;
    UserDetails: undefined;
};

type AppStackParamList = {
    Tabs: undefined;
    UserProfile: undefined;
    Post: { post: Post };
    EditProfile: undefined;
    Friends: undefined;
    CreatePost: undefined;
};

const Tab = createBottomTabNavigator<AppTabsParamList>();
const Stack = createStackNavigator<AppStackParamList>();

const TabNavigator = () => {

    const { account } = useAuth();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    borderTopWidth: 0,
                    paddingBottom: 10,
                    paddingTop: 10,
                    height: 50,
                },
                tabBarActiveTintColor: '#e91e63',
            }}
            backBehavior="order"
            id="app-nav">
            <Tab.Screen
                name="UserDetails"
                component={Screens.LandingScreen}
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
                component={Screens.SearchScreen}
                options={{
                    tabBarLabel: 'Search',
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="search1" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Statistics"
                component={Screens.StatisticsScreen}
                options={{
                    tabBarLabel: 'Statistics',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="stats-chart-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Screens.ProfileScreen}
                options={({ navigation }) => ({
                    headerShown: true,
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Image
                            source={{ uri: account?.photoURL }}
                            style={{
                                width: size,
                                height: size,
                            }}
                            alt="Profile Picture"
                            rounded='full'
                        />
                    ),
                    headerRight: () => (
                        <Button
                            onPress={() => navigation.navigate('Friends')
                            // finish functionality
                            }>
                                
                            <AntDesign name="search1" size={24} color="black" />
                        </Button>
                    ),
                })}
            />
        </Tab.Navigator>
    );
};

const AppStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Post" component={Screens.PostScreen} />
            <Stack.Screen name="UserProfile" component={Screens.UserProfileScreen} />
            <Stack.Screen name="EditProfile" component={Screens.EditProfileScreen} />
            <Stack.Screen name="Friends" component={Screens.FriendsStack} />
            <Stack.Screen name="CreatePost" component={Screens.CreatePostScreen} />
        </Stack.Navigator>
    );
};

export default AppStack;