import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootStack } from './src/navigation/navigation';
import { NativeBaseProvider, extendTheme } from "native-base";
import theme from './src/styles/theme';
import 'expo-dev-client';

// // Define the config
// const config = {
//   useSystemColorMode: false,
//   initialColorMode: 'dark',
// };

// const customTheme = extendTheme({ config });

export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </NativeBaseProvider>
  );
}