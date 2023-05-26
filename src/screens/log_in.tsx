import React, { useState, useEffect } from 'react';
import { Center, Text, Input, Button, Box, Image, HStack, VStack, Spacer } from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/auth_navigation';
import styles from '../styles/styles';
import { useAuth } from '../navigation/auth_provider';
import PageContainer from '../components/page_container';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';


type LogInScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'LogIn'
>;

type Props = {
    navigation: LogInScreenNavigationProp;
};

export default function LogInScreen({ navigation }: Props) {
    const { user, setUser, account, setAccount, googleLogin } = useAuth();

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
                        onPress={() => googleLogin().then((docSnapshot) => {
                            if (docSnapshot == null) {
                                console.log('User does not exist')
                                navigation.navigate('CreateUsername');
                            } else {
                                setAccount(docSnapshot);
                                console.log("account", account)
                            }
                        })}>
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

