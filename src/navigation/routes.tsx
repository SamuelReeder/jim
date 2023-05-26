import React, {useContext, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { useAuth } from './auth_provider';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { RootStack } from './auth_navigation';
import LandingScreen from '../screens/landing';
// import AppStack from './AppStack';
import firestore from '@react-native-firebase/firestore';

import { PageLoader } from '../components/page_loader';
import AppStack from './app_navigation';


const Routes = () => {
  const {user, setUser, account, setAccount} = useAuth();
  const [initializing, setInitializing] = useState(true);
  const [accountLoading, setAccountLoading] = useState(true);  // new state


  const onAuthStateChanged = async (user: FirebaseAuthTypes.User | null) => {
    if (user) {
      const userDocRef = firestore().collection('users').doc(user.uid);
      const docSnapshot = await userDocRef.get();

      if (docSnapshot.exists) {
          setAccount(docSnapshot.data() || null);
          
      } else {
          setAccount(null);
      }
  } else {
      setAccount(null);
  }
    setUser(user);
    if (initializing) setInitializing(false);
    setAccountLoading(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    const fetchAccount = async () => {
        if (user) {
            const userDocRef = firestore().collection('users').doc(user.uid);
            const docSnapshot = await userDocRef.get();

            if (docSnapshot.exists) {
                setAccount(docSnapshot.data() || null);
                
            } else {
                setAccount(null);
            }
        } else {
            setAccount(null);
        }
        
    };

    fetchAccount();
    setAccountLoading(false);
}, [user]);

  if (initializing || accountLoading) return <PageLoader/>;
//   if (initializing) return <Spinner size="lg" />;

  return (
    <NavigationContainer>
      {account ? <AppStack/> : <RootStack/>}
    </NavigationContainer>
  );
};

export default Routes;