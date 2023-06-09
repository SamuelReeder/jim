import { FlatList, Image, Box, Text, VStack, Divider, Button, View, Pressable } from "native-base";
import { useAuth } from "../navigation/auth_provider"
import { Dimensions, SafeAreaView } from "react-native";
import { useRef, useState, useEffect } from "react";
import firestore from "@react-native-firebase/firestore";
import { Post } from "../components";
import { ResizeMode, Video } from 'expo-av';


const windowWidth = Dimensions.get('window').width;



// const testingData = () => {
//     let data: Post[] = [];
//     for (let i = 0; i < 1000; i++) {
//         data.push({ id: i.toString(), img: 'https://preview.redd.it/sydney-sweeney-v0-ltfv5m7n53ja1.jpg?width=640&crop=smart&auto=webp&s=9f741d3d5e826bbf394b15ccac18854f2bd383db' });
//     }
//     return data;
// }

const ProfileHeader = ({ navigation }) => {
    const { account } = useAuth();
    return (
        // <VStack alignItems="center" space={4}>
        //     <Image
        //         alt="Profile Image"
        //         source={{ uri: account?.photoURL }}
        //         size="lg"
        //         rounded="full"
        //     />

        //     <Text fontSize="2xl" bold>
        //         {account?.displayName}
        //     </Text>

        //     <Text fontSize="md" color="gray.500">
        //         {account?.username}
        //     </Text>
        //     <Button onPress={() =>  navigation.navigate('CreatePost')}>
        //         Add post
        //     </Button>
        //     <Divider my={5} />
        // </VStack>
        <VStack
            position="relative"
            alignItems="center"
            // backgroundColor="primary.500" // replace with your desired color
            height={300} // define the height
            width="100%"
            justifyContent="flex-end"
        >
            <Image
                alt="Profile Image"
                source={{ uri: account?.photoURL }}
                size="lg"
                rounded="full"
                position="absolute"
                top={50} // adjust this value to have the image sit on the border, ensure its half the size of the Image
                alignSelf="center"
                borderWidth={4} // border to separate the image from the background
                borderColor="white" // border color
            />

            <Text fontSize="2xl" bold>
                {account?.displayName}
            </Text>

            <Text fontSize="md" color="gray.500">
                {account?.username}
            </Text>
            <Button onPress={() => navigation.navigate('CreatePost')}>
                Add post
            </Button>
            <Divider my={5} />

            {/* <Box
              position="absolute"
            //   bg="black"
              height={60}
              width="100%"
              bottom={-25}
              borderRadius="full"
            //   borderTopLeftRadius={10} // adjust these values to get the desired curve
            //   borderTopRightRadius={10} // adjust these values to get the desired curve
            //   borderRadius="fu"
            /> */}
        </VStack>
    );
};

const ProfileScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>();
    const [loading, setLoading] = useState(false);

    const fetchUserPosts = async () => {
        const userId = user?.uid;
        const postsCollectionRef = firestore().collection('posts');

        // console.log(userId);
        const querySnapshot = await postsCollectionRef
            .where('userId', '==', userId)
            .orderBy('timestamp', 'desc')
            .get();

        let temp: Post[] = [];
        querySnapshot.forEach((documentSnapshot) => {
            // console.log(documentSnapshot.data());
            temp.push(
                documentSnapshot.data() as Post,
                // key: documentSnapshot.id,  // or .key
                // id: documentSnapshot.id,
                // img: documentSnapshot.data().imageUrl,
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
            }
        });

        return unsubscribe;
    }, [navigation, user]);

    return (
        <Box variant="pageContainer" pt="0">
            <FlatList width="100%"
                data={posts}
                ListHeaderComponent={<ProfileHeader navigation={navigation} />}
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
                                    // <Box>Video</Box>
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
