import { Text, Input, Box, Heading, KeyboardAvoidingView, Button } from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/auth_navigation';
import { useAuth } from '../navigation/auth_provider';
import PageContainer from '../components/page_container';
import styles from '../styles/styles';
import { Platform } from "react-native";


type UserDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'UserDetails'
>;

type Props = {
  navigation: UserDetailsScreenNavigationProp;
};

export default function UserDetailsScreen({ navigation }: Props) {
  const { user, setUser } = useAuth();

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} flex={1}>
      <Box p="6" flex={1} justifyContent="space-between">
        <Heading marginTop={6} marginX={6} size="lg">Welcome {user?.displayName}, please create a username.</Heading>
        <Input marginX={6} variant="underlined" style={styles.landing_input} py={3} placeholder="Username" />
        <Button
          p="5"
          marginY="5"
          style={styles.landing_button}
          onPress={() => { }}>
          <Text style={styles.login_button}>CONTINUE
          </Text>
        </Button>
      </Box>
    </KeyboardAvoidingView>
  );
}


