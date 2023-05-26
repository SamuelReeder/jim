import React, {useContext, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { useAuth } from './auth_provider';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { RootStack } from './auth_navigation';
import LandingScreen from '../screens/landing';
// import AppStack from './AppStack';

import { Spinner } from 'native-base';
import AppStack from './app_navigation';


const Routes = () => {
  const {user, setUser, account, setAccount} = useAuth();
  const [initializing, setInitializing] = useState(true);

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;
//   if (initializing) return <Spinner size="lg" />;

  return (
    <NavigationContainer>
      {user && account ? <AppStack/> : <RootStack/>}
    </NavigationContainer>
  );
};

export default Routes;