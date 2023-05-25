import React, { createContext, useState, useEffect, useContext } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';


export const AuthContext = createContext<{
    user: FirebaseAuthTypes.User | null;
    setUser: React.Dispatch<React.SetStateAction<FirebaseAuthTypes.User | null>>;
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

    GoogleSignin.configure({
        webClientId: '944395723231-vlsnl3sebdddeomjt2joql2c3c19qjte.apps.googleusercontent.com',
    });

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                googleLogin: async () => {
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
                },
                logout: async () => {
                    try {
                        await GoogleSignin.revokeAccess();
                        await auth().signOut();
                    } catch (error) {
                        console.error(error);
                    }
                },
            }}>
            {children}
        </AuthContext.Provider>
    );
};