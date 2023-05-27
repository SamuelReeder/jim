import { Text, Input, Box, Heading, KeyboardAvoidingView, Button } from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/auth_navigation';
import { useAuth } from '../navigation/auth_provider';
import PageContainer from '../components/page_container';
import styles from '../styles/styles';
import { Platform } from "react-native";
import { useState } from 'react';
import firestore from '@react-native-firebase/firestore';


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
    console.log('here')
    console.log(user);
    console.log(username);
    firestore()
      .collection('users')
      .doc(user?.uid)
      .set({
        username: username,
        // uid: user?.uid,
        displayName: user?.displayName,
        email: user?.email,
        metadata: user?.metadata,
        phoneNumber: user?.phoneNumber,
        photoURL: user?.photoURL,

      })
      .then(() => {
        console.log('User added!');
        firestore().collection('users').doc(user?.uid).get().then((docSnapshot) => {
          console.log("2 read")
          if (docSnapshot.exists) {

            setAccount(docSnapshot.data());
          } else {
            console.log("User not found");
          }
          // navigation.navigate('App');
        }).catch((error) => {
          console.log(error);
        });
      }).catch((error) => {
        console.log(error);
      });
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


