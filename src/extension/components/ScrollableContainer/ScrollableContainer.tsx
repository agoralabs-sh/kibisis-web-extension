import { Stack } from '@chakra-ui/react';
import React, { type FC, useRef } from 'react';

// types
import type { IProps } from './types';

const ScrollableContainer: FC<IProps> = ({
  children,
  onScrollEnd,
  ...stackProps
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  // handlers
  const handleScroll = () => {
    if (onScrollEnd && ref.current) {
      if (
        ref.current.scrollHeight -
          (ref.current.clientHeight + ref.current.scrollTop) ===
        0
      ) {
        onScrollEnd();
      }
    }
  };

  return (
    <Stack onScroll={handleScroll} overflowY="scroll" ref={ref} {...stackProps}>
      {children}
    </Stack>
  );
};

export default ScrollableContainer;
