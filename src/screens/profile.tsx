import { FlatList, Image, Box, Text, VStack, Divider, Button, View, Pressable, Center, HStack, Heading, Select, CheckIcon, Avatar } from "native-base";
import { useAuth } from "../navigation/auth_provider"
import { Dimensions } from "react-native";
import { useRef, useState, useEffect } from "react";
import firestore from "@react-native-firebase/firestore";
import { Post } from "../components";
import { ResizeMode, Video } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';


const windowWidth = Dimensions.get('window').width;

const ProfileHeader = ({ navigation, tags, selectedTags, setSelectedTags }) => {
    const { account } = useAuth();
    return (
        <Box variant="headerContainer" px="4">
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
            <HStack width="100%" mt={3} px="5" justifyContent="space-around" space="4" alignItems="center">
                <Box flex={1} alignItems="center">
                    <VStack alignItems="center">
                        <Text variant="bold" fontSize='2xl'>
                            272
                        </Text>
                        <Text color="gray.500" fontSize="sm">
                            friends
                        </Text>
                    </VStack>
                </Box>
                <Box flex={1} alignItems="center">
                    <VStack alignItems="center">
                        <Text variant="bold" fontSize='2xl'>
                            47
                        </Text>
                        <Text color="gray.500" fontSize="sm">
                            followers
                        </Text>
                    </VStack>
                </Box>
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
            </HStack>
            <VStack width="100%" mt={3}>
                <HStack width="100%" justifyContent="space-between" alignItems="center" mt={4}>
                    <Text fontWeight="bold" fontSize="lg">
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
                    <HStack space={4} alignItems="center">
                        <Text color="primary.800" fontWeight="bold">
                            Item 1
                        </Text>
                        <Text color="secondary.800" fontWeight="bold">
                            Item 2
                        </Text>
                        <Text color="tertiary.800" fontWeight="bold">
                            Item 3
                        </Text>
                    </HStack>
                </Box>
            </VStack>
            <HStack width="100%" justifyContent="space-between" alignItems="center" mt={4}>
                <Text fontWeight="bold" fontSize="lg">
                    Posts
                </Text>
                <Select
                    width={20}
                    placeholder="Filter"
                    _selectedItem={{
                        bg: "cyan.600",
                        endIcon: <CheckIcon size="4" />,
                    }}
                >
                    <Select.Item label="Option 1" value="1" />
                    <Select.Item label="Option 2" value="2" />
                    <Select.Item label="Option 3" value="3" />
                </Select>
            </HStack>
            <HStack justifyContent="flex-start" width="100%" mb={3}>
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
        </Box>
    );
};

const ProfileScreen = ({ navigation }) => {
    const tagList = ["misc", "tag2", "tag3"];
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>();
    const [filteredPosts, setFilteredPosts] = useState<Post[]>();
    const [loading, setLoading] = useState(true);
    const [selectedTags, setSelectedTags] = useState<string[]>(tagList);



    const fetchUserPosts = async () => {
        const userId = user?.uid;
        const postsCollectionRef = firestore().collection('posts');

        const querySnapshot = await postsCollectionRef
            .where('userId', '==', userId)
            .orderBy('timestamp', 'desc')
            .get();

        let temp: Post[] = [];
        querySnapshot.forEach((documentSnapshot) => {
            temp.push(
                documentSnapshot.data() as Post,
            );
        });

        return temp;
    }

    // const postsRef = useRef<FlatList<any>>(null);

    // const scrollToTop = () => {
    //     postsRef.current?.scrollToOffset({ animated: true, offset: 0 });
    //   };
    // const loadMorePosts = async () => {
    //     if (!loading) {
    //         setLoading(true);

    //         const morePosts = await fetchMorePosts(posts.length, 10);
    //         // setPosts(prevPosts => [...prevPosts, ...morePosts]);

    //         setLoading(false);
    //     }
    // };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            if (user) {
                const userPosts = await fetchUserPosts();
                setPosts(userPosts);
                // setLoading(false)
            }
        });

        return unsubscribe;
    }, [navigation, user]);

    useEffect(() => {
        const filteredPosts = posts?.filter((post) =>
            selectedTags.length > 0 ? selectedTags.includes(post?.tags[0]) : true
        );
        setFilteredPosts(filteredPosts);
    }, [selectedTags, posts]);


    return (
        <Box variant="pageContainer" pt="0">
            <FlatList width="100%"
                contentContainerStyle={{ paddingHorizontal: 9 }}
                data={filteredPosts}
                ListHeaderComponent={<ProfileHeader navigation={navigation} tags={tagList} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />}
                renderItem={({ item }) =>
                    <View style={{ width: windowWidth / 3 - 6, height: windowWidth / 3 - 6 }}>
                        <Box flex={1} margin="0.5">
                            <Pressable onPress={() => navigation.navigate('Post', { post: item })}>
                                {item.media[0].type === 'image' ? (
                                    <Image
                                        source={{ uri: item.media[0].url }}
                                        alt={item.id}
                                        style={{ borderRadius: 10 }}
                                        resizeMode="cover"
                                        height="100%"
                                        width="100%"
                                    />
                                ) : (
                                    <Video
                                        source={{ uri: item.media[0].url }}
                                        style={{ borderRadius: 10, height: '100%', width: '100%' }}
                                        resizeMode={ResizeMode.COVER}
                                        isLooping
                                        isMuted
                                        shouldPlay
                                    />
                                )}
                            </Pressable>
                        </Box>
                    </View>
                }
                keyExtractor={item => item.id}
                numColumns={3}
            />
        </Box>
    );
}


export default ProfileScreen;
