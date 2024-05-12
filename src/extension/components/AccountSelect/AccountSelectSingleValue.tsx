import { HStack } from '@chakra-ui/react';
import React, { FC } from 'react';

// components
import AccountItem from '@extension/components/AccountItem';

// constants
import { DEFAULT_GAP, OPTION_HEIGHT } from '@extension/constants';

// types
import type { ISingleValueProps } from './types';

const AccountSelectSingleValue: FC<ISingleValueProps> = ({ account }) => {
  return (
    <HStack
      alignItems="center"
      h={OPTION_HEIGHT}
      m={0}
      p={DEFAULT_GAP / 2}
      position="absolute"
      spacing={2}
      w="full"
    >
      <AccountItem account={account} />
    </HStack>
  );
};

export default AccountSelectSingleValue;
