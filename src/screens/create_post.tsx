// import 'react-native-get-random-values';
import { Box, Button, Image, Text, Input, KeyboardAvoidingView, HStack, Pressable } from "native-base";
import { useState, useEffect, useContext, createContext } from "react";
// import { v4 as uuidv4 } from 'uuid';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../navigation/auth_provider';
import { Post, Media } from '../components/types';
import * as ImagePicker from 'expo-image-picker';
import { ResizeMode, Video } from 'expo-av';
import styles from '../styles/styles';
import { FlatList, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { createStackNavigator } from "@react-navigation/stack";
import Animated, {
        useSharedValue,
        withTiming,
        useAnimatedStyle,
        Easing,
} from 'react-native-reanimated';


const windowWidth = Dimensions.get('window').width;

const PostContext = createContext<{
    media: ImagePicker.ImagePickerAsset[] | null,
    setMedia: React.Dispatch<React.SetStateAction<ImagePicker.ImagePickerAsset[] | null>>,
    currentIndex: number,
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
    description: string,
    setDescription: React.Dispatch<React.SetStateAction<string>>,
    tags: string[],
    setTags: React.Dispatch<React.SetStateAction<string[]>>,
} | undefined>(undefined);


const PostStack = createStackNavigator();

const CreatePostProvider = ({ navigation }) => {
    const [media, setMedia] = useState<ImagePicker.ImagePickerAsset[] | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [description, setDescription] = useState<string>('');
    const [tags, setTags] = useState<string[] | null>(null));

    const context = { media, setMedia, currentIndex, setCurrentIndex, description, setDescription, tags, setTags };

    return (
        <PostContext.Provider value={context}>
            <PostStack.Navigator initialRouteName="CreatePost">
                <PostStack.Screen name="CreatePost" component={CreatePostScreen} options={{ headerShown: false }} />
                <PostStack.Screen name="FinalizePost" component={FinalizePostScreen} options={{ headerShown: false }} />
            </PostStack.Navigator>
        </PostContext.Provider>
    );
}

const CreatePostScreen = ({ navigation }) => {
    // const [media, setMedia] = useState<ImagePicker.ImagePickerAsset[] | null>(null);
    // const [currentIndex, setCurrentIndex] = useState<number>(0);
    const context = useContext(PostContext);
    if (!context) {
        throw new Error("useAuth must be used within a AuthProvider");
    }

    const { media, setMedia, currentIndex, setCurrentIndex } = context;
    const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();


    const createPostDocument = async (post: Post) => {
        post.timestamp = firestore.FieldValue.serverTimestamp();
        await firestore().collection('posts').doc(post.id).set(post);
    };

    const pickImage = async () => {

        if (!status?.granted) {
            console.log('permission not granted')
            requestPermission();
        } else {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 5],
                quality: 1,
            });

            console.log(result);
            if (!result.canceled) {

                if (media === null) {
                    setMedia([result.assets[0]]);
                    return;
                }

                let tempArr = media.slice();

                if (currentIndex < tempArr.length) {
                    tempArr[currentIndex] = result.assets[0];
                } else {
                    tempArr.push(result.assets[0]);
                }

                setMedia(tempArr);
            }
        }
    };

    const removeMediaAt = (index: number) => {
        let newMedia = media?.slice();
        if (newMedia === undefined) {
            return;
        }
        newMedia.splice(index, 1);
        setMedia(newMedia);
        setCurrentIndex(currentIndex - 1)
    };

    return (
        <Box variant="createPostContainer">
            {(media === null || currentIndex == media.length || media.length == 0) ? (
                <Box width={windowWidth} height={windowWidth} backgroundColor="gray.200" justifyContent="center" alignItems="center">
                    <TouchableOpacity style={styles.circleButton} onPress={pickImage}>
                        <AntDesign name="plus" size={30} color="white" />
                    </TouchableOpacity>
                </Box>
            ) : (
                <Box width={windowWidth} justifyContent="center" alignItems="center">
                    <Pressable onPress={pickImage}>
                        {media[currentIndex].type == 'image' ? (
                            <Image
                                alt="Post Image"
                                source={{ uri: media[currentIndex].uri }}
                                resizeMode="contain"
                                style={{ width: windowWidth, height: windowWidth }} // Set height to screenWidth as well to maintain aspect ratio. Adjust as needed.
                            />
                        ) : (
                            <Video
                                source={{ uri: media[currentIndex].uri }}
                                style={{ width: windowWidth, height: windowWidth }}
                                resizeMode={ResizeMode.COVER}
                                isLooping
                                shouldPlay
                            />
                        )}
                    </Pressable>
                </Box>
            )}
            {/* <KeyboardAvoidingView behavior="height"> */}
            <Box width="100%" flex={1} p="3" justifyContent="space-between">

                {/* <Input marginX={6} variant="underlined" style={styles.landing_input} py={3} placeholder="Provide an optional description" maxLength={280}
                    onChangeText={(value) =>
                        console.log(value)
                    } /> */}


                {media !== null && media.length != 0 ? (
                    <HStack>
                        {media.map((element, index) => (
                            <View style={{ width: windowWidth / 4 - 6, height: windowWidth / 4 - 6 }} key={index}>
                                <TouchableOpacity style={{ position: 'absolute', top: 0, right: 0, padding: 5, zIndex: 1 }} onPress={() => removeMediaAt(index)}>
                                    <AntDesign name="closecircle" size={24} color="black" />
                                </TouchableOpacity>
                                <Box flex={1} margin="0.5">
                                    <Pressable onPress={() => setCurrentIndex(index)}>
                                        {element.type === 'image' ? (
                                            <Image
                                                source={{ uri: element.uri }}
                                                alt="media"
                                                style={{ borderRadius: 10 }}
                                                resizeMode="cover"
                                                height="100%"
                                                width="100%"
                                            />
                                        ) : (
                                            <Video
                                                source={{ uri: element.uri }}
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
                        ))}
                        {media.length < 6 &&
                            <Box width={windowWidth / 4 - 6} height={windowWidth / 4 - 6} backgroundColor="gray.200" justifyContent="center" alignItems="center" style={{ borderRadius: 10 }} margin="0.5">
                                <TouchableOpacity style={styles.circleButton} onPress={() => {
                                    setCurrentIndex(media.length)
                                    // pickImage()
                                }}>
                                    <AntDesign name="plus" size={30} color="white" />
                                </TouchableOpacity>
                            </Box>
                        }
                    </HStack>
                ) : (
                    <Box></Box>
                )
                }
                <Button style={styles.landing_button} p="5" marginY="5" onPress={() => navigation.navigate("FinalizePost")}>CONTINUE</Button>
            </Box>
            {/* </KeyboardAvoidingView> */}
        </Box>

    );
};

const FinalizePostScreen = ({ navigation }) => {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error("useAuth must be used within a AuthProvider");
    }

    const tagList = ["PR", "Progress"];
    const { media, currentIndex, description, setDescription, tags, setTags } = context;
    const [uploading, setUploading] = useState(false);
    const { user, account } = useAuth();

    const submitPost = async () => {
        if (media === null || user === null || media == null || media.length == 0) {
            alert('No image has been selected.');
            return;
        }
        
        setUploading(true);

        const postRef = firestore().collection('posts').doc();

        let mediaArr = [];
        for (let i = 0; i < media.length; i++) {
            const response = await fetch(media[i].uri);
            const blob = await response.blob();

            const ref = storage().ref(`images/${Date.now()}`);
            

            await ref.put(blob);

            console.log('Image uploaded to the bucket!')

            const imageUrl = await ref.getDownloadURL();

            mediaArr.push({
                type: media[i].type,
                url: imageUrl,
                resolution: [media[i].width, media[i].height],
                aspectRatio: [media[i].width / media[i].height, 1], 
                // thumbnail: imageUrl, // You can generate a separate thumbnail if needed. For now, using the same imageUrl
                duration: media[i].duration ? media[i].duration : 0, 
                size: blob.size,
            } as Media);
        }

        const post: Post = {
            id: postRef.id,
            userId: user.uid,
            description: description,
            comments: [],
            currentLikeDocId: 0,
            likesCount: 0,
            timestamp: firestore.FieldValue.serverTimestamp(),
            pinned: false,
            tags: tags == null ? ["misc"] : tags,
            media: mediaArr,
        };

        console.log(post);

        await postRef.set(post);

        const likesRef = postRef.collection('likes').doc('likeDoc');
        await likesRef.set({ likes: [] });

        setUploading(false);

        // if (post.tags.includes("Progress")) {
        //     account.set
        // }
        // setMedia(null);

        navigation.navigate("Profile");
    }

    const randomWidth = useSharedValue(10);

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const anim = useAnimatedStyle(() => {
    return {
      width: withTiming(randomWidth.value, config),
    };
  });

    return (
        <Box variant="createPostContainer" justifyContent="space-between" px="4" py="2">
            <Box variant="createPostContainer">
                {media !== null && media.length != 0 ? (
                    <HStack py="4">
                        {media.map((element, index) => (
                            <View style={{ width: windowWidth / 4 - 6, height: windowWidth / 4 - 6 }} key={index}>
                                <Box flex={1} margin="0.5">
                                    {element.type === 'image' ? (
                                        <Image
                                            source={{ uri: element.uri }}
                                            alt="media"
                                            style={{ borderRadius: 10 }}
                                            resizeMode="cover"
                                            height="100%"
                                            width="100%"
                                        />
                                    ) : (
                                        <Video
                                            source={{ uri: element.uri }}
                                            style={{ borderRadius: 10, height: '100%', width: '100%' }}
                                            resizeMode={ResizeMode.COVER}
                                            isLooping
                                            isMuted
                                            shouldPlay
                                        />
                                    )}
                                </Box>
                            </View>
                        ))}
                    </HStack>
                ) : (
                    null
                )
                }
                <HStack justifyContent="flex-start" width="100%" mb={3}>
                    {tagList.map((tag: string) => (
                        <Button
                            key={tag}
                            variant="tag"
                            // TODO: CHANGE COLOUR BASED ON SELECTION
                            backgroundColor={tags.includes(tag) ? "red.400" : "red.200"}
                            color="white"
                            startIcon={<AntDesign name="tagso" size={24} color="black" />}
                            onPress={() => {
                                if (tags.includes(tag)) {
                                    setTags(tags.filter((t: string) => t !== tag));
                                } else {
                                    setTags([...tags, tag]);
                                }
                            }}>
                            {tag}</Button>
                    ))}
                </HStack>
                <Input variant="underlined" style={styles.landing_input} py={3} placeholder="Provide an optional description" maxLength={280}
                    onChangeText={(value) =>
                        setDescription(value)
                    } />
            </Box>
            <Button style={styles.landing_button} p="5" marginY="5" onPress={submitPost}>
                <Box justifyContent="center" alignItems="center">
                    <Text
                        style={{
                            color: '#FFFFFF',
                            // fontSize: 20,
                        }}>
                        SUBMIT
                    </Text>
                    {/* npm i react-native-progress */}
                </Box>

            </Button>
        </Box>
    );
};

export default CreatePostProvider;