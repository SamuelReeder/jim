import { Box, Text, HStack, Image, VStack, Pressable } from 'native-base';
import { useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch-hooks';
import { SearchBox, InfiniteHits } from '../components';


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

const SearchScreen = ({navigation}) => {
    const [loading, setLoading] = useState<boolean>(true);

    const searchClient = algoliasearch(
        'M8MIZLTM97',
        '001156482e743b117f9cd3c4eb6de6f8'
    );

    return (
        <Box variant="pageContainer" paddingX="3">
            {/* <ScrollView> */}
            <InstantSearch searchClient={searchClient} indexName="users_index">
                <SearchBox />
                <InfiniteHits hitComponent={Hit} />
            </InstantSearch>
            {/* </ScrollView> */}
        </Box>
    )
}

const Hit = ({ hit }: { hit: HitInterface }) => (
    <Pressable onPress={() => {
        console.log('hit: ', hit);
    }}>
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
    </Pressable>
);

export default SearchScreen;
