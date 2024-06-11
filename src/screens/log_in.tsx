import {useEffect}from 'react';
import { Center, Text, Input, Button, Box, Image, HStack, VStack, Spacer } from '@gluestack-ui/themed-native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/auth_navigation';
import styles from '../styles/styles';
import { useAuth } from '../navigation/auth_provider';
import { PageContainer } from '../components';


type LogInScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'LogIn'
>;

type Props = {
    navigation: LogInScreenNavigationProp;
};

export default function LogInScreen({ navigation }: Props) {
    const { user, setUser, account, setAccount, googleLogin } = useAuth();

    
    useEffect(() => {
        // If user is logged in, account data is loaded, but account does not exist
        if (user && !account) {
          navigation.navigate('CreateUsername');
        }
      }, [user]); // Run this code when user, account, or accountLoading changes

      
    return (
        <PageContainer>
            <VStack space={3} alignItems="center" justifyContent="space-around" flex={1} width="100%">
                <Image
                    source={require('../../assets/logo-no-background.png')}
                    alt="jim"
                    style={{ width: 200, height: 200 }}
                />
                <Box>
                    <Button
                        p="5"
                        marginY="5"
                        style={styles.landing_button}
                        onPress={() => {
                            googleLogin()
                            // .then(() => {
                                // const user = auth().currentUser;
                                // const userDocRef = firestore().collection('users').doc(user?.uid);
                                // console.log("1 read")

                                // userDocRef.get().then((docSnapshot) => {
                                //     if (docSnapshot.exists) {
                                //         // If the document exists, navigate to the app
                                //         setAccount(docSnapshot.data());
                                //     } else {
                                //         // If the document doesn't exist, navigate to CreateUsername
                                //         navigation.navigate('CreateUsername');
                                //     }
                                // });
                            //     console.log('user', user);
                            //     console.log('account', account);
                            //     if (user && !account) {
                            //         navigation.navigate('CreateUsername');
                            //     }
                            // });
                        }
                        }
                    >
                        <HStack width="100%" justifyContent="space-between" alignItems="center" px="3">
                            <Image source={require('../../assets/google.png')}
                                alt="google"
                                style={{ width: 24, height: 24 }} />
                            <Text
                                style={{
                                    color: '#FFFFFF',
                                    fontWeight: 'bold',
                                    fontSize: 16,
                                }}>
                                LOG IN WITH GOOGLE
                            </Text>
                            <Box style={{ width: 24, height: 24 }}></Box>
                        </HStack>
                    </Button>
                </Box>
            </VStack>
        </PageContainer >
    );
}

