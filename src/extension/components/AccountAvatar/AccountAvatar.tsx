import { Avatar, AvatarBadge, Icon } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoEyeOutline, IoWalletOutline } from 'react-icons/io5';

// hooks
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// types
import type { IProps } from './types';

const AccountAvatar: FC<IProps> = ({ account }) => {
  // hooks
  const primaryButtonTextColor = usePrimaryButtonTextColor();
  const primaryColor = usePrimaryColor();
  // misc
  const icon = <Icon as={IoWalletOutline} color={primaryButtonTextColor} />;

  // add an eye badge for watch accounts
  if (account.watchAccount) {
    return (
      <Avatar bg={primaryColor} icon={icon} size="sm">
        <AvatarBadge bg="blue.500" borderWidth={0} boxSize="1.25em" p={1}>
          <Icon as={IoEyeOutline} color="white" h={3} w={3} />
        </AvatarBadge>
      </Avatar>
    );
  }

  return <Avatar bg={primaryColor} icon={icon} size="sm" />;
};

export default AccountAvatar;
