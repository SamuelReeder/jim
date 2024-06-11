import React, { useState } from 'react';
import { Image } from 'react-native';
import { Box, VStack, Button, Input, Text, FormControl, ScrollView, Pressable } from 'native-base';
import { useAuth } from '../navigation/auth_provider';
import styles from '../styles/styles';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { updateUserProfile } from '../api/firebase';
import storage from '@react-native-firebase/storage';




const EditProfileScreen = ({ navigation }) => {
    const { account } = useAuth();

    const [username, setUsername] = useState(account?.username || '');
    const [displayName, setDisplayName] = useState(account?.displayName || '');
    const [bio, setBio] = useState(account?.bio || '');

    const [media, setMedia] = useState(account?.photoURL || '');
    const [isNewPhotoSelected, setIsNewPhotoSelected] = useState(false);
    const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

    const pickImage = async () => {
        if (!status?.granted) {
            console.log('permission not granted')
            requestPermission();
        } else {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 5],
                quality: 1,
            });

            console.log(result);

            if (!result.canceled) {
                setMedia(result.assets[0].uri);
                setIsNewPhotoSelected(true);
            }
        }
    };

    const handleUpdateProfile = async () => {
        let photoURL = account?.photoURL || '';
      
        try {
          // Only upload the photo if a new one has been selected
          if (isNewPhotoSelected) {
            // Upload the image to Firebase Storage
            const response = await fetch(media);
            const blob = await response.blob();
      
            // Use username as the image name
            const imageName = username;
      
            const ref = storage().ref().child(`images/${imageName}`);
            await ref.put(blob);
      
            // Get the download URL of the image
            photoURL = await ref.getDownloadURL();
          }
      
          // Update the Firestore document with the new data
          await updateUserProfile(account.uid, username, displayName, bio, photoURL);
          console.log('Profile updated');
      
          setIsNewPhotoSelected(false); // Set back to false after uploading
        } catch (error) {
          console.error('Error updating profile: ', error);
        }
      };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Box variant="headerContainer" p={5} justifyContent="space-between">
                <VStack space={5} width="100%" alignItems="center">
                    <Pressable onPress={pickImage} style={styles.pfpButton}>
                        <Image
                            source={{ uri: account?.photoURL || 'https://via.placeholder.com/150' }}
                            style={styles.pfpImage}
                        />
                        <AntDesign name="camerao" size={15} style={styles.pfpIcon} />

                    </Pressable>
                    <FormControl>
                        <FormControl.Label>Username</FormControl.Label>
                        <Input value={username} onChangeText={setUsername} width="100%" />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Display Name</FormControl.Label>
                        <Input value={displayName} onChangeText={setDisplayName} width="100%" />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Bio</FormControl.Label>
                        <Input value={bio} onChangeText={setBio} width="100%" />
                    </FormControl>
                </VStack>
                <Button style={styles.landing_button} p="5" marginY="5" onPress={() => {
                    handleUpdateProfile();
                    navigation.navigate('Profile');
                }}>
                    <Box justifyContent="center" alignItems="center">
                        <Text
                            style={{
                                color: '#FFFFFF',
                            }}>
                            SUBMIT
                        </Text>
                    </Box>

                </Button>
            </Box>
        </ScrollView>
    );
};

export default EditProfileScreen;
