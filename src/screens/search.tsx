import { Box, Text, HStack, Image, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
// import { InstantSearch } from 'react-instantsearch-native';
import algoliasearch from 'algoliasearch/lite';
// import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';
// import { InstantSearch } from "react-instantsearch-native";
// declare module 'react-instantsearch-native';
import { SearchBox } from '../components/search_box';
import { InfiniteHits } from '../components/infinite_hits';

import { InstantSearch } from 'react-instantsearch-hooks';

interface MetaData {
    creationTime: string,
    lastSignInTime: string,
}

interface LastModified {
    _operation: string,
    value: number,
}

interface HitInterface {
    objectID: string,
    username: string,
    displayName: string,
    email: string,
    metadata: MetaData,
    photoURL: string,
    path: string
    lastmodified: LastModified
}

const SearchScreen = () => {
    const [users, setUsers] = useState<Record<string, unknown>[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const searchClient = algoliasearch(
        'M8MIZLTM97',
        '001156482e743b117f9cd3c4eb6de6f8'
    );

    // const fetchUsers = async () => {
    //     try {
    //         const list: Record<string, unknown>[] = [];

    //         await firestore()
    //             .collection('posts')
    //             .orderBy('postTime', 'desc')
    //             .get()
    //             .then((querySnapshot) => {
    //                 // console.log('Total Posts: ', querySnapshot.size);

    //                 querySnapshot.forEach((doc) => {
    //                     const {
    //                         userId,
    //                         post,
    //                         postImg,
    //                         postTime,
    //                         likes,
    //                         comments,
    //                     } = doc.data();
    //                     list.push({
    //                         id: doc.id,
    //                         userId,
    //                         userName: 'Test Name',
    //                         userImg:
    //                             'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
    //                         postTime: postTime,
    //                         post,
    //                         postImg,
    //                         liked: false,
    //                         likes,
    //                         comments,
    //                     });
    //                 });
    //             });

    //         setUsers(list);

    //         if (loading) {
    //             setLoading(false);
    //         }

    //         console.log('Posts: ', users);
    //     } catch (e) {
    //         console.log(e);
    //     }
    // };

    //   useEffect(() => {
    //     fetchUsers();
    //   }, []);

    return (
        <Box safeArea flex={1} paddingX="3">
            {/* <ScrollView> */}
            {/* <Box >
                    <Input
                        placeholder="Search"
                        variant="filled"
                        width="100%"
                    // onChangeText={text => onChangeText(text)}
                    // value={value}
                    />
                </Box> */}
            <InstantSearch searchClient={searchClient} indexName="users_index">
                <SearchBox />
                <InfiniteHits hitComponent={Hit} />
            </InstantSearch>
            {/* </ScrollView> */}
        </Box>
    )
}

const Hit = ({ hit }: {hit: HitInterface}) => (
    <HStack space={4} alignItems='center' justifyContent='space-between' py={2}>
    <VStack space={1}>
        <Text bold>{hit.displayName}</Text>
        <Text fontSize='xs'>{hit.username}</Text>    
    </VStack>
    <Box>
      <Image 
        alt='user image'
        source={{ uri: hit.photoURL }} 
        size='xs'
        rounded='full'
      />
    </Box>
  </HStack>
);

export default SearchScreen;
