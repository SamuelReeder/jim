import React, { createContext, useState, useContext } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { User } from '../components';


export const AuthContext = createContext<{
    user: FirebaseAuthTypes.User | null;
    setUser: React.Dispatch<React.SetStateAction<FirebaseAuthTypes.User | null>>;
    account: User | null;
    setAccount: React.Dispatch<React.SetStateAction<any>>;
    googleLogin: () => Promise<void>;
    logout: () => Promise<void>;
} | undefined>(undefined);


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
};


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [account, setAccount] = useState<User | null>(null);

    GoogleSignin.configure({
        webClientId: '944395723231-vlsnl3sebdddeomjt2joql2c3c19qjte.apps.googleusercontent.com',
    });

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                account,
                setAccount,
                googleLogin: async () => {
                    try {
                        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
                        // Get the users ID token
                        const { idToken } = await GoogleSignin.signIn();

                        // Create a Google credential with the token
                        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

                        // Sign-in the user with the credential
                        const user_log_in = auth().signInWithCredential(googleCredential);
                        user_log_in.then((temp_user) => {
                            console.log(temp_user);
                        }).catch((error) => {
                            console.log(error);
                        });

                    } catch (error) {
                        console.log(error);
                    }
                },
                logout: async () => {
                    try {
                        await GoogleSignin.revokeAccess();
                        await auth().signOut().then(() => {
                            setAccount(null);
                            console.log('User signed out!');
                        });
                    } catch (error) {
                        console.error(error);
                    }
                },
            }}>
            {children}
        </AuthContext.Provider>
    );
};