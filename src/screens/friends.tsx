import React from 'react';
import { Box, Image, FlatList, HStack, VStack, Text, Button } from "native-base";
import { fetchFriendRequests, fetchUserFriends, acceptFriendRequest } from "../api";
import { useAuth } from "../navigation/auth_provider";
import { useEffect, useState } from "react";
import { User, PageLoader } from "../components";
import { View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import styles from '../styles/styles';


const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 20 }}>
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
                    <TouchableOpacity
                        key={index}
                        onPress={onPress}
                        style={{
                            flex: 1,
                            height: 50,
                            margin: 10,
                            borderRadius: 25,
                            justifyContent: 'center',
                            borderColor: 'grey',
                            borderWidth: 1,
                            backgroundColor: isFocused ? 'blue' : 'white',
                        }}
                    >
                        <Text style={{ textAlign: 'center', color: isFocused ? 'white' : 'black' }}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const FriendsScreen = () => {
    const [friends, setFriends] = useState<User[] | null>();
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchFriends = async () => {
        if (user) {
            const friends = await fetchUserFriends(user.uid);
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
        <Box variant="searchContainer" px="3">
            <FlatList
                data={friends}
                renderItem={({ item }) =>
                    <HStack space={4} alignItems='center' justifyContent='space-between' py={2}>
                        <VStack space={1}>
                            <Text bold>{item.displayName}</Text>
                            <Text fontSize='xs'>{item.username}</Text>
                        </VStack>
                        <Box>
                            <Image
                                alt='user image'
                                source={{ uri: item.photoURL }}
                                size='xs'
                                rounded='full'
                            />
                        </Box>
                    </HStack>
                }
                keyExtractor={item => item.uid}
            />
        </Box>
    );
};

const FriendRequestsScreen = () => {
    const [friendRequests, setFriendRequests] = useState<User[] | null>();
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchFriends = async () => {
        if (user) {
            const friendRequests = await fetchFriendRequests(user.uid);
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
        <Box variant="searchContainer" px="3">
            <FlatList
                data={friendRequests}
                renderItem={({ item }) =>
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
                            acceptFriendRequest(user.uid, item.uid)
                        }}>Accept</Button>
                    </HStack>
                }
                keyExtractor={item => {
                    console.log(item);
                    console.log(item.uid);
                    return item.uid;
                }}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </Box>
    );
};

const FriendsNav = () => {
    return (
        <Tab.Navigator screenOptions={
            {
                headerShown: false,
            }
        } tabBar={(props) => <CustomTabBar {...props} />}>
            <Tab.Screen name="Friends Screen" component={FriendsScreen} />
            <Tab.Screen name="Friend Requests" component={FriendRequestsScreen} />
        </Tab.Navigator>
    );
}

export default FriendsNav;
