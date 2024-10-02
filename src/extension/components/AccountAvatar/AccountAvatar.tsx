import { Avatar, Icon } from '@chakra-ui/react';
import React, { type FC } from 'react';

// hooks
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// types
import type { IProps } from './types';

// utils
import parseAccountIcon from '@extension/utils/parseAccountIcon';

const AccountAvatar: FC<IProps> = ({ icon, children }) => {
  // hooks
  const primaryButtonTextColor = usePrimaryButtonTextColor();
  const primaryColor = usePrimaryColor();

  return (
    <Avatar
      bg={primaryColor}
      icon={<Icon as={parseAccountIcon(icon)} color={primaryButtonTextColor} />}
      size="sm"
    >
      {children}
    </Avatar>
  );
};

export default AccountAvatar;
