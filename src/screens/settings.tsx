import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Modal, Link, Divider, Text, ScrollView, Pressable, Image } from 'native-base';
import { useAuth } from '../navigation/auth_provider';
import { NicePressable, PageLoader } from '../components';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { setPrivate } from '../api';
import { Switch } from 'react-native';
import { User } from '../components';



const SettingsScreen = ({ navigation } : {navigation: any}) => {
    const { account, setAccount, logout } = useAuth();
    const [showModal0, setShowModal0] = useState<boolean>(false);
    const [showModal1, setShowModal1] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isPrivate, setIsPrivate] = useState<boolean | null>(null);

    useEffect(() => {
        if (account) {
            setIsPrivate(account.private);
            setIsLoading(false);
        }
    }, [account]);

    useEffect(() => {
        const updatePrivate = async () => {
            if (!isLoading && account?.uid && isPrivate !== null) {
                await setPrivate(account.uid, isPrivate);
                setAccount((account: User) => {
                    return { ...account, private: isPrivate };
                });
            }
        };
        
        updatePrivate();
    }, [isPrivate]);

    if (isLoading || isPrivate == null) {
        return <PageLoader></PageLoader>
    }

    const toggleSwitch = () => setIsPrivate(previousState => !previousState)

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Box variant="socialContainer">
                <Text color="gray.500" fontSize="sm" px={5}>Profile</Text>
                {/* <Divider my={2} /> */}
                <Pressable px={5} onPress={() => navigation.navigate('EditProfile')}>
                    <HStack space={4} alignItems='center' justifyContent='flex-start' py={2} width="100%">
                        <Box>
                            <Image
                                alt='user image'
                                source={{ uri: account?.photoURL }}
                                size='sm'
                                rounded='full'
                            />
                        </Box>
                        <VStack space={1}>
                            <Text bold>{account?.displayName}</Text>
                            <Text fontSize='xs'>{account?.username}</Text>
                        </VStack>
                    </HStack>
                </Pressable>
                <Divider my={5} height="12px" />
                <Text color="gray.500" fontSize="sm" px={5}>Account</Text>
                <HStack px={5} alignItems='center' justifyContent='space-between' py={2} width="100%">
                    <Text>Private Account</Text>
                    <Switch value={isPrivate} onValueChange={toggleSwitch}/>
                </HStack>
                <Pressable onPress={() => setShowModal0(true)}>
                    <HStack px={5} alignItems='center' justifyContent='space-between' py={2} width="100%">
                        <Text>Privacy Policy</Text>
                        <Box px={4}>
                            <MaterialIcons name="keyboard-arrow-right" size={22} color="black" />
                        </Box>
                    </HStack>
                </Pressable>
                <Pressable onPress={() => setShowModal1(true)}>
                    <HStack px={5} alignItems='center' justifyContent='space-between' py={2} width="100%">
                        <Text>Terms of Service</Text>
                        <Box px={4}>
                            <MaterialIcons name="keyboard-arrow-right" size={22} color="black" />
                        </Box>
                    </HStack>
                </Pressable>
                <Pressable onPress={() => logout()}>
                    <HStack px={5} alignItems='center' justifyContent='space-between' py={2} width="100%">
                        <Text>Log out</Text>
                        <Box px={4}>
                        <MaterialIcons name="logout" size={18} color="black" />

                        </Box>
                    </HStack>
                </Pressable>
                <Pressable onPress={() => console.log("Delete")}>
                    <HStack px={5} alignItems='center' justifyContent='space-between' py={2} width="100%">
                        <Text color="red.500">Delete Account</Text>
                        {/* <IconButton onPress={() => setShowModal(true)} icon={<MaterialIcons name="keyboard-arrow-right" size={18} color="black" />} borderRadius="full" _icon={{}} _hover={{
                        bg: "gray.500:alpha.20"
                    }} _pressed={{
                        bg: "gray.500:alpha.20",
                    }} /> */}
                        <Box px={4}>
                            <AntDesign name="delete" size={20} color="red" />
                        </Box>
                    </HStack>
                </Pressable>
            </Box>
            <Modal isOpen={showModal0} onClose={() => setShowModal0(false)}>
                <Modal.Content>
                    <Modal.CloseButton borderRadius="full" />
                    <Modal.Header>Privacy Policy</Modal.Header>
                    <Modal.Body>
                        <ScrollView>
                            <Text fontSize="lg" fontWeight="bold" mb={4}>
                                Privacy Policy
                            </Text>
                            <Text mb={4}>
                                Your Company Name ("we", "us", "our") is committed to protecting and respecting your privacy. This privacy policy applies to our mobile application Your App Name ("App").
                            </Text>
                            <Text fontWeight="bold" mb={2}>
                                Information We Collect
                            </Text>
                            <Text mb={4}>
                                When you use our App, we may collect and process the following data about you:
                                {'\n\n'}
                                - Information you provide us. When signing up for our App, you will provide us with certain information such as your name and email address.
                                {'\n'}
                                - Information from Google Sign-In. If you choose to log in via Google Sign-In, we will collect and process the data provided by Google, which includes your Google profile information.
                            </Text>
                            <Text fontWeight="bold" mb={2}>
                                How We Use Your Information
                            </Text>
                            <Text mb={4}>
                                We use the information you provide to manage your account, provide you with customer support, and enhance your user experience. We may also use this information to communicate with you about our services.
                            </Text>
                            <Text fontWeight="bold" mb={2}>
                                Where We Store Your Data
                            </Text>
                            <Text mb={4}>
                                All data you provide to us is stored securely in Firebase, a database owned by Google. Firebase adheres to a high level of security and privacy standards. More information about their practices can be found at their <Link href="https://firebase.google.com/support/privacy" color="blue.500">privacy policy</Link>.
                            </Text>
                            <Text fontWeight="bold" mb={2}>
                                Disclosure of Your Information
                            </Text>
                            <Text mb={4}>
                                We do not share your personal information with third parties except as described in this privacy policy or as required by law.
                            </Text>
                            <Text fontWeight="bold" mb={2}>
                                Changes to Our Privacy Policy
                            </Text>
                            <Text mb={4}>
                                Any changes we may make to our privacy policy in the future will be posted on this page. Please check back frequently to see any updates or changes to our privacy policy.
                            </Text>
                            <Text fontWeight="bold" mb={2}>
                                Contact
                            </Text>
                            <Text mb={4}>
                                Questions, comments, and requests regarding this privacy policy are welcomed and should be addressed to our email at your_email_address@example.com.
                            </Text>
                            <Text fontSize="sm">
                                Date last updated: Date
                            </Text>
                        </ScrollView>
                    </Modal.Body>
                    {/* <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                setShowModal(false);
                            }}>
                                Cancel
                            </Button>
                            <Button onPress={() => {
                                setShowModal(false);
                            }}>
                                Save
                            </Button>
                        </Button.Group>
                    </Modal.Footer> */}
                </Modal.Content>
            </Modal>
            <Modal isOpen={showModal1} onClose={() => setShowModal1(false)}>
                <Modal.Content>
                    <Modal.CloseButton borderRadius="full" />
                    <Modal.Header>Terms of Service</Modal.Header>
                    <Modal.Body>
                        <ScrollView p={4}>
                            <Text fontSize="lg" fontWeight="bold" mb={4}>
                                Your App Name Terms of Service
                            </Text>
                            <Text mb={4}>
                                1. Acceptance of Terms
                                {'\n'}
                                By accessing and using Your App Name ("App"), you agree to be bound by these Terms of Service ("Terms"). These Terms apply to all visitors, users, and others who access the App.
                            </Text>
                            <Text mb={4}>
                                2. User Account
                                {'\n'}
                                In order to use certain features of the App, you may have to create an account. You are solely responsible for all activity that occurs under your account. You must not create an account for anyone other than yourself without permission.
                            </Text>
                            <Text mb={4}>
                                3. User Content
                                {'\n'}
                                You are solely responsible for all content that you post, upload, link to, or otherwise make available via the App. You agree that we are only acting as a passive conduit for your online distribution and publication of your content.
                            </Text>
                            <Text mb={4}>
                                4. Use of the App
                                {'\n'}
                                You agree to use the App only for lawful purposes. You agree not to post any content that is illegal, harmful, threatening, abusive, or otherwise objectionable. You must not use any part of the App in a way that could damage or overburden any of our systems.
                            </Text>
                            <Text mb={4}>
                                5. Changes to the App
                                {'\n'}
                                We reserve the right to modify, suspend or discontinue, temporarily or permanently, the App or any service to which it connects, with or without notice and without liability to you.
                            </Text>
                            <Text mb={4}>
                                6. Changes to the Terms
                                {'\n'}
                                We reserve the right to modify or replace these Terms at any time. We will notify you of any changes by posting the new Terms on this page.
                            </Text>
                            <Text fontSize="sm" mt={4}>
                                Date Last Updated: Date
                            </Text>
                        </ScrollView>
                    </Modal.Body>
                    {/* <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                setShowModal(false);
                            }}>
                                Cancel
                            </Button>
                            <Button onPress={() => {
                                setShowModal(false);
                            }}>
                                Save
                            </Button>
                        </Button.Group>
                    </Modal.Footer> */}
                </Modal.Content>
            </Modal>
        </ScrollView>
    );
};

export default SettingsScreen;
