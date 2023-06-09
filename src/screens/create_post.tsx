// import 'react-native-get-random-values';
import { Box, Button, Image } from "native-base";
import { useState, useEffect } from "react";
// import { v4 as uuidv4 } from 'uuid';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../navigation/auth_provider';
import { Post, Media } from '../components/types';
import * as ImagePicker from 'expo-image-picker';
import { ResizeMode, Video } from 'expo-av';
import { FlatList, Dimensions } from 'react-native';


const CreatePostScreen = ({ navigation }) => {
    // // const [image, setImage] = useState<string | null>(null);
    // const [media, setMedia] = useState<{ uri: string, type: string, duration?: number } | null>(null);
    // // const [status, requestPermission] = MediaLibrary.usePermissions();
    // const [uploading, setUploading] = useState(false);
    // const { user } = useAuth();
    const [image, setImage] = useState<ImagePicker.ImagePickerAsset[] | null>(null);
    const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
    const [uploading, setUploading] = useState(false);
    const { user } = useAuth();


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
                aspect: [4, 3],
                quality: 1,
            });

            // console.log(result);

            console.log(result);
            if (!result.canceled) {
                // setImage(result.assets[0]);
                setImage([
                    result.assets[0]
                ]);

            }
        }
    };

    const submitImage = async () => {
        if (image === null) {
            alert('No image has been selected.');
            return;
        }
        const response = await fetch(image[0].uri);
        const blob = await response.blob();

        // const ref = storage().ref().child(`images/${uuidv4()}`);
        // const id = Math.random().toString(36).substring(7);
        // const id = image[0].assetId?.toString();
        // console.log(id)

        // if (id == null) {
        //     alert('Error uploading image. ASSETID');
        //     return;
        // }

        const ref = storage().ref(`images/${Date.now()}`);
        setUploading(true);

        const snapshot = await ref.put(blob);

        console.log('Image uploaded to the bucket!')

        const imageUrl = await ref.getDownloadURL();

        const postRef = firestore().collection('posts').doc();

        if (user === null) {
            alert('Error uploading image.');
            return;
        }

        console.log(image[0])
        console.log(blob.size)
        const post: Post = {
            id: postRef.id,
            userId: user.uid,
            description: 'Hi',
            comments: [],
            likes: 0,
            timestamp: firestore.FieldValue.serverTimestamp(),
            pinned: false,
            media: [{
                type: image[0].type, // Assuming the `image` object has a `type` property
                url: imageUrl,
                resolution: [image[0].width, image[0].height], // Assuming the `image` object has `width` and `height` properties
                aspectRatio: [image[0].width / image[0].height, 1], // Assuming the `image` object has `width` and `height` properties
                // thumbnail: imageUrl, // You can generate a separate thumbnail if needed. For now, using the same imageUrl
                // duration: image[0].duration, // Assuming the `image` object has a `duration` property for videos
                size: blob.size, // Assuming the `blob` object has a `size` property
            } as Media],
        };

        console.log(post);

        await postRef.set(post);

        setUploading(false);
        setImage(null);

        navigation.navigate("Profile");
    }

    // useEffect(() => {
    //     if (status?.accessPrivileges === 'none') {
    //         alert('Permission to access media library is denied');
    //     }
    // }, [status]);

    return (
        <Box safeArea flex={1} justifyContent="center" alignItems="center">
            <Button onPress={pickImage}>Pick an image from camera roll</Button>

            {image && (
                <FlatList
                    data={image} // take only first 5 items
                    keyExtractor={(item, index) => "" + index}
                    renderItem={({ item }) => (
                        <Box alignItems="center">
                            {item.type == 'image' ? (
                                <Image
                                    source={{ uri: item.uri }}
                                    style={{ width: 200, height: 200 }}
                                    alt="post"
                                />
                            ) : (
                                <Video
                                    source={{ uri: item.uri }}
                                    style={{ width: 200, height: 200 }}
                                    resizeMode={ResizeMode.COVER}
                                    isLooping
                                    shouldPlay
                                />
                                // <Box>Video</Box>
                            )}
                        </Box>
                    )}
                />
            )}

            <Button onPress={submitImage}>Go back</Button>
        </Box>
    );
};

export default CreatePostScreen;