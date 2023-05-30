import React, { FC } from 'react';
import { Box, ScrollView, Text, Image, VStack } from "native-base";
import { Post } from "../components";
import { NavigationProp } from '@react-navigation/native';


interface PostPageProps {
    post: Post;
    navigation: NavigationProp<any>;
  }

const PostScreen: FC<PostPageProps> = ({post, navigation}) => {
    const { id, img } = post;

    return (
        <Box safeArea flex={1} alignItems="center" justifyContent="center">
            <ScrollView>
        <VStack space={4} alignItems="center">
          {/* <Text bold>{user.displayName}</Text> */}
          <Image
            alt="Post Image"
            source={{ uri: img }}
            size="xl"
          />
          {/* <Text>{caption}</Text> */}
          <Text bold>Comments</Text>
          {/* {comments.map((comment, index) => (
            <Box key={index}>
              <Text bold>{comment.user.displayName}</Text>
              <Text>{comment.text}</Text>
            </Box>
          ))} */}
          
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