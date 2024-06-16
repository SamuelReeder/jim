import React, { FC, useEffect, useState } from 'react';
import { Box, ScrollView, Text, Image, VStack, Button, HStack, Avatar, Spinner } from "native-base";
import { Post, TAG_COLORS, User } from "../components";
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { Dimensions, View } from "react-native";
import { Video, ResizeMode } from 'expo-av';
import { AppStackParamList, PageLoader } from '../components';
import { fetchUser } from '../api';
import ErrorMessage from "../components/error";
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
  const [isLoadingPerPost, setIsLoadingPerPost] = useState<Record<string, boolean>>({});


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
    // navigation.setOptions({
    //   headerRight: () => (
    //     <HStack justifyContent="flex-end" marginRight={2}>
    //       {post.tags.map((tag: string) => (
    //         <Button
    //           key={tag}
    //           variant="tag"
    //           color="white"
    //           size={'sm'}
    //           startIcon={<AntDesign name="tagso" size={20} color="black" />}
    //         >
    //           {tag}
    //         </Button>
    //       ))}
    //     </HStack>
    //   ),
    // });
    post.media.forEach((media, index) => {
      setIsLoadingPerPost((prev) => {
        return { ...prev, [media.url]: false };
      });
    });


  }, [route.params.post]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Box variant="headerContainer">
      <ScrollView>
        <Box width="100%">
          {/* showsButtons={post.media.length > 1} width={screenWidth} height={(post.media[0].aspectRatio[1] / post.media[0].aspectRatio[0]) * screenWidth}  */}
          <Swiper activeDotColor='black' width={screenWidth} height={(post.media[0].aspectRatio[1] / post.media[0].aspectRatio[0]) * screenWidth}>
            {post.media.map((media: any, index) => (
              <Box key={index} width="100%" height="100%">
                {isLoadingPerPost[media.url] && (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Spinner size="sm" />
                  </View>
                )}
                <Box style={isLoadingPerPost[media.url] ? { display: "none" } : {}}>
                  {media.type == 'image' ? (
                    <Image
                      alt="Post Image"
                      source={{ uri: media.url }}
                      resizeMode="contain"
                      style={{ width: screenWidth, height: (media.aspectRatio[1] / media.aspectRatio[0]) * screenWidth }}
                      onLoadStart={() => setIsLoadingPerPost((prev) => {
                        return { ...prev, [media.url]: true };
                      })}
                      onLoad={() => setIsLoadingPerPost((prev) => {
                        return { ...prev, [media.url]: false };
                      })}
                    />
                  ) : (
                    <Video
                      source={{ uri: media.url }}
                      style={{ width: screenWidth, height: (media.aspectRatio[1] / media.aspectRatio[0]) * screenWidth }}
                      resizeMode={ResizeMode.COVER}
                      isLooping
                      shouldPlay
                      onLoadStart={() => setIsLoadingPerPost((prev) => {
                        return { ...prev, [media.url]: true };
                      })}
                      onLoad={() => setIsLoadingPerPost((prev) => {
                        return { ...prev, [media.url]: false };
                      })}

                    />
                  )}
                </Box>
              </Box>
            ))}
          </Swiper>
          <Box flex={1} p="3" alignItems="start">

            <HStack space={2} flex={1}>
              <Avatar
                size="sm"
                my={1}
                source={{ uri: poster?.photoURL }}
                _text={{ fontSize: 'md', fontWeight: 'bold', color: 'white' }}
              />
              <VStack flex={1} alignItems="flex-start">
                <Text>
                  <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 15 }}>{poster?.displayName}  </Text>
                  {post.description}{"\n"}
                  <Text color="gray.500">{post.timestamp.toDate().toLocaleDateString()} {post.timestamp.toDate().toLocaleTimeString()}
                  </Text>
                </Text>
                <HStack paddingY={2}>
                  {post.tags.map((tag: string) => (
                    <Button
                      key={tag}
                      variant="tag"
                      backgroundColor={TAG_COLORS.tagSelected}
                      color="white"
                      padding={2}
                      startIcon={<AntDesign name="tagso" size={20} color="white" />}>
                      <Text color="white">{tag}</Text>
                    </Button>
                  ))}
                </HStack>
              </VStack>

            </HStack>

          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
};

export default PostScreen;