import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, Ionicons, MaterialCommunityIcons, MaterialIcons  } from '@expo/vector-icons';
import { Image, Button, Icon, HStack } from 'native-base';
import { useAuth } from './auth_provider';
import * as Screens from '../screens';
import { createStackNavigator } from '@react-navigation/stack';
import { AppStackParamList, AppTabsParamList } from '../components';
import { TouchableOpacity } from 'react-native';


const Tab = createBottomTabNavigator<AppTabsParamList>();
const Stack = createStackNavigator<AppStackParamList>();

const TabNavigator = () => {

    const { account } = useAuth();
    const iconSize = 20;

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
                headerTitleStyle: {
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 18,
                },
                tabBarActiveTintColor: 'black',
            }}
            backBehavior="order"
            id="app-nav">
            <Tab.Screen
                name="Home"
                component={Screens.HomeScreen}
                options={({ route }) => ({
                    tabBarLabel: 'Feed',
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerStyle: {
                        height:100,
                    },
                    headerTitle: () => (
                        <Image 
                            source={require('../../assets/logo.png')} 
                            style={{ width: 57, height: 40}} 
                            alt="Logo"
                        />
                    ),
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => {
                            // Handle the press event here
                            console.log('Left icon pressed!');
                        }}>
                            <MaterialIcons name="local-fire-department" size={24} color="orange" style={{ marginLeft: 20 }}/>
                        </TouchableOpacity>
                    ),
                
                    // Set the pressable icon on the right side of the header
                    headerRight: () => (
                        <TouchableOpacity onPress={() => {
                            // Handle the press event here
                            console.log('Icon pressed!');
                        }}>
                            <MaterialIcons name="notifications-none" size={24} color="black" style={{ marginRight: 20 }}/>

                        </TouchableOpacity>
                    ),
                
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
                    headerTitle: `@${account?.username}`,
                    headerStyle: {
                        height:100,
                        elevation: 0, // remove shadow on Android
                        shadowOpacity: 0, // remove shadow on iOS
                        borderBottomWidth: 0, // remove bottom border
                        // marginTop: 10,
                    },
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
                        <HStack alignItems="flex-end">
                            <Button
                                onPress={() => navigation.navigate('CreatePostStack')}
                                style={{
                                    backgroundColor: 'white',
                                    opacity: 1,
                                    borderRadius: 10
                                }}
                            >
                                <MaterialCommunityIcons name="plus-box-multiple-outline" size={iconSize} color="black" />
                            </Button>
                            <Button
                                onPress={() => navigation.navigate('Friends')}
                                style={{
                                    backgroundColor: 'white',
                                    opacity: 1,
                                    borderRadius: 10
                                }}
                            >
                                <AntDesign name="team" size={iconSize} color="black" />
                            </Button>
                            <Button
                                onPress={() => navigation.navigate('Settings')}
                                style={{
                                    backgroundColor: 'white',
                                    opacity: 1,
                                    borderRadius: 10
                                }}
                            >
                                <AntDesign name="setting" size={iconSize} color="black" />
                            </Button>

                        </HStack>
                    ),
                })}
            />
        </Tab.Navigator>
    );
};

const AppStack = () => {
    return (
        <Stack.Navigator
            screenOptions={
                {
                    headerTitleStyle: {
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 18,
                    },
                    headerStyle: {
                        height:100,
                        elevation: 0, // remove shadow on Android
                        shadowOpacity: 0, // remove shadow on iOS
                        borderBottomWidth: 0, // remove bottom border
                        // marginTop: 10,
                    },
                    // headerBackImage: () => <Ionicons name="arrow-back" size={22} c   olor="black" />, // custom back button
    
    
                    headerTitleAlign: 'center', // align the title to the center
                    headerBackTitleVisible: false,
                }
            }
        >
            <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Post" component={Screens.PostScreen} />
            <Stack.Screen name="UserProfile" options={{headerTitle: "Profile"}} component={Screens.UserProfileScreen} />
            <Stack.Screen name="EditProfile" options={{title: "Edit profile"}} component={Screens.EditProfileScreen} />
            <Stack.Screen name="Friends" component={Screens.FriendsStack} />
            <Stack.Screen name="CreatePostStack" options={{title: "Post"}} component={Screens.CreatePostScreen} />
            <Stack.Screen name="Stat" component={Screens.StatScreen} />
            <Stack.Screen name="Settings" component={Screens.SettingsScreen} />
        </Stack.Navigator>
    );
};

export default AppStack;