import { Avatar, AvatarBadge, Icon } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';
import {
  IoEyeOutline,
  IoRepeatOutline,
  IoWalletOutline,
} from 'react-icons/io5';

// hooks
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { IProps } from './types';

const AccountAvatar: FC<IProps> = ({ account, network }) => {
  // hooks
  const primaryButtonTextColor = usePrimaryButtonTextColor();
  const primaryColor = usePrimaryColor();
  // misc
  const accountInformation = network
    ? AccountService.extractAccountInformationForNetwork(account, network)
    : null;
  let reKeyedBadge: ReactNode = null;
  let watchBadge: ReactNode = null;

  // add an eye badge for watch accounts
  if (account.watchAccount) {
    watchBadge = (
      <AvatarBadge
        bg="blue.500"
        borderWidth={0}
        boxSize="1.25em"
        p={1}
        placement="top-end"
      >
        <Icon as={IoEyeOutline} color="white" h={3} w={3} />
      </AvatarBadge>
    );
  }

  if (accountInformation && accountInformation.authAddress) {
    reKeyedBadge = (
      <AvatarBadge
        bg="orange.500"
        borderWidth={0}
        boxSize="1.25em"
        p={1}
        placement="bottom-end"
      >
        <Icon as={IoRepeatOutline} color="white" h={3} w={3} />
      </AvatarBadge>
    );
  }

  return (
    <Avatar
      bg={primaryColor}
      icon={<Icon as={IoWalletOutline} color={primaryButtonTextColor} />}
      size="sm"
    >
      {watchBadge}
      {reKeyedBadge}
    </Avatar>
  );
};

export default AccountAvatar;
