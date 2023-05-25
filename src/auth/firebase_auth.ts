import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

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