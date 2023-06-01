import { Box, Image } from "native-base";
import { FlatList } from "react-native-gesture-handler";
import { fetchUserFriendPosts } from "../api";
import { useAuth } from "../navigation/auth_provider";
import { Post, PageLoader } from "../components";
import { useEffect, useState } from "react";

const HomeScreen = ({ navigation }) => {
    const [posts, setPosts] = useState<Post[] | null>();
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchPosts = async () => {
        if (user) {
            const posts = await fetchUserFriendPosts(user.uid);
            setPosts(posts);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [user]);

    if (loading) {
        return <PageLoader />;
    }

    return (
        <Box variant="pageContainer">
            <FlatList
                data={posts}
                renderItem={({ item }) => <Image source={{ uri: item.imageUrl }} alt="post" />}
                keyExtractor={item => item.id}
            />
        </Box>
    );
};

export default HomeScreen;