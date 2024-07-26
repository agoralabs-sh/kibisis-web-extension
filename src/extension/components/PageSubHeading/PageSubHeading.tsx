import { Text } from '@chakra-ui/react';
import React, { FC } from 'react';

// constants
import { DEFAULT_GAP, PAGE_ITEM_HEIGHT } from '@extension/constants';

// hooks
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import { IProps } from './types';

const PageSubHeading: FC<IProps> = ({ color, fontSize = 'md', text }) => {
  // hooks
  const subTextColor = useSubTextColor();

  return (
    <Text
      as="b"
      color={color || subTextColor}
      fontSize={fontSize}
      minH={PAGE_ITEM_HEIGHT}
      pb={DEFAULT_GAP / 3}
      textAlign="left"
      w="full"
    >
      {text}
    </Text>
  );
};

export default PageSubHeading;
