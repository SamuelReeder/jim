import { Box, Button, Image, Text, FlatList, HStack, VStack, Avatar } from "native-base";
// import { FlatList } from "react-native-gesture-handler";
import { getRecentPostsFromFollowing, fetchUser } from "../api";
import { useAuth } from "../navigation/auth_provider";
import { Post, User, PageLoader } from "../components";
import { useEffect, useState } from "react";
import { AntDesign } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';
import { Dimensions, StyleSheet } from "react-native";
import { Video, ResizeMode } from 'expo-av';

type PostAndAuthor = {
    post: Post;
    author: User;
}

const screenWidth = Dimensions.get('window').width;


const HomeScreen = ({ navigation }) => {
    const [posts, setPosts] = useState<PostAndAuthor[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasMoreItems, setHasMoreItems] = useState(true);
    const { user, logout } = useAuth();

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
            console.log(posts);
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
        <Box variant="pageContainer">
            <FlatList
                data={posts}
                // onEndReached={fetchPosts}
                // onEndReachedThreshold={0.5}
                renderItem={({ item }) => <Box width="100%">
                    <Swiper showsButtons={item.post.media.length > 1} width={0.9 * screenWidth} height={((item.post.media[0].aspectRatio[1] / item.post.media[0].aspectRatio[0]) * screenWidth) * 0.9} containerStyle={{borderRadius: 20, overflow: 'hidden'}}>
                        {item.post.media.map((media: any, index) => (
                            <Box key={index} width="100%" height="100%">
                                {media.type == 'image' ? (
                                    <Image
                                        alt="item Image"
                                        source={{ uri: media.url }}
                                        resizeMode="contain"
                                        style={{
                                            width: screenWidth * 0.9, height: ((media.aspectRatio[1] / media.aspectRatio[0]) * screenWidth) * 0.9}} // Set height to screenWidth as well to maintain aspect ratio. Adjust as needed.
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
                    <Box flex={1} p="3">
                        <HStack space={2} flex={1}>
                            <Avatar
                                size="sm"
                                mb={0.5}
                                source={{ uri: item.author?.photoURL }}
                                _text={{ fontSize: 'md', fontWeight: 'bold', color: 'white' }}
                            />
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
                </Box>}
                keyExtractor={item => item.post.id}
            />
            <Button
                onPress={() =>
                    logout()
                }
                w="100%"
            >Log In</Button>
        </Box>
    );
};

export default HomeScreen;