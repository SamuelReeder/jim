import { VStack, Image, Text, Button, Divider } from "native-base";
import { sendFriendRequest } from "../api";
import { useAuth } from '../navigation/auth_provider';

const ProfileHeader = ({profile}) => {
    const { user } = useAuth();
    return (
        <VStack
            position="relative"
            alignItems="center"
            height={300}
            width="100%"
            justifyContent="flex-end"
        >
            <Image
                alt="Profile Image"
                source={{ uri: profile?.photoURL }}
                size="lg"
                rounded="full"
                position="absolute"
                top={50} 
                alignSelf="center"
                borderWidth={4}
                borderColor="white" 
            />

            <Text fontSize="2xl" bold>
                {profile.displayName}
            </Text>

            <Text fontSize="md" color="gray.500">
                {profile.username}
            </Text>
            <Button onPress={() => {
                if (!user?.uid) {
                    return;
                }
                sendFriendRequest(user?.uid, profile.uid);
            }}>Add friend</Button>
            <Divider my={5} />
        </VStack>
    );
};

export default ProfileHeader;