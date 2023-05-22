import { Text, TextInput, View, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/navigation';


type LandingScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Landing'
>;

type Props = {
    navigation: LandingScreenNavigationProp;
};

export default function LandingScreen({ navigation }: Props) {
    return (
        <View>
            <Text>Welcome</Text>
            <Button
                title="Sign Up"
                onPress={() =>
                    navigation.navigate('SignUp')
                }
            />
            <Button
                title="Log In"
                onPress={() =>
                    navigation.navigate('LogIn')
                }
            />
        </View>
    );
}


