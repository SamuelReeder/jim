import { Box, Text, HStack, Image, VStack, Pressable } from 'native-base';
import { useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch-hooks';
import { SearchBox, InfiniteHits } from '../components';
import React from 'react';


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

const SearchScreen = ({ navigation }) => {
    const [loading, setLoading] = useState<boolean>(true);

    const searchClient = algoliasearch(
        'M8MIZLTM97',
        '001156482e743b117f9cd3c4eb6de6f8'
    );

    const Hit = ({ hit }: { hit: HitInterface }) => (
        <Pressable onPress={() => {
            navigation.navigate('UserProfile', { userId: hit.objectID });
        }}>
            <HStack space={4} alignItems='center' justifyContent='flex-start' py={2}>
                <Box>
                    <Image
                        alt='user image'
                        source={{ uri: hit.photoURL }}
                        size='xs'
                        rounded='full'
                    />
                </Box>
                <VStack space={1}>
                    <Text bold>{hit.displayName}</Text>
                    <Text fontSize='xs'>{hit.username}</Text>
                </VStack>
            </HStack>
        </Pressable>
    );

    return (
        <Box variant="searchContainer" paddingX="3">
            {/* <ScrollView> */}
            <InstantSearch searchClient={searchClient} indexName="users_index">
                <SearchBox />
                <InfiniteHits hitComponent={Hit} />
            </InstantSearch>
            {/* </ScrollView> */}
        </Box>
    )
}


export default SearchScreen;
