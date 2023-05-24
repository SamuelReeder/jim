import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { RootStack } from './src/navigation/navigation';
import { NativeBaseProvider } from "native-base";
import theme from './src/styles/theme';
import 'expo-dev-client';
import auth, { FirebaseAuthTypes }from '@react-native-firebase/auth';


export default function App() {

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState<boolean>(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();
  

  // Handle user state changes
  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <RootStack route={user != null ? "Landing" : "LogIn"}/> 
        {/* change stack based on whether first visit ot not  */}
      </NavigationContainer>
    </NativeBaseProvider>
  );
}