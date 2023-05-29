import { createStackNavigator } from '@react-navigation/stack';
import EditProfileScreen from '../../screens/edit_profile';
import ProfileScreen from '../../screens/profile';

type ProfileStackParamList = {
    Profile: undefined;
    EditProfile: undefined;
};

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileStack = ({ navigation }: { navigation: ProfileStackParamList }) => (
    <Stack.Navigator>
        <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
                headerShown: false,
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
    </Stack.Navigator>
);

export default ProfileStack;
