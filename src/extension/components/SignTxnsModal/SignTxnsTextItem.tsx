import { Code, HStack, Text } from '@chakra-ui/react';
import React, { FC } from 'react';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

interface IProps {
  label: string;
  value: string;
}

const SignTxnsTextItem: FC<IProps> = ({ label, value }: IProps) => {
  const defaultTextColor: string = useDefaultTextColor();

  return (
    <HStack justifyContent="space-between" spacing={2} w="full">
      <Text color={defaultTextColor} fontSize="xs">
        {label}
      </Text>
      <HStack spacing={1}>
        <Code borderRadius="md" fontSize="xs" wordBreak="break-word">
          {value}
        </Code>
      </HStack>
    </HStack>
  );
};

export default SignTxnsTextItem;
