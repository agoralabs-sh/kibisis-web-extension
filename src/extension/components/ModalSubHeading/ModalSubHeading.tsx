import { Text } from '@chakra-ui/react';
import React, { FC } from 'react';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useSubTextColor from '@extension/hooks/useSubTextColor';

// types
import { IProps } from './types';

const ModalSubHeading: FC<IProps> = ({ color, text }: IProps) => {
  // hooks
  const subTextColor: string = useSubTextColor();

  return (
    <Text
      as="b"
      color={color || subTextColor}
      fontSize="md"
      pb={DEFAULT_GAP / 3}
      textAlign="left"
      w="full"
    >
      {text}
    </Text>
  );
};

export default ModalSubHeading;
