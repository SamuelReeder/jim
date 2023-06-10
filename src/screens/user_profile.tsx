import { FlatList, Image, Box, View, Pressable } from "native-base";
import { Dimensions } from "react-native";
import { useState, useEffect } from "react";
import { PageLoader, Post } from "../components";
import { ProfileHeader } from "../components";
import { fetchUser, fetchUserPosts } from "../api";
import { NavigationProp } from "@react-navigation/native";
import ErrorMessage from "../components/error";
import { Video, ResizeMode } from "expo-av";

const windowWidth = Dimensions.get('window').width;

type ProfilePageProps = {
    route: any;
    navigation: NavigationProp<any>;
}

const UserProfileScreen = ({ route, navigation }: ProfilePageProps) => {
    const { userId } = route.params;
    const [posts, setPosts] = useState<Post[] | null>();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);

    const fetchUserData = async () => {

        const user = await fetchUser(userId);
        const userPosts = await fetchUserPosts(userId);
        if (!user || !userPosts) {
            return <ErrorMessage handler={fetchUserData} />;
        }
        setProfile(user);
        setPosts(userPosts);
        setLoading(false);
    };

    useEffect(() => {
        fetchUserData();
    }, [navigation, route.params.userId]);

    if (loading) {
        return <PageLoader />;
    }

    return (
        <Box variant="pageContainer" pt="0">
            <FlatList width="100%"
                data={posts}
                ListHeaderComponent={<ProfileHeader profile={profile} />}
                renderItem={({ item }) =>
                    <View style={{ width: windowWidth / 3, height: windowWidth / 3 }}>
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

export default UserProfileScreen;
