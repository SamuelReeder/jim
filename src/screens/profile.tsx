import { FlatList, Image, Box, View, Pressable, Spinner } from "native-base";
import { useAuth } from "../navigation/auth_provider"
import { Dimensions, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import firestore from "@react-native-firebase/firestore";
import { Post } from "../components";
import { ResizeMode, Video } from 'expo-av';
import { PageLoader, ProfileHeader } from "../components";
import React from "react";
import { Tags } from "../components/types";
import { set } from "date-fns";

const windowWidth = Dimensions.get('window').width;

const ProfileScreen = ({ navigation }: { navigation: any }) => {
    const { user, account } = useAuth();
    const [posts, setPosts] = useState<Post[]>();
    const [filteredPosts, setFilteredPosts] = useState<Post[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedTags, setSelectedTags] = useState<Tags[]>([Tags.Progress, Tags.PersonalRecord, Tags.Miscellaneous]);
    const [isLoadingPerPost, setIsLoadingPerPost] = useState<Record<string, boolean>>({});


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
            setIsLoadingPerPost((prev) => {
                return { ...prev, [documentSnapshot.id]: false };
            });
        });

        return temp;
    }

    useEffect(() => {
        const fetchPosts = async () => {
            if (user) {
                const userPosts = await fetchUserPosts();

                const filteredPosts = userPosts.filter((post) =>
                    selectedTags.length > 0 ? selectedTags.includes(post?.tags[0] as Tags) : true
                );

                setFilteredPosts(filteredPosts);
                setLoading(false);
            }
        };

        fetchPosts(); // Fetch posts immediately when the component mounts

        const unsubscribe = navigation.addListener('focus', async () => {
            fetchPosts(); // Fetch posts also when the screen gains focus
        });

        return unsubscribe;
    }, [navigation, user, selectedTags]); // Add selectedTags to the dependency array

    if (loading) {
        return <Spinner size="lg" />;
    }

    return (
        <Box variant="headerContainer">
            <FlatList width="100%"
                contentContainerStyle={{ paddingHorizontal: 9 }}
                data={filteredPosts}
                ListHeaderComponent={<ProfileHeader navigation={navigation} account={account} tags={[Tags.Progress, Tags.PersonalRecord, Tags.Miscellaneous]} selectedTags={selectedTags} setSelectedTags={setSelectedTags} isOtherUser={false} />}
                renderItem={({ item }) => {
                    
                    return <View style={{ width: windowWidth / 3 - 6, height: windowWidth / 3 - 6 }}>
                        {isLoadingPerPost[item.id] && (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Spinner size="sm" />
                            </View>
                        )}
                        <Box flex={1} margin="0.5" style={isLoadingPerPost[item.id] ? {display: "none"} : {}}>
                            <Pressable onPress={() => navigation.navigate('Post', { post: item })}>
                                
                                {item.media[0].type === 'image' ? (
                                    <Image
                                        source={{ uri: item.media[0].url }}
                                        alt={item.id}
                                        style={{ borderRadius: 10 }}
                                        resizeMode="cover"
                                        height="100%"
                                        width="100%"
                                        onLoadStart={() => setIsLoadingPerPost((prev) => {
                                            return { ...prev, [item.id]: true };
                                        })}
                                        onLoad={() => setIsLoadingPerPost((prev) => {
                                            return { ...prev, [item.id]: false };
                                        })}
                                    />
                                ) : (
                                    <Video
                                        source={{ uri: item.media[0].url }}
                                        style={{ borderRadius: 10, height: '100%', width: '100%' }}
                                        resizeMode={ResizeMode.COVER}
                                        isLooping
                                        isMuted
                                        shouldPlay
                                        onLoadStart={() => setIsLoadingPerPost((prev) => {
                                            return { ...prev, [item.id]: true };
                                        })}
                                        onLoad={() => setIsLoadingPerPost((prev) => {
                                            return { ...prev, [item.id]: false };
                                        })}
                                    />
                                )}
                            </Pressable>
                        </Box>
                    </View>
                }}
                keyExtractor={item => item.id}
                numColumns={3}
            />
        </Box>
    );
}

export default ProfileScreen;