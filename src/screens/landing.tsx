import { Center, Text, Button, useColorMode, HStack, Switch } from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/navigation';


type LandingScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Landing'
>;

type Props = {
    navigation: LandingScreenNavigationProp;
};

// Color Switch Component
function ToggleDarkMode() {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
      <HStack space={2} alignItems="center">
        <Text>Dark</Text>
        <Switch
          isChecked={colorMode === "light"}
          onToggle={toggleColorMode}
          aria-label={
            colorMode === "light" ? "switch to dark mode" : "switch to light mode"
          }
        />
        <Text>Light</Text>
      </HStack>
    );
    }

export default function LandingScreen({ navigation }: Props) {
    return (
        <Center flex={1} p="5">
            <Text>Hi</Text>
            <Button
                // onPress={() =>
                //     navigation.navigate('SignUp')
                // }
                w="100%"
            >Sign Up</Button>
            <Button
                onPress={() =>
                    navigation.navigate('LogIn')
                }
                w="100%"
            >Log In</Button>
        </Center>
    );  
}


