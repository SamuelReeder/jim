import {Text, TextInput, View, Button} from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/navigation';

type SignUpScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SignUp'
>;

type Props = {
  navigation: SignUpScreenNavigationProp;
};

export default function SignUpScreen({navigation}: Props) {
    return (
        <View>
            <Text>Sign Up</Text>
            <TextInput placeholder="Email" />
            <TextInput placeholder="Password" />
        </View>
    );
}


