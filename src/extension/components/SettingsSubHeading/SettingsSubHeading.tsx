import { Text } from '@chakra-ui/react';
import React, { FC } from 'react';

// Constants
import { DEFAULT_GAP } from '@extension/constants';

// Hooks
import useSubTextColor from '@extension/hooks/useSubTextColor';

interface IProps {
  color?: string;
  text: string;
}
const SettingsSubHeading: FC<IProps> = ({ color, text }: IProps) => {
  const subTextColor: string = useSubTextColor();

  return (
    <Text
      color={color || subTextColor}
      fontSize="sm"
      px={DEFAULT_GAP - 2}
      textAlign="left"
      w="full"
    >
      {text}
    </Text>
  );
};

export default SettingsSubHeading;
