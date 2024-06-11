import React from 'react';
import { Box, Image, FlatList, HStack, VStack, Text, Button } from "@gluestack-ui/themed-native-base";
import { getUserFollowRequests, getUserFollowers, acceptFollowRequest, getUserFollowing } from "../api";
import { useAuth } from "../navigation/auth_provider";
import { useEffect, useState } from "react";
import { User, PageLoader } from "../components";
import { View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import styles from '../styles/styles';


const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
    return (
        <View style={styles.outer}>
        <View style={styles.container}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    // <TouchableOpacity
                    //     key={index}
                    //     onPress={onPress}
                    //     style={{
                    //         flex: 1,
                    //         height: 50,
                    //         margin: 10,
                    //         borderRadius: 25,
                    //         justifyContent: 'center',
                    //         borderColor: 'grey',
                    //         borderWidth: 1,
                    //         backgroundColor: isFocused ? 'blue' : 'white',
                    //     }}
                    // >
                    //     <Text style={{ textAlign: 'center', color: isFocused ? 'white' : 'black' }}>
                    //         {label}
                    //     </Text>
                    // </TouchableOpacity>
                    <View style={styles.tab} key={index}>
                        <TouchableOpacity
                            onPress={onPress}
                            style={[
                                styles.innerTab,
                                isFocused ? styles.innerTabFocused : styles.innerTabUnfocused
                            ]}
                        >
                            <Text style={[
                                styles.label,
                                isFocused ? styles.labelFocused : styles.labelUnfocused
                            ]}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    </View>
                );
            })}
        </View>
        </View>
    );
};

const FollowersScreen = () => {
    const [friends, setFriends] = useState<User[] | null>();
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchFriends = async () => {
        if (user) {
            const friends = await getUserFollowers(user.uid);
            setFriends(friends);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, [user]);

    if (loading) {
        return <PageLoader />;
    }

    return (
        <Box variant="socialContainer" px="5">
            <FlatList
                data={friends}
                renderItem={({ item }) =>
                    <View style={styles.socialItem}>
                        <HStack space={4} alignItems='center' justifyContent='flex-start' py={2}>
                            <Box>
                                <Image
                                    alt='user image'
                                    source={{ uri: item.photoURL }}
                                    size='xs'
                                    rounded='full'
                                />
                            </Box>
                            <VStack space={1}>
                                <Text bold>{item.displayName}</Text>
                                <Text fontSize='xs'>{item.username}</Text>
                            </VStack>
                        </HStack>
                    </View>
                }
                keyExtractor={index => index.toString()}
            />
        </Box>
    );
};

const FollowingScreen = () => {
    const [friends, setFriends] = useState<User[] | null>();
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchFriends = async () => {
        if (user) {
            const friends = await getUserFollowing(user.uid);
            setFriends(friends);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, [user]);

    if (loading) {
        return <PageLoader />;
    }

    return (
        <Box variant="socialContainer" px="5">
            <FlatList
                data={friends}
                renderItem={({ item }) =>
                    <View style={styles.socialItem}>
                        <HStack space={4} alignItems='center' justifyContent='flex-start' py={2}>
                            <Box>
                                <Image
                                    alt='user image'
                                    source={{ uri: item.photoURL }}
                                    size='xs'
                                    rounded='full'
                                />
                            </Box>
                            <VStack space={1}>
                                <Text bold>{item.displayName}</Text>
                                <Text fontSize='xs'>{item.username}</Text>
                            </VStack>
                        </HStack>
                    </View>
                }
                keyExtractor={index => index.toString()}
            />
        </Box>
    );
};

const RequestsScreen = () => {
    const [friendRequests, setFriendRequests] = useState<User[] | null>();
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchFriends = async () => {
        if (user) {
            const friendRequests = await getUserFollowRequests(user.uid);
            setFriendRequests(friendRequests);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, [user]);

    if (loading) {
        return <PageLoader />;
    }

    return (
        <Box variant="socialContainer" px="5">
            <FlatList
                data={friendRequests}
                renderItem={({ item }) =>
                    <View style={styles.socialItem}>
                        <HStack space={4} alignItems='center' justifyContent='space-between' py={2}>
                            <HStack space={4} alignItems='center' justifyContent="flex-start">
                                <Image
                                    alt='user image'
                                    source={{ uri: item.photoURL }}
                                    size='xs'
                                    rounded='full'
                                />
                                <VStack space={1}>
                                    <Text bold>{item.displayName}</Text>
                                    <Text fontSize='xs'>{item.username}</Text>
                                </VStack>
                            </HStack>
                            <Button size='xs' variant='outline'
                                onPress={() => {
                                    if (!user) {
                                        return;
                                    }
                                    acceptFollowRequest(user.uid, item.uid)
                                }}>Accept</Button>
                        </HStack>
                    </View>
                }
                keyExtractor={item => {
                    return item.uid;
                }}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </Box>
    );
};

const FriendsNav = ({ account, screen }: { account?: string, screen?: string }) => {

    if (!account) {
        const { user } = useAuth();
        const account = user?.uid;
    }

    if (!screen) {
        screen = 'Followers';
    }

    return (
        <Tab.Navigator screenOptions={
            {
                headerShown: false,
            }
        } tabBar={(props) => <CustomTabBar {...props} />}
            initialRouteName={screen}>
            <Tab.Screen name="Followers" component={FollowersScreen} />
            <Tab.Screen name="Following" component={FollowingScreen} />
            <Tab.Screen name="Requests" component={RequestsScreen} />
        </Tab.Navigator>
    );
}

export default FriendsNav;
