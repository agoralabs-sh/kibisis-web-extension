import { Avatar, AvatarProps } from '@chakra-ui/react';
import React, { FC } from 'react';

// hooks
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// types
import type { IProps } from './types';

const NFTAvatar: FC<IProps> = ({
  assetHolding,
  fallbackIcon,
  ...avatarProps
}) => {
  // hooks
  const primaryColor: string = usePrimaryColor();
  // misc
  const props: AvatarProps = {
    ...avatarProps,
    ...(assetHolding.metadata.image
      ? {
          src: assetHolding.metadata.image,
        }
      : {
          bg: primaryColor,
          icon: fallbackIcon,
        }),
  };

  return <Avatar {...props} />;
};

export default NFTAvatar;
