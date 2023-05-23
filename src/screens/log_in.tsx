import React, { useState, useEffect } from 'react';
import { Center, Text, Input, Button } from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/navigation';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

type LogInScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'LogIn'
>;

type Props = {
    navigation: LogInScreenNavigationProp;
};

type User = {
    email: string;
    username: string;
    id: string;
}

export default function LogInScreen({ navigation }: Props) {
    GoogleSignin.configure({
        webClientId: '944395723231-vlsnl3sebdddeomjt2joql2c3c19qjte.apps.googleusercontent.com',
    });

    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

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
            return user;
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

    if (initializing) return null;

    if (!user) {
        return (
            <Center flex={1} p="5">
                <GoogleSigninButton
                    style={{ width: 192, height: 48 }}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={onGoogleButtonPress}
                />
            </Center>
        );
    }
    return (
        <Center flex={1} p="5">
            <Text>Welcome {user.email}</Text>
            <Button onPress={signOut}>Sign out</Button>
        </Center>
    );
}


