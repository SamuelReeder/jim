import React from 'react';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider } from "native-base";
import theme from './src/styles/theme';
import 'expo-dev-client';
import Providers from './src/navigation/providers';
import {Box } from 'native-base';
import { useFonts } from 'expo-font';
import { Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';


export default function App() {

  // let [fontsLoaded] = useFonts({
  //   Poppins_400Regular,
  //   Poppins_700Bold,
  // });

  // if (!fontsLoaded) {
  //   return null;
  // }

  return (
    <NativeBaseProvider theme={theme}>
      <StatusBar style="dark" />
      <Box flex={1} bg="white">
      <Providers/>
      
      </Box>
    </NativeBaseProvider>
  );
}