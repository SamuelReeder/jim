import { VStack, Image, Text, Button, Divider } from "native-base";

const ProfileHeader = ({profile}) => {
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
            <Divider my={5} />
        </VStack>
    );
};

export default ProfileHeader;