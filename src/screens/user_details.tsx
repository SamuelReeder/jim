import { Center, Text, Input } from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/navigation';

type UserDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'UserDetails'
>;

type Props = {
  navigation: UserDetailsScreenNavigationProp;
};

export default function UserDetailsScreen({navigation}: Props) {
    return (
        <Center flex={1} p="5">
            <Text>Sign Up</Text>
            <Input placeholder="Email" />
            <Input placeholder="Password" />
        </Center>
    );
}


