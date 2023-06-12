import React, { FC, useEffect, useState } from 'react';
import { Box, ScrollView, Text, Image, VStack, Button, HStack, Avatar } from "native-base";
import { Post, User } from "../components";
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { Dimensions, StyleSheet } from "react-native";
import { Video, ResizeMode } from 'expo-av';
import { AppStackParamList, PageLoader } from '../components';
import { fetchUser } from '../api';
import ErrorMessage from "../components/error";
import { FieldValue } from '@firebase/firestore-types';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { AntDesign } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';

const screenWidth = Dimensions.get('window').width;

type PostPageProps = {
  route: RouteProp<AppStackParamList, 'Post'>;
  navigation: NavigationProp<any>;
}

const PostScreen = ({ route, navigation }: PostPageProps) => {
  const { post } = route.params;
  const [poster, setPoster] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  console.log(post.media)


  const fetchUserData = async () => {

    const user = await fetchUser(post.userId);
    if (!user) {
      return <ErrorMessage handler={fetchUserData} />;
    }
    setPoster(user as User);
    setLoading(false);
  };

  useEffect(() => {
    fetchUserData();
    navigation.setOptions({
      headerRight: () => (
        <HStack justifyContent="flex-end" marginRight={2}>
          {post.tags.map((tag: string) => (
            <Button
              key={tag}
              variant="tag"
              color="white"
              size={'sm'}
              startIcon={<AntDesign name="tagso" size={20} color="black" />}
            >
              {tag}
            </Button>
          ))}
        </HStack>
      ),
    });
  }, [route.params.post]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Box variant="headerContainer">
      <ScrollView>
        <Box width="100%">

          <Swiper showsButtons={true} width={screenWidth} height={(post.media[0].aspectRatio[1] / post.media[0].aspectRatio[0]) * screenWidth}>
            {post.media.map((media: any, index) => (
              <Box key={index} width="100%" height="100%">
                {media.type == 'image' ? (
                  <Image
                    alt="Post Image"
                    source={{ uri: media.url }}
                    resizeMode="contain"
                    style={{ width: screenWidth, height: (media.aspectRatio[1] / media.aspectRatio[0]) * screenWidth }} // Set height to screenWidth as well to maintain aspect ratio. Adjust as needed.
                  />
                ) : (
                  <Video
                    source={{ uri: media.url }}
                    style={{ width: screenWidth, height: (media.aspectRatio[1] / media.aspectRatio[0]) * screenWidth  }}
                    resizeMode={ResizeMode.COVER}
                    isLooping
                    shouldPlay
                  />
                )}
              </Box>
            ))}
              {/* {route.params.post.media[0].type == 'image' ? (
                <Image
                  alt="Post Image"
                  source={{ uri: post.media[0].url }}
                  resizeMode="contain"
                  style={{ width: screenWidth, height: (post.media[0].aspectRatio[1] / post.media[0].aspectRatio[0]) * screenWidth }} // Set height to screenWidth as well to maintain aspect ratio. Adjust as needed.
                />
              ) : (
                <Video
                  source={{ uri: route.params.post.media[0].url }}
                  style={{ width: screenWidth, height: screenWidth }}
                  resizeMode={ResizeMode.COVER}
                  isLooping
                  shouldPlay
                />
              )} */}
          </Swiper>
          <Box flex={1} p="3">
            <HStack space={2} flex={1}>
              <Avatar
                size="sm"
                mb={0.5}
                source={{ uri: poster?.photoURL }}
                _text={{ fontSize: 'md', fontWeight: 'bold', color: 'white' }}
              />
              <VStack flex={1}>
                <Text>
                  <Text style={{ fontFamily: 'Poppins_700Bold' }}>{poster?.displayName} </Text>
                  This is testing because i need to see how it acts with a longer description you know how it is
                  <Text color="gray.500">  {post.timestamp.toDate().toLocaleDateString()} {post.timestamp.toDate().toLocaleTimeString()}
                  </Text>
                </Text>
              </VStack>

            </HStack>
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
};

export default PostScreen;