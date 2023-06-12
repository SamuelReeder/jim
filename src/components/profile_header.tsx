import { sendFriendRequest } from "../api";
import { useAuth } from '../navigation/auth_provider';
import { AntDesign } from '@expo/vector-icons';
import { FlatList, Image, Box, Text, VStack, Divider, Button, View, Pressable, Center, HStack, Heading, Select, CheckIcon, Avatar } from "native-base";


// const ProfileHeader = ({profile}) => {
//     const { user } = useAuth();
//     return (
//         <VStack
//             position="relative"
//             alignItems="center"
//             height={300}
//             width="100%"
//             justifyContent="flex-end"
//         >
//             <Image
//                 alt="Profile Image"
//                 source={{ uri: profile?.photoURL }}
//                 size="lg"
//                 rounded="full"
//                 position="absolute"
//                 top={50} 
//                 alignSelf="center"
//                 borderWidth={4}
//                 borderColor="white" 
//             />

//             <Text fontSize="2xl" bold>
//                 {profile.displayName}
//             </Text>

//             <Text fontSize="md" color="gray.500">
//                 {profile.username}
//             </Text>
//             <Button onPress={() => {
//                 if (!user?.uid) {
//                     return;
//                 }
//                 sendFriendRequest(user?.uid, profile.uid);
//             }}>Add friend</Button>
//             <Divider my={5} />
//         </VStack>
//     );
// };

const ProfileHeader = ({ navigation, account, tags, selectedTags, setSelectedTags }) => {
    return (
        <Box variant="headerContainer" px="4" pt="5">
            <Avatar
                size="2xl"
                source={{ uri: account.photoURL }}
                mb={4}
                _text={{ fontSize: 'md', fontWeight: 'bold', color: 'white' }}
            />
            <Text variant="bold" fontSize='3xl'>
                {account.displayName}
            </Text>
            <Text color="gray.500" fontSize="sm">
                @{account.username}
            </Text>
            <HStack width="100%" mt={3} px="5" justifyContent="space-around" space="4" alignItems="center">
                <Box flex={1} alignItems="center">
                    <VStack alignItems="center">
                        <Text variant="bold" fontSize='2xl'>
                            272
                        </Text>
                        <Text color="gray.500" fontSize="sm">
                            friends
                        </Text>
                    </VStack>
                </Box>
                <Box flex={1} alignItems="center">
                    <VStack alignItems="center">
                        <Text variant="bold" fontSize='2xl'>
                            47
                        </Text>
                        <Text color="gray.500" fontSize="sm">
                            followers
                        </Text>
                    </VStack>
                </Box>
                <Box flex={1} alignItems="center">
                    <VStack alignItems="center">
                        <Text variant="bold" fontSize='2xl'>
                            13
                        </Text>
                        <Text color="gray.500" fontSize="sm">
                            percent
                        </Text>
                    </VStack>
                </Box>
            </HStack>
            <VStack width="100%" mt={3}>
                <HStack width="100%" justifyContent="space-between" alignItems="center" mt={4}>
                    <Text fontWeight="bold" fontSize="lg">
                        Metrics
                    </Text>
                </HStack>
                <Box
                    bg="white"
                    shadow={2}
                    rounded="lg"
                    mx="auto"
                    p="5"
                    width="100%"
                >
                    <HStack space={4} alignItems="center">
                        <Text color="primary.800" fontWeight="bold">
                            Item 1
                        </Text>
                        <Text color="secondary.800" fontWeight="bold">
                            Item 2
                        </Text>
                        <Text color="tertiary.800" fontWeight="bold">
                            Item 3
                        </Text>
                    </HStack>
                </Box>
            </VStack>
            {/* <HStack width="100%" justifyContent="space-between" alignItems="center" mt={4}>
                <Text fontWeight="bold" fontSize="lg">
                    Posts
                </Text>
                <Select
                    width={20}
                    placeholder="Filter"
                    _selectedItem={{
                        bg: "cyan.600",
                        endIcon: <CheckIcon size="4" />,
                    }}
                >
                    <Select.Item label="Option 1" value="1" />
                    <Select.Item label="Option 2" value="2" />
                    <Select.Item label="Option 3" value="3" />
                </Select>
            </HStack> */}
            <HStack alignItems="center" justifyContent="space-between" width="100%" my={4}>
                <Text fontWeight="bold" fontSize="lg">
                    Posts
                </Text>
                <HStack justifyContent="flex-end">
                {tags.map((tag: string) => (
                    <Button
                        key={tag}
                        variant="tag"
                        // colorScheme={selectedTags.includes(tag) ? "primary" : "secondary"}
                        // TODO: CHANGE COLOUR BASED ON SELECTION
                        color="white"
                        startIcon={<AntDesign name="tagso" size={24} color="black" />}
                        onPress={() => {
                            if (selectedTags.includes(tag)) {
                                setSelectedTags(selectedTags.filter((t: string) => t !== tag));
                            } else {
                                setSelectedTags([...selectedTags, tag]);
                            }
                        }}>
                        {/* <LinearGradient
                            colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)']}
                            style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: 0,
                                height: '100%',
                                borderRadius: 8
                            }}
                        /> */}
                        {tag}</Button>
                ))}
                </HStack>
            </HStack>
        </Box>
    );
};

export default ProfileHeader;