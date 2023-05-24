import React, { useState, useEffect } from 'react';
import { Center, Text, Input, Button, Box, Image, HStack, VStack, Spacer } from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/navigation';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import styles from '../styles/styles';


type LogInScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'LogIn'
>;

type Props = {
    navigation: LogInScreenNavigationProp;
};

export default function LogInScreen({ navigation }: Props) {
    GoogleSignin.configure({
        webClientId: '944395723231-vlsnl3sebdddeomjt2joql2c3c19qjte.apps.googleusercontent.com',
    });

    // Set an initializing state whilst Firebase connects
    // const [initializing, setInitializing] = useState(true);
    // const [user, setUser] = useState();

    // // Handle user state changes
    // function onAuthStateChanged(user) {
    //     setUser(user);
    //     if (initializing) setInitializing(false);
    // }

    // useEffect(() => {
    //     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    //     return subscriber; // unsubscribe on unmount
    // }, []);

    const onGoogleButtonPress = async () => {
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        // Get the users ID token
        const { idToken } = await GoogleSignin.signIn();

        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        // Sign-in the user with the credential
        const user_log_in = auth().signInWithCredential(googleCredential);
        user_log_in.then((user) => {
            console.log(user);
            navigation.navigate('UserDetails')
        }).catch((error) => {
            console.log(error);
        });
    }

    const signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await auth().signOut();
        } catch (error) {
            console.error(error);
        }
    }

    // if (initializing) return null;

    // if (!auth().currentUser) {

    // }
    return (
        <Center flex={1} p="5">
            <VStack space={3} alignItems="center" justifyContent="space-around" flex={1} width="100%">
                <Image
                    source={require('../../assets/logo-no-background.png')}
                    alt="jim"
                    style={{ width: 200, height: 200 }}
                />
                <Box>
                    <Button
                        p="5"
                        marginY="5"
                        style={styles.landing_button}
                        onPress={onGoogleButtonPress}>
                        <HStack width="100%" justifyContent="space-between" alignItems="center" px="3">
                            <Image source={require('../../assets/google.png')}
                                alt="google"
                                style={{ width: 24, height: 24 }} />
                            <Text
                                style={{
                                    color: '#FFFFFF',
                                    fontWeight: 'bold',
                                    fontSize: 16,
                                }}>
                                LOG IN WITH GOOGLE
                            </Text>
                            <Box style={{ width: 24, height: 24 }}></Box>
                        </HStack>
                    </Button>
                </Box>
            </VStack>
        </Center>
    );
}

