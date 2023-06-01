import 'react-native-get-random-values';
import { Box, Button, Image } from "native-base";
import { useState, useEffect } from "react";
import * as MediaLibrary from 'expo-media-library';
import { v4 as uuidv4 } from 'uuid';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../navigation/auth_provider';
import { Post } from '../components/types';


const AddPostScreen = ({ navigation }) => {
    // const [image, setImage] = useState<string | null>(null);
    const [media, setMedia] = useState<{ uri: string, type: string, duration?: number } | null>(null);
    // const [status, requestPermission] = MediaLibrary.usePermissions();
    const [uploading, setUploading] = useState(false);
    const { user } = useAuth();


    // const createPostDocument = async (post: Post) => {
    //     post.timestamp = firestore.FieldValue.serverTimestamp();
    //     await firestore().collection('posts').doc(post.id).set(post);
    // };

    // const pickImage = async () => {

    //     if (!status?.granted) {
    //         console.log('permission not granted')
    //         requestPermission();
    //     } else {
    //         let result = await ImagePicker.launchImageLibraryAsync({
    //             mediaTypes: ImagePicker.MediaTypeOptions.All,
    //             allowsEditing: true,
    //             aspect: [4, 3],
    //             quality: 1,
    //         });

    //         console.log(result);
    //         if (!result.canceled) {
    //             setImage(result.assets[0].uri);
    //         }
    //     }
    // };
    const pickMedia = async () => {
        const { status } = await MediaLibrary.getPermissionsAsync();
        if (status !== 'granted') {
            console.log('permission not granted')
            const permissionResult = await MediaLibrary.requestPermissionsAsync();
            if (permissionResult.accessPrivileges === 'none') {
                alert('Permission to access media library is denied');
                return;
            }
        }

        let result = await MediaLibrary.getAssetsAsync({
            first: 1, // Limit to one media item
            mediaType: ['photo', 'video'], // Allow photos and videos
        });

        if (result.assets.length > 0) {
            setMedia({
                uri: result.assets[0].uri,
                type: result.assets[0].mediaType,
                duration: result.assets[0].duration,  // Optional. Will be undefined for images.
            });
        }
    };
    
    // const submitImage = async () => {
    //     if (image === null) {
    //         alert('No image has been selected.');
    //         return;
    //     }
    //     const response = await fetch(image);
    //     const blob = await response.blob();

    //     // const ref = storage().ref().child(`images/${uuidv4()}`);

    //     const ref = storage().ref(`images/${Date.now()}`);
    //     setUploading(true);

    //     const snapshot = await ref.put(blob);

    //     console.log('Image uploaded to the bucket!')

    //     const imageUrl = await ref.getDownloadURL();

    //     const postRef = firestore().collection('posts').doc();

    //     await postRef.set({
    //         id: postRef.id,
    //         userId: user?.uid,
    //         imageUrl: imageUrl,
    //         comments: [],
    //         likes: 0,
    //         timestamp: firestore.FieldValue.serverTimestamp(),
    //         pinned: false,
    //     } as Post);

    //     setUploading(false);
    //     setImage(null);

    //     navigation.navigate("Profile");
    // }

    const submitMedia = async () => {
        if (media === null) {
            alert('No media has been selected.');
            return;
        }
        const response = await fetch(media.uri);
        const blob = await response.blob();

        // const ref = storage().ref().child(`images/${uuidv4()}`);
        const ref = storage().ref(`images/${Date.now()}`);
        setUploading(true);

        const snapshot = await ref.put(blob);

        console.log('Media uploaded to the bucket!')

        const mediaUrl = await ref.getDownloadURL();

        const postRef = firestore().collection('posts').doc();

        await postRef.set({
            id: postRef.id,
            userId: user?.uid,
            imageUrl: mediaUrl,
            comments: [],
            likes: 0,
            timestamp: firestore.FieldValue.serverTimestamp(),
            pinned: false,
            // Add media type and duration information to the post
            mediaType: media.type,
            duration: media.type === 'video' ? media.duration : undefined,
        } as Post);

        setUploading(false);
        setMedia(null);

        navigation.navigate("Profile");
    }

    // useEffect(() => {
    //     if (status?.accessPrivileges === 'none') {
    //         alert('Permission to access media library is denied');
    //     }
    // }, [status]);

    return (
        <Box safeArea flex={1} justifyContent="center" alignItems="center">
            <Button onPress={pickMedia} >Pick an image from camera roll</Button>
            {media && <Image source={{ uri: media.uri }} style={{ width: 200, height: 200 }} alt="post" />}
            <Button onPress={submitMedia} >
                Go back
            </Button>
        </Box>
    );
};

export default AddPostScreen;