import { FlatList, Image, Box, Text } from "native-base";
import { useAuth } from "../navigation/auth_provider"
import { Dimensions } from "react-native";

const windowWidth = Dimensions.get('window').width;

const testingData = () => {
    let data = [];
    for (let i = 0; i < 1000; i++) {
        data.push({ id: i.toString(), img: require('../../assets/logo-no-background.png') });
    }
    return data;
}
const ProfileScreen = () => {
    const { user } = useAuth();

    return (
        <Box safeAreaTop flex={1} alignItems="center">

            <FlatList data={testingData()} renderItem={({ item }) =>
                <Image
                    source={item.img}
                    alt={item.id}
                    style={{ width: windowWidth / 3, height: windowWidth / 3 }}
                />
            } keyExtractor={item => item.id} numColumns={3} ListHeaderComponent={
                // <Box>
                    <Text size="lg">{user?.displayName}</Text>
            } />
        </Box>
    );
}

export default ProfileScreen;
