import { useAuth } from '../navigation/auth_provider';
import { AntDesign, MaterialCommunityIcons, Ionicons, FontAwesome6 } from '@expo/vector-icons';
import { Box, Text, VStack, Button, Pressable, HStack, Avatar } from "native-base";
import { followUser, fetchFollowingStatus, unfollowUser, unsendFollowRequest } from "../api";
import { Priority, State, Tags, User } from "./types";
import React, { useEffect, useState } from "react";
import { TAG_COLORS } from '../components';


const ProfileHeader = ({ navigation, account, tags, selectedTags, setSelectedTags, isOtherUser }: { navigation: any, account: User, tags: Tags[], selectedTags: Tags[], setSelectedTags: React.Dispatch<React.SetStateAction<Tags[]>>, isOtherUser: boolean }) => {
    const { user } = useAuth();
    const iconSize: number = 42;
    const [status, setStatus] = useState<string>("Follow");

    const fetchStatus = () => {
        if (account.uid && user?.uid) {
            fetchFollowingStatus(account.uid, user?.uid).then((state) => {
                switch (state) {
                    case "following":
                        setStatus("Unfollow");
                        break;
                    case "none":
                        setStatus("Follow");
                        break;
                    default:
                        setStatus("Pending");
                        break;
                }
            });
        }
    }

    useEffect(() => {
        if (isOtherUser) {
            fetchStatus();
            console.log("statsss", account.stats)

        }
    }, [account, user, isOtherUser]);

    const PriorityIcons: { [key in Priority]: JSX.Element } = {
        Aesthetics: <Ionicons name="body" size={iconSize} color="black" />,
        Powerlifting: <MaterialCommunityIcons name="weight-lifter" size={iconSize} color="black" />,
        Strongman: <MaterialCommunityIcons name="size-xxxl" size={iconSize} color="black" />,
        Bodybuilding: <MaterialCommunityIcons name="size-xxs" size={iconSize} color="black" />,
        Crossfit: <MaterialCommunityIcons name="weight-lifter" size={iconSize} color="black" />,
        Endurance: <MaterialCommunityIcons name="run-fast" size={iconSize} color="black" />,
        Fitness: <MaterialCommunityIcons name="weight-lifter" size={iconSize} color="black" />,
        Health: <MaterialCommunityIcons name="weight-lifter" size={iconSize} color="black" />,
    };

    const StateIcons = {
        Cutting: <MaterialCommunityIcons name="content-cut" size={iconSize} color="black" />,
        Bulking: <FontAwesome6 name="weight-scale" size={iconSize} color="black" />,
        Maintenance: <MaterialCommunityIcons name="speedometer-medium" size={iconSize} color="black" />,
    };

    console.log("stats", account.stats);
    return (
        <Box variant="headerContainer" px="4" pt="5">
            <Avatar
                size="2xl"
                source={{ uri: account.photoURL }}
                mb={4}
                _text={{ fontSize: 'md', fontWeight: 'bold', color: 'white' }}
            />
            <Text variant="bold" fontSize='3xl'>
                {account.displayName}
            </Text>
            <Text color="gray.500" fontSize="sm">
                @{account.username}
            </Text>

            {isOtherUser && (
                <HStack>
                    <Button
                        onPress={() => {
                            if (user?.uid && account.uid) {
                                if (status === "Unfollow") {
                                    unfollowUser(account.uid, user?.uid);
                                } else if (status === "Follow") {
                                    followUser(account.uid, user?.uid);
                                } else {
                                    unsendFollowRequest(account.uid, user?.uid);
                                }
                                fetchStatus();
                            }
                        }}
                        variant="outline"
                        borderRadius={12}
                        mt={3}
                        width="40%"
                        justifyContent="center"
                        borderColor={status === "Follow" ? "white" : "black"}
                        backgroundColor={status === "Follow" ? "black" : "white"}
                        colorScheme={status === "Follow" ? "white" : "black"}
                        _text={{ color: status === "Follow" ? "white" : "black", fontSize: 'md' }}
                    >{status}</Button>
                    <Button
                        onPress={() => {
                            navigation.navigate('Chat', { account: account });
                        }}
                        variant="outline"
                        borderRadius={12}
                        mt={3}
                        justifyContent="center"
                        borderColor="black"
                        backgroundColor="black"
                        colorScheme="black"
                        _text={{ color: "white", fontSize: 'md' }}
                    ><MaterialCommunityIcons name="chat" size={24} color="white" /></Button>
                </HStack>
            )}
            <HStack width="100%" mt={3} px="5" justifyContent="space-around" space="4" alignItems="center">
                <Pressable width="20%" onPress={() => {
                    navigation.navigate('Friends', { account: account.uid, screen: 'followers' });
                }}>
                    <Box flex={1} alignItems="center">
                        <VStack alignItems="center">
                            <Text variant="bold" fontSize='2xl'>
                                {account.followers ? Object.keys(account.followers).length : 0}
                            </Text>
                            <Text color="gray.500" fontSize="sm">
                                followers
                            </Text>
                        </VStack>
                    </Box>
                </Pressable>
                <Pressable width="20%" onPress={() => {
                    navigation.navigate('Friends', { account: account.uid, screen: 'followers' });
                }}>
                    <Box flex={1} alignItems="center">
                        <VStack alignItems="center">
                            <Text variant="bold" fontSize='2xl'>
                                {account.following ? Object.keys(account.following).length : 0}
                            </Text>
                            <Text color="gray.500" fontSize="sm">
                                following
                            </Text>
                        </VStack>
                    </Box>
                </Pressable>
                <Pressable width="20%" onPress={() => {
                    navigation.navigate('Friends', { account: account.uid, screen: 'followers' });
                }}>
                    <Box flex={1} alignItems="center">
                        <VStack alignItems="center">
                            <Text variant="bold" fontSize='2xl'>
                                13
                            </Text>
                            <Text color="gray.500" fontSize="sm">
                                percent
                            </Text>
                        </VStack>
                    </Box>
                </Pressable>
            </HStack>
            {account.stats && account.stats.length > 0 && (
                <VStack width="100%" mt={3}>
                    <HStack width="100%" justifyContent="space-between" alignItems="center" mt={4}>
                        <Text fontWeight="bold" fontSize="lg" mb={2}>
                            Metrics
                        </Text>
                    </HStack>
                    <Box
                        bg="white"
                        shadow={2}
                        rounded="lg"
                        mx="auto"
                        p="5"
                        width="100%"
                    >
                        <HStack space={4} alignItems="center" justifyContent="space-between">
                            {account.stats && account.stats.map((stat, index) => {
                                const metric = stat.metric;
                                const value = stat.value;
                                return (
                                    <VStack alignItems="center" width="50%" key={index} space={1} >
                                        <Text color="primary.800" fontWeight="bold" mb={1} fontSize="md">
                                            {value}
                                        </Text>
                                        {metric === 'Priority' ? PriorityIcons[value as Priority] : StateIcons[value as State]}
                                        <Text color="gray.500" fontSize="sm">
                                            {metric}
                                        </Text>
                                    </VStack>
                                );
                            })}
                        </HStack>
                    </Box>
                </VStack>
            )}
            <HStack alignItems="center" justifyContent="space-between" width="100%" my={4}>
                <Text fontWeight="bold" fontSize="lg">
                    Posts
                </Text>
                <HStack justifyContent="flex-end">
                    {tags.map((tag: Tags) => (
                        <Button
                            key={tag}
                            variant="tag"
                            // style={selectedTags.includes(tag) ? styles.selectedTag : styles.unselectedTag}
                            backgroundColor={tags.includes(tag) ? TAG_COLORS.tagSelected : TAG_COLORS.tagUnselected}
                            startIcon={<AntDesign name="tagso" size={24} color="white" />}
                            onPress={() => {
                                if (selectedTags.includes(tag)) {
                                    const newTags = selectedTags.filter((t: Tags) => t !== tag);
                                    setSelectedTags(newTags);
                                } else {
                                    const newTags = [...selectedTags, tag];
                                    setSelectedTags(newTags);
                                }
                            }}>
                            <Text color="white">{tag}</Text>
                        </Button>
                    ))}
                </HStack>
            </HStack>
        </Box>
    );
};

export default ProfileHeader;