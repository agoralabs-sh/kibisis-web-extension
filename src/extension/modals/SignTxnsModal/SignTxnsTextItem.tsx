import { Code, HStack, StackProps, Text } from '@chakra-ui/react';
import React, { FC } from 'react';

// constants
import { MODAL_ITEM_HEIGHT } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';

interface IProps extends StackProps {
  isCode?: boolean;
  label: string;
  value: string;
}

const SignTxnsTextItem: FC<IProps> = ({
  isCode = false,
  label,
  value,
  ...stackProps
}: IProps) => {
  const defaultTextColor: string = useDefaultTextColor();

  return (
    <HStack
      alignItems="center"
      justifyContent="space-between"
      minH={MODAL_ITEM_HEIGHT}
      spacing={2}
      w="full"
      {...stackProps}
    >
      <Text color={defaultTextColor} fontSize="xs">
        {label}
      </Text>
      {isCode ? (
        <Code borderRadius="md" fontSize="xs" wordBreak="break-word">
          {value}
        </Code>
      ) : (
        <Text color={defaultTextColor} fontSize="xs">
          {value}
        </Text>
      )}
    </HStack>
  );
};

export default SignTxnsTextItem;
