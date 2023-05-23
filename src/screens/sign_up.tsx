import { Center, Text, Input } from 'native-base';
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
        <Center flex={1} p="5">
            <Text>Sign Up</Text>
            <Input placeholder="Email" />
            <Input placeholder="Password" />
        </Center>
    );
}


