import { createStackNavigator } from '@react-navigation/stack';
import { Post } from '../../components';
import { ProfileScreen, AddPostScreen as CreatePostScreen, EditProfileScreen } from '../../screens';
import PostScreen from '../../screens/post';

type ProfileStackParamList = {
    Profile: undefined;
    EditProfile: undefined;
    CreatePost: undefined;
    Post: { post: Post };
};

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileStack = ({ navigation }: { navigation: ProfileStackParamList }) => (
    <Stack.Navigator>
        <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
                headerTitle: 'Profile',
                headerBackTitleVisible: false,
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#fff',
                    shadowColor: '#fff',
                    elevation: 0,
                },
            }}
        />
        <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{
                headerTitle: 'Edit Profile',
                headerBackTitleVisible: false,
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#fff',
                    shadowColor: '#fff',
                    elevation: 0,
                },
            }}
        />
        <Stack.Screen
            name="CreatePost"
            component={CreatePostScreen}
            options={{
                headerTitle: 'Create Post',
                headerBackTitleVisible: false,
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#fff',
                    shadowColor: '#fff',
                    elevation: 0,
                },
            }}
        />
        <Stack.Screen
            name="Post"
            component={PostScreen}
            options={{
                headerTitle: 'Post',
                headerBackTitleVisible: false,
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#fff',
                    shadowColor: '#fff',
                    elevation: 0,
                },
            }}
        />
        
    </Stack.Navigator>
);

export default ProfileStack;
