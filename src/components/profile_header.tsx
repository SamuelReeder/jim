import { sendFriendRequest } from "../api";
import { useAuth } from '../navigation/auth_provider';
import { AntDesign, MaterialCommunityIcons, Ionicons, FontAwesome6  } from '@expo/vector-icons';
import { FlatList, Image, Box, Text, VStack, Divider, Button, View, Pressable, Center, HStack, Heading, Select, CheckIcon, Avatar } from "native-base";
import { followUser } from "../api";
import { User } from "./types";
import React from "react";

const ProfileHeader = ({ navigation, account, tags, selectedTags, setSelectedTags, isOtherUser }: { navigation: any, account: User, tags: string[], selectedTags: string[], setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>, isOtherUser: boolean }) => {
    const { user } = useAuth();
    const iconSize : number = 42;
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
                <Button
                    onPress={() => {
                        if (user?.uid && account.uid) {
                            followUser(account.uid, user?.uid);
                        }
                    }}
                    variant="outline"
                    mt={3}
                    width="100%"
                    justifyContent="center"
                    borderColor="primary.500"
                    colorScheme="primary"
                    _text={{ color: "primary.500" }}
                >Follow</Button>
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
            {account.stats && Object.keys(account.stats).length > 0 && (
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
                            {Object.entries(account.stats).slice(0, 3).map(([name, value]) => (
                                <VStack alignItems="center" width="50%" key={name} space={1} >
                                    {name === 'Priority' ? (
                                        <>
                                            <Text color="primary.800" fontWeight="bold" mb={1} fontSize="md">
                                                {name}
                                            </Text>
                                            {value === 'Aesthetics' ? (
                                                <Ionicons name="body" size={iconSize} color="black" />
                                            ) : value === 'Powerlifting' ? (
                                                <MaterialCommunityIcons name="weight-lifter" size={iconSize} color="black" />
                                            ) : value === 'Strongman' ? (
                                                <MaterialCommunityIcons name="size-xxxl" size={iconSize} color="black" />
                                            ) : (
                                                <MaterialCommunityIcons name="size-xxs" size={iconSize} color="black" />
                                            )
                                        }                                            
                                        </>
                                    ) : name === 'State' ? (
                                        <>
                                            <Text color="primary.800" fontWeight="bold" mb={1} fontSize="md">
                                                {name}
                                            </Text>
                                            {value === 'Cutting' ? (
                                                <MaterialCommunityIcons name="content-cut" size={iconSize} color="black" />
                                            ) : value === 'Bulking' ? (
                                                <FontAwesome6 name="weight-scale" size={iconSize} color="black" />
                                            ) : (
                                                <MaterialCommunityIcons name="speedometer-medium" size={iconSize} color="black" />
                                            )
                                        }               
                                        </>
                                    ) : (
                                        <Text color="primary.800" fontWeight="bold" mb={1}>
                                            {name}
                                        </Text>
                                    )}
                                    <Text color="gray.500" fontSize="sm">
                                        {value}
                                    </Text>
                                </VStack>
                            ))}
                        </HStack>
                    </Box>
                </VStack>
            )}
            <HStack alignItems="center" justifyContent="space-between" width="100%" my={4}>
                <Text fontWeight="bold" fontSize="lg">
                    Posts
                </Text>
                <HStack justifyContent="flex-end">
                    {tags.map((tag: string) => (
                        <Button
                            key={tag}
                            variant="tag"
                            // colorScheme={selectedTags.includes(tag) ? "primary" : "secondary"}
                            // TODO: CHANGE COLOUR BASED ON SELECTION
                            color="white"
                            startIcon={<AntDesign name="tagso" size={24} color="black" />}
                            onPress={() => {
                                if (selectedTags.includes(tag)) {
                                    setSelectedTags(selectedTags.filter((t: string) => t !== tag));
                                } else {
                                    setSelectedTags([...selectedTags, tag]);
                                }
                            }}>
                            {/* <LinearGradient
                            colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)']}
                            style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: 0,
                                height: '100%',
                                borderRadius: 8
                            }}
                        /> */}
                            {tag}</Button>
                    ))}
                </HStack>
            </HStack>
        </Box>
    );
};

export default ProfileHeader;