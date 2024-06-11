import React from 'react';
import { Pressable, Box } from '@gluestack-ui/themed-native-base';

type PressableProps = React.ComponentProps<typeof Pressable> & {
  children: (states: { isHovered: boolean; isPressed: boolean; isFocused: boolean }) => React.ReactNode;
};

const NicePressable = ({ children, ...props }) => {
  return (
    <Pressable {...props}>
      {({ isHovered, isPressed, isFocused }) => (
        <Box
          bg={isPressed ? "coolGray.200" : isHovered ? "coolGray.200" : "coolGray.100"}
          style={{ transform: [{ scale: isPressed ? 0.96 : 1 }] }}
        >
          {children({ isHovered, isPressed, isFocused })}
        </Box>
      )}
    </Pressable>
  );
};

export default NicePressable;
