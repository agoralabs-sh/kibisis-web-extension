import { Avatar, Icon } from '@chakra-ui/react';
import React, { FC, PropsWithChildren } from 'react';
import { IoWalletOutline } from 'react-icons/io5';

// hooks
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

const AccountAvatar: FC<PropsWithChildren> = ({ children }) => {
  // hooks
  const primaryButtonTextColor = usePrimaryButtonTextColor();
  const primaryColor = usePrimaryColor();

  return (
    <Avatar
      bg={primaryColor}
      icon={<Icon as={IoWalletOutline} color={primaryButtonTextColor} />}
      size="sm"
    >
      {children}
    </Avatar>
  );
};

export default AccountAvatar;
