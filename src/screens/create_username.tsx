import { Text, Input, Box, Heading, KeyboardAvoidingView, Button } from '@gluestack-ui/themed-native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/auth_navigation';
import { useAuth } from '../navigation/auth_provider';
import styles from '../styles/styles';
import { Platform } from "react-native";
import { useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { createFirestoreUser, fetchUser } from '../api';


type UserDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CreateUsername'
>;

type Props = {
  navigation: UserDetailsScreenNavigationProp;
};

export default function UserDetailsScreen({ navigation }: Props) {
  const { user, setUser, account, setAccount } = useAuth();
  const [username, setUsername] = useState<string>("");

  const createUser = () => {
    if (username.trim() == "" || username == null) {
      alert("Please enter a username");
      return;
    } else if (user == null) {
      return;
    } else {
      createFirestoreUser(username, user).then(async () => {
        const temp = await fetchUser(user?.uid);
        setAccount(temp);
      })
    }
    
  }
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} flex={1}>
      <Box p="6" flex={1} justifyContent="space-between">
        <Heading marginTop={6} marginX={6} size="lg">Welcome {user?.displayName}, please create a username.</Heading>
        <Input marginX={6} variant="underlined" style={styles.landing_input} py={3} placeholder="Username"
          onChangeText={(value) =>
            setUsername(value)
          } />
        <Button
          p="5"
          marginY="5"
          style={styles.landing_button}
          onPress={() => createUser()}>
          <Text style={styles.login_button}>CONTINUE
          </Text>
        </Button>
      </Box>
    </KeyboardAvoidingView>
  );
}


