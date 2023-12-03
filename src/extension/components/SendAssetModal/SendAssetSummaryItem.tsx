import { HStack, Skeleton, StackProps, Text } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';

// constants
import { MODAL_ITEM_HEIGHT } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

interface IProps extends StackProps {
  isLoading?: boolean;
  item: ReactNode;
  label: string;
}

const SendAssetSummaryItem: FC<IProps> = ({
  isLoading = false,
  item,
  label,
  ...stackProps
}: IProps) => {
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();

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
      {isLoading ? (
        <Skeleton>
          <HStack spacing={1}>
            <Text color={subTextColor} fontSize="xs">
              0.001
            </Text>
          </HStack>
        </Skeleton>
      ) : (
        item
      )}
    </HStack>
  );
};

export default SendAssetSummaryItem;
