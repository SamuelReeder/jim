import { FlatList, Image, Box, Text, VStack, Divider, Button } from "native-base";
import { useAuth } from "../navigation/auth_provider"
import { Dimensions, SafeAreaView } from "react-native";
import { useRef, useState, useEffect } from "react";
import firestore from "@react-native-firebase/firestore";
import { Post } from "../components";

const windowWidth = Dimensions.get('window').width;



const testingData = () => {
    let data: Post[] = [];
    for (let i = 0; i < 1000; i++) {
        data.push({ id: i.toString(), img: 'https://preview.redd.it/sydney-sweeney-v0-ltfv5m7n53ja1.jpg?width=640&crop=smart&auto=webp&s=9f741d3d5e826bbf394b15ccac18854f2bd383db' });
    }
    return data;
}

const ProfileHeader = ({navigation}) => {
    const { account } = useAuth();
    return (
        <VStack alignItems="center" space={4} mt={5}>
            <Image
                alt="Profile Image"
                source={{ uri: account?.photoURL }}
                size="lg"
                rounded="full"
            />

            <Text fontSize="2xl" bold>
                {account?.displayName}
            </Text>

            <Text fontSize="md" color="gray.500">
                {account?.username}
            </Text>
            <Button onPress={() =>  navigation.navigate('CreatePost')}>
                Add post
            </Button>
            <Divider my={5} />
        </VStack>
    );
};

const ProfileScreen = ({navigation}) => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>();
    const [loading, setLoading] = useState(false);

    const fetchUserPosts = async () => {
        const userId = user?.uid;
        const postsCollectionRef = firestore().collection('posts');
      
        console.log(userId);
        const querySnapshot = await postsCollectionRef
          .where('userId', '==', userId)
          .orderBy('timestamp', 'desc')
          .get();

        console.log(querySnapshot.empty);
      
        let temp: Post[] = [];
        querySnapshot.forEach((documentSnapshot) => {
            console.log(documentSnapshot.data());
            temp.push({
            // ...documentSnapshot.data(),
            // key: documentSnapshot.id,  // or .key
            id: documentSnapshot.id,
            img: documentSnapshot.data().imageUrl,
          });
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
        <Box safeArea flex={1}>
            <FlatList
                data={posts}
                ListHeaderComponent={<ProfileHeader navigation={navigation}/>}
                renderItem={({ item }) =>
                    <Image
                        source={{ uri: item.img}}
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
