import React, { useRef, useState } from 'react';
import { View, Input } from 'native-base';
import { useSearchBox } from 'react-instantsearch-hooks';
import { StyleSheet } from 'react-native';

const SearchBox = (props) => {
  const { query, refine } = useSearchBox(props);
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef(null);

  function setQuery(newQuery) {
    setInputValue(newQuery);
    refine(newQuery);
  }

  // Track when the InstantSearch query changes to synchronize it with
  // the React state.
  // We bypass the state update if the input is focused to avoid concurrent
  // updates when typing.
  if (query !== inputValue && !inputRef.current?.isFocused()) {
    setInputValue(query);
  }

  return (
    <View style={styles.container}>
      <Input
        ref={inputRef}
        style={styles.input}
        value={inputValue}
        onChangeText={setQuery}
        clearButtonMode="while-editing"
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        // autoCompleteType="off"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#252b33',
    padding: 18,
  },
  // input: {
  //   height: 48,
  //   padding: 12,
  //   fontSize: 16,
  //   backgroundColor: '#fff',
  //   borderRadius: 4,
  //   borderWidth: 1,
  //   borderColor: '#ddd',
  // },
});

export default SearchBox;