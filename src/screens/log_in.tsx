import {Text, TextInput, View, Button} from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
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
        <View>
            <Text>Log In</Text>
            <TextInput placeholder="Email" />
            <TextInput placeholder="Password" />
        </View>
    );
}


