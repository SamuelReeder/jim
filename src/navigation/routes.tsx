import React, { useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { useAuth } from './auth_provider';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { RootStack } from './auth_navigation';
import firestore from '@react-native-firebase/firestore';
import { useFonts } from 'expo-font';
import { Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';

import { PageLoader } from '../components';
import AppStack from './app_navigation';


const Routes = () => {
  const {user, setUser, account, setAccount} = useAuth();
  const [initializing, setInitializing] = useState(true);
  const [accountLoading, setAccountLoading] = useState(true);  // new state

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const onAuthStateChanged = async (user: FirebaseAuthTypes.User | null) => {
    if (user) {
      console.log("read 3")
      const userDocRef = firestore().collection('users').doc(user.uid);
      const docSnapshot = await userDocRef.get();

      if (docSnapshot.exists) {
          setAccount(docSnapshot.data() || null);
          
      } 
    }
    setUser(user);
    if (initializing) setInitializing(false);
    setAccountLoading(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing || accountLoading || !fontsLoaded) return <PageLoader/>;

  return (
    <NavigationContainer>
      {account ? <AppStack/> : <RootStack/>}
    </NavigationContainer>
  );
};

export default Routes;