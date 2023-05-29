import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../screens/home';
import PostScreen from '../../screens/post';
import UserProfileScreen from '../../screens/user_profile';

type HomeStackParamList = {
  Home: undefined;
  Post: undefined;
  UserProfile: undefined;
};

const Stack = createStackNavigator<HomeStackParamList>();

const HomeStack = ({ navigation }: { navigation: HomeStackParamList }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Post"
      component={PostScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="UserProfile"
      component={UserProfileScreen}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

export default HomeStack;