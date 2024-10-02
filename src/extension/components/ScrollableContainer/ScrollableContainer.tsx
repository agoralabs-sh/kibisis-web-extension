import { Stack } from '@chakra-ui/react';
import React, { type FC, useRef } from 'react';

// types
import type { IProps } from './types';

const ScrollableContainer: FC<IProps> = ({
  children,
  onScrollEnd,
  showScrollBars = false,
  ...stackProps
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  // handlers
  const handleScroll = () => {
    if (onScrollEnd && scrollContainerRef.current) {
      if (
        scrollContainerRef.current.scrollHeight -
          (scrollContainerRef.current.clientHeight +
            scrollContainerRef.current.scrollTop) ===
        0
      ) {
        onScrollEnd();
      }
    }
  };

  return (
    <Stack
      flexGrow={1}
      onScroll={handleScroll}
      overflowY="scroll"
      ref={scrollContainerRef}
      spacing={0}
      w="full"
      {...(showScrollBars && {
        sx: {
          scrollbarWidth: 'auto',
          msOverflowStyle: 'auto',
          ['::-webkit-scrollbar']: {
            display: 'block',
          },
        },
      })}
    >
      <Stack {...stackProps}>{children}</Stack>
    </Stack>
  );
};

export default ScrollableContainer;
