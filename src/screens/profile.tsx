import { FlatList, Image, Box, Text, VStack, Divider, Button, View, Pressable, Center, HStack, Heading, Select, CheckIcon, Avatar } from "native-base";
import { useAuth } from "../navigation/auth_provider"
import { Dimensions } from "react-native";
import { useRef, useState, useEffect } from "react";
import firestore from "@react-native-firebase/firestore";
import { Post } from "../components";
import { ResizeMode, Video } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
import { ProfileHeader } from "../components";


const windowWidth = Dimensions.get('window').width;



const ProfileScreen = ({ navigation }) => {
    const tagList = ["misc", "tag2", "tag3"];
    const { user, account } = useAuth();
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
        <Box variant="headerContainer">
            <FlatList width="100%"
                contentContainerStyle={{ paddingHorizontal: 9 }}
                data={filteredPosts}
                ListHeaderComponent={<ProfileHeader navigation={navigation} account={account} tags={tagList} selectedTags={selectedTags} setSelectedTags={setSelectedTags} isOtherUser={false} />}
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
