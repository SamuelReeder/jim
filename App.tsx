import React from 'react';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider } from "native-base";
import theme from './src/styles/theme';
import 'expo-dev-client';
import Providers from './src/navigation/providers';
import {Box } from 'native-base';


export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
      <StatusBar style="dark" />
      <Box flex={1} bg="white">
      <Providers/>
      
      </Box>
    </NativeBaseProvider>
  );
}