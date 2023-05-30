import 'react-native-get-random-values';
import { Box, Button, Image } from "native-base";
import { useState, useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';
import { v4 as uuidv4 } from 'uuid';
import auth from "@react-native-firebase/auth";
import storage from '@react-native-firebase/storage';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useAuth } from '../navigation/auth_provider';


type Post = {
    id: string;
    userId: string;
    imageUrl: string;
    comments: string[];
    likes: number;
    timestamp: FirebaseFirestoreTypes.FieldValue;
    pinned: boolean;
};

//   const createUserDocument = async (user: User) => {
//     await firestore().collection('users').doc(user.id).set(user);
//   };

const AddPostScreen = ({ navigation }) => {
    const [image, setImage] = useState<string | null>(null);
    const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
    const [uploading, setUploading] = useState(false);
    const { user } = useAuth();


    const createPostDocument = async (post: Post) => {
        post.timestamp = firestore.FieldValue.serverTimestamp();
        await firestore().collection('posts').doc(post.id).set(post);
    };

    const pickImage = async () => {
        // const { status }= await ImagePicker.requestMediaLibraryPermissionsAsync();

        // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        // if (status !== 'granted') {
        //     alert('Sorry, we need camera roll permissions to make this work!');
        if (!status?.granted) {
            console.log('permission not granted')
            requestPermission();
        } else {
            // No permissions request is necessary for launching the image library
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            console.log(result);

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        }
    };

    const submitImage = async () => {
        if (image === null) {
            alert('No image has been selected.');
            return;
        }
        const response = await fetch(image);
        const blob = await response.blob();

        // const ref = storage().ref().child(`images/${uuidv4()}`);

        const ref = storage().ref(`images/${Date.now()}`);
        setUploading(true);

        const snapshot = await ref.put(blob);

        console.log('Image uploaded to the bucket!')

        const imageUrl = await ref.getDownloadURL();

        const postRef = firestore().collection('posts').doc();

        await postRef.set({
            id: postRef.id,
            userId: user?.uid,
            imageUrl: imageUrl,
            comments: [],
            likes: 0,
            timestamp: firestore.FieldValue.serverTimestamp(),
            pinned: false,
        } as Post);

        setUploading(false);
        setImage(null);

        navigation.navigate("Profile");
    }

    useEffect(() => {
        if (status?.accessPrivileges === 'none') {
            alert('Permission to access media library is denied');
        }
    }, [status]);

    return (
        <Box safeArea flex={1} justifyContent="center" alignItems="center">
            <Button onPress={pickImage} >Pick an image from camera roll</Button>
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} alt="post" />}
            <Button onPress={submitImage} >
                Go back
            </Button>
        </Box>
    );
};

export default AddPostScreen;