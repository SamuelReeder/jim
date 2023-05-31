import React, { FC } from 'react';
import { Box, ScrollView, Text, Image, VStack, Button } from "native-base";
import { Post } from "../components";
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get('window').width;

type PostPageProps = {
    route: any;
    navigation: NavigationProp<any>;
  }

const PostScreen = ({route, navigation}: PostPageProps ) => {
    const {post } = route.params.post;
    console.log(route.params);

    return (
        <Box variant="pageContainer">
            <ScrollView>
        <VStack space={4} alignItems="center">
          {/* <Text bold>{user.displayName}</Text> */}
          <Box width="100%">
          <Image
            alt="Post Image"
            source={{ uri: route.params.post.imageUrl }}
            resizeMode="contain"
            style={{ width: screenWidth, height: screenWidth }} // Set height to screenWidth as well to maintain aspect ratio. Adjust as needed.
            // size="xl"
          />
          </Box>
          {/* <Text>{caption}</Text> */}
          <Text bold>Comments</Text>
          {/* {comments.map((comment, index) => (
            <Box key={index}>
              <Text bold>{comment.user.displayName}</Text>
              <Text>{comment.text}</Text>
            </Box>
          ))} */}
          <Button onPress={() => navigation.goBack()}>Go back</Button>
          
        </VStack>
      </ScrollView>
        </Box>
    );
};

export default PostScreen;



  
//   export const PostPage: FC<PostPageProps> = ({ post }) => {
//     const { user, img, caption, comments } = post;
  
//     return (
//       <Box safeArea flex={1} p="2">
//         <ScrollView>
//           <VStack space={4} alignItems="center">
//             <Text bold>{user.displayName}</Text>
//             <Image
//               alt="Post Image"
//               source={{ uri: img }}
//               size="xl"
//             />
//             <Text>{caption}</Text>
//             <Text bold>Comments</Text>
//             {comments.map((comment, index) => (
//               <Box key={index}>
//                 <Text bold>{comment.user.displayName}</Text>
//                 <Text>{comment.text}</Text>
//               </Box>
//             ))}
//           </VStack>
//         </ScrollView>
//       </Box>
//     );
//   };