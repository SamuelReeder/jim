import React from 'react';
import { StyleSheet } from 'react-native';
import { useInfiniteHits } from 'react-instantsearch-hooks';
import {View, FlatList} from 'native-base';

const InfiniteHits = ({ hitComponent: Hit, ...props }) => {
  const { hits, isLastPage, showMore } = useInfiniteHits(props);

  return (
    <FlatList
      data={hits}
      keyExtractor={(item) => item.objectID}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      onEndReached={() => {
        if (!isLastPage) {
          showMore();
        }
      }}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Hit hit={item} />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  item: {
    padding: 18,
  },
});

export default InfiniteHits;