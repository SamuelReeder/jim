import { Box, Image, FlatList } from "native-base";
import { fetchUserFriends } from "../api";
import { useAuth } from "../navigation/auth_provider";
import { useEffect, useState } from "react";
import { User, PageLoader } from "../components";

const Friends = ({ navigation }) => {
    const [friends, setFriends] = useState<User[] | null>();
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchFriends = async () => {
        if (user) {
            const friends = await fetchUserFriends(user.uid);
            setFriends(friends);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, [user]);

    if (loading) {
        return <PageLoader />;
    }

    return (
        <Box variant="pageContainer">
            <FlatList
                data={friends}
                renderItem={({ item }) => <FriendCard user={item} />}
                keyExtractor={item => item.id}
            />
        </Box>
    );
}