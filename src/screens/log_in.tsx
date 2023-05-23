import React from 'react';
import { Center, Text, Input } from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/navigation';

type LogInScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LogIn'
>;

type Props = {
  navigation: LogInScreenNavigationProp;
};

export default function LogInScreen({navigation}: Props) {
    return (
        <Center flex={1} p="5">
            <Text>Log In</Text>
            
        </Center>
    );
}


