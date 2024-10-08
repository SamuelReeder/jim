import { Box, Button, Image, Text, FlatList, HStack, VStack, Avatar, Pressable } from "native-base";
// import { FlatList } from "react-native-gesture-handler";
import { getRecentPostsFromFollowing, fetchUser, hasUserLikedPost, likePost, unlikePost } from "../api";
import { useAuth } from "../navigation/auth_provider";
import { Post, User, PageLoader, TAG_COLORS } from "../components";
import { useEffect, useState } from "react";
import { AntDesign } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';
import { Dimensions, StyleSheet } from "react-native";
import { Video, ResizeMode } from 'expo-av';
import React from "react";

type PostAndAuthor = {
    post: Post;
    author: User;
}

const screenWidth = Dimensions.get('window').width;


const HomeScreen = ({ navigation }: { navigation: any }) => {
    const [posts, setPosts] = useState<PostAndAuthor[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasMoreItems, setHasMoreItems] = useState(true);
    const { user, logout } = useAuth();
    const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
    const [likesCount, setLikesCount] = useState<Record<string, number>>({});

    // const handleLikePress = (postId) => {
    //     setLikedPosts(prevLikedPosts => ({
    //         ...prevLikedPosts,
    //         [postId]: !prevLikedPosts[postId]
    //     }));
    // };

    useEffect(() => {
        if (user && user.uid) {
            const fetchLikedPosts = async () => {
                const newLikedPosts: Record<string, boolean> = {};
                const newLikesCount: Record<string, number> = {};

                for (let i of posts) {
                    newLikedPosts[i.post.id] = await hasUserLikedPost(i.post.id, user.uid);
                    newLikesCount[i.post.id] = i.post.likesCount;
                }

                setLikedPosts(newLikedPosts);
                setLikesCount(newLikesCount);
            };

            fetchLikedPosts();
        }
    }, [posts, user]);

    const handleLikePress = async (postId: string) => {
        if (user && user.uid && postId) {
            try {
                if (likedPosts[postId]) {
                    await unlikePost(postId, user.uid);
                    setLikedPosts({
                        ...likedPosts,
                        [postId]: false,
                    });
                    setLikesCount({ ...likesCount, [postId]: (likesCount[postId] - 1) });
                } else {
                    await likePost(postId, user.uid);
                    setLikedPosts({
                        ...likedPosts,
                        [postId]: true,
                    });
                    setLikesCount({ ...likesCount, [postId]: (likesCount[postId] + 1) });
                }
            } catch (error) {
                console.error("Error liking/unliking post: ", error);
            }
        } else {
            console.error("postId or user.uid is undefined");
        }
    };

    const fetchPosts = async () => {
        if (!hasMoreItems || !user) {
            return;
        }

        const newPosts = await getRecentPostsFromFollowing(user.uid);

        // Create a Set with existing post IDs
        let postIds = new Set(posts.map(post => post.post.id));

        // Filter out duplicate posts from the new posts
        let uniqueNewPosts = newPosts.filter(post => {
            if (!postIds.has(post.id)) {
                postIds.add(post.id);
                return true;
            }
            return false;
        });

        // Fetch the authors of the new posts
        const uniqueNewPostsWithAuthors = await fetchAuthorDetails(uniqueNewPosts);


        if (uniqueNewPostsWithAuthors.length === 0) {
            setHasMoreItems(false);
        } else {
            setPosts([...posts, ...uniqueNewPostsWithAuthors]);
        }
        setLoading(false);
    };

    const fetchAuthorDetails = async (posts: Post[]): Promise<PostAndAuthor[]> => {
        // Create a set to hold unique user IDs
        const userIds = new Set<string>();
        posts.forEach(post => userIds.add(post.userId));

        // Fetch the user details for each unique user ID
        const users: { [id: string]: User } = {};
        for (const userId of userIds) {
            const user = await fetchUser(userId);
            if (user) {
                users[userId] = user;
            }
        }

        // Add the author details to the posts and return the resulting array
        return posts.map(post => ({ post, author: users[post.userId] }));
    };


    useEffect(() => {
        fetchPosts();
    }, [user]);

    if (loading) {
        return <PageLoader />;
    }

    return (
        <Box variant="headerContainer">
            {posts && posts.length == 0 ? <Text>No posts to show, add some friends!</Text> :
                <FlatList
                    data={posts}
                    // onEndReached={fetchPosts}
                    // onEndReachedThreshold={0.5}
                    paddingTop={5}
                    renderItem={({ item }) => <Box width="100%">
                        <Box paddingY={2}>
                            <Box flex={1} pb="2" px="4">
                                <Pressable onPress={() => {
                                    navigation.navigate('UserProfile', { userId: item.author.uid });
                                }} >
                                    <HStack space={2} flex={1} justifyContent="flex-start" alignItems="center">
                                        <Avatar
                                            size="sm"
                                            mb={0.5}
                                            source={{ uri: item.author?.photoURL }}
                                            _text={{ fontSize: 'md', fontWeight: 'bold', color: 'white' }}
                                        />
                                        <VStack space={0} justifyContent="center">
                                            <Text style={{ fontFamily: 'Poppins_700Bold', lineHeight: 15 }}>{item.author?.displayName} </Text>
                                            <Text color="gray.500" style={{ lineHeight: 14, fontSize: 12 }}>@{item.author?.username}</Text>
                                        </VStack>

                                    </HStack>
                                </Pressable>
                            </Box>
                            <Box position="relative">
                                <Swiper
                                    showsPagination={item.post.media.length > 1} width={0.9 * screenWidth}
                                    showsButtons={false}
                                    height={((item.post.media[0].aspectRatio[1] / item.post.media[0].aspectRatio[0]) * screenWidth) * 0.9}
                                    containerStyle={{ borderRadius: 20, overflow: 'hidden' }}
                                    activeDotColor="rgba(255, 255, 255, 0.7)"
                                >
                                    {item.post.media.map((media: any, index: number) => (
                                        <Box key={index} width="100%" height="100%">
                                            {media.type == 'image' ? (
                                                <Image
                                                    alt="item Image"
                                                    source={{ uri: media.url }}
                                                    resizeMode="contain"
                                                    style={{
                                                        width: screenWidth * 0.9, height: ((media.aspectRatio[1] / media.aspectRatio[0]) * screenWidth) * 0.9
                                                    }} // Set height to screenWidth as well to maintain aspect ratio. Adjust as needed.
                                                />
                                            ) : (
                                                <Video
                                                    source={{ uri: media.url }}
                                                    style={{ width: screenWidth, height: (media.aspectRatio[1] / media.aspectRatio[0]) * screenWidth }}
                                                    resizeMode={ResizeMode.COVER}
                                                    isLooping
                                                    shouldPlay
                                                />
                                            )}

                                        </Box>
                                    ))}
                                </Swiper>
                                <HStack

                                    position="absolute"  // Absolute positioning
                                    right={0}             // Aligned to the left
                                    bottom={0}
                                    m="1.5"          // Aligned to the bottom
                                >
                                    {item.post.tags.map((tag, index) => (
                                        <Button
                                            key={tag}
                                            variant="tag"
                                            // TODO: CHANGE COLOUR BASED ON SELECTION
                                            backgroundColor={TAG_COLORS.tagSelected}
                                            color="white"
                                            padding={2}
                                            startIcon={<AntDesign name="tagso" size={20} color="white" />}>
                                            <Text color="white">{tag}</Text>
                                        </Button>
                                    ))}
                                    <Box

                                        p="1.5"
                                        borderColor="white"
                                        borderRadius={20}
                                        bgColor={TAG_COLORS.tagSelected}
                                        justifyContent="center"
                                    >
                                        <Pressable onPress={() => handleLikePress(item.post.id)}>
                                            <HStack alignItems="center" space={1}>
                                                <AntDesign name={likedPosts[item.post.id] ? "heart" : "hearto"} size={22} color={likedPosts[item.post.id] ? "rgb(171, 43, 48)" : "black"} />
                                                <Text color="white" fontSize="sm">{likesCount[item.post.id]}</Text>
                                            </HStack>
                                        </Pressable>
                                    </Box>
                                </HStack>

                            </Box>
                            <Box flex={1} p="3">
                                <HStack space={2} flex={1}>
                                    <VStack flex={1}>
                                        <Text>
                                            <Text style={{ fontFamily: 'Poppins_700Bold' }}>{item.author?.displayName} </Text>
                                            {item.post.description}
                                            <Text color="gray.500">  {item.post.timestamp.toDate().toLocaleDateString()} {item.post.timestamp.toDate().toLocaleTimeString()}
                                            </Text>
                                        </Text>
                                    </VStack>
                                </HStack>
                            </Box>
                        </Box>
                    </Box>
                    }
                    keyExtractor={item => item.post.id}
                />}
        </Box>
    );
};

// const PostItem = ({ item, isLiked, onLikePress, likeCount }) => (
//     <VStack flex={1}>
//         <Pressable onPress={onLikePress}>
//             <AntDesign name={isLiked ? "heart" : "hearto"} size={24} color={isLiked ? "red" : "black"} />
//             <Text>{likeCount}</Text>
//         </Pressable>
//         <Text>
//             <Text style={{ fontFamily: 'Poppins_700Bold' }}>{item.author?.displayName} </Text>
//             {item.post.description}
//             <Text color="gray.500">  {item.post.timestamp.toDate().toLocaleDateString()} {item.post.timestamp.toDate().toLocaleTimeString()}
//             </Text>
//         </Text>
//     </VStack>
// );

export default HomeScreen;