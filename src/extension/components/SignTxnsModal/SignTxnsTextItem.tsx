import { Code, HStack, StackProps, Text } from '@chakra-ui/react';
import React, { FC } from 'react';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

interface IProps extends StackProps {
  label: string;
  value: string;
}

const SignTxnsTextItem: FC<IProps> = ({
  label,
  value,
  ...stackProps
}: IProps) => {
  const defaultTextColor: string = useDefaultTextColor();

  return (
    <HStack justifyContent="space-between" spacing={2} w="full" {...stackProps}>
      <Text color={defaultTextColor} fontSize="xs">
        {label}
      </Text>
      <Code borderRadius="md" fontSize="xs" wordBreak="break-word">
        {value}
      </Code>
    </HStack>
  );
};

export default SignTxnsTextItem;
