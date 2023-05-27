import { FlatList, Image, Box, Text, VStack, Divider } from "native-base";
import { useAuth } from "../navigation/auth_provider"
import { Dimensions, SafeAreaView } from "react-native";
import { useRef, useState, useEffect } from "react";

const windowWidth = Dimensions.get('window').width;

const fetchMorePosts = async (offset, limit) => {
    // Implement your logic to fetch more posts here.
    // This function should return a Promise that resolves to an array of posts.
};

const testingData = () => {
    let data = [];
    for (let i = 0; i < 1000; i++) {
        data.push({ id: i.toString(), img: require('../../assets/logo-no-background.png') });
    }
    return data;
}

const ProfileHeader = () => {
    const { account } = useAuth();
    return (
        <VStack alignItems="center" space={4} mt={5}>
            <Image
                alt="Profile Image"
                source={{ uri: account?.photoURL }} // Change to your profile image url
                size="lg"
                rounded="full"
            />

            <Text fontSize="2xl" bold>
                {account?.displayName}
            </Text>

            <Text fontSize="md" color="gray.500">
                {account?.username}
            </Text>

            <Divider my={5} />
        </VStack>
    );
};

const ProfileScreen = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState(testingData());
    const [loading, setLoading] = useState(false);
    // const postsRef = useRef<FlatList<any>>(null);

    // const scrollToTop = () => {
    //     postsRef.current?.scrollToOffset({ animated: true, offset: 0 });
    //   };
    const loadMorePosts = async () => {
        if (!loading) {
            setLoading(true);

            const morePosts = await fetchMorePosts(posts.length, 10);
            // setPosts(prevPosts => [...prevPosts, ...morePosts]);

            setLoading(false);
        }
    };

    // useEffect(() => {
    //     loadMorePosts();
    // }, []);

    return (
        <Box safeArea flex={1}>
            <FlatList
                data={posts}
                ListHeaderComponent={ProfileHeader}
                renderItem={({ item }) =>
                    <Image
                        source={item.img}
                        alt={item.id}
                        style={{ width: windowWidth / 3, height: windowWidth / 3 }}
                    />}
                keyExtractor={item => item.id}
                numColumns={3}
            />
        </Box>
    );
}

// const Post = ({photo, index}: {photo: any, index: number}) => (
//     <Image
//                     source={item.img}
//                     alt={item.id}
//                     style={{ width: windowWidth / 3, height: windowWidth / 3 }}
//                 />

export default ProfileScreen;
