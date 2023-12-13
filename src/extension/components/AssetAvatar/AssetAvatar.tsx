import { Avatar, AvatarBadge, AvatarProps, Icon } from '@chakra-ui/react';
import React, { FC, ReactElement } from 'react';
import { IoCheckmarkOutline } from 'react-icons/io5';

// hooks
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// types
import { IStandardAsset } from '@extension/types';

interface IProps extends AvatarProps {
  asset: IStandardAsset;
  fallbackIcon: ReactElement;
}

const AssetAvatar: FC<IProps> = ({
  asset,
  fallbackIcon,
  ...avatarProps
}: IProps) => {
  const primaryColor: string = usePrimaryColor();
  const props: AvatarProps = {
    ...avatarProps,
    ...(asset.iconUrl
      ? {
          src: asset.iconUrl,
        }
      : {
          bg: primaryColor,
          icon: fallbackIcon,
        }),
  };

  if (asset.verified) {
    return (
      <Avatar {...props}>
        <AvatarBadge bg="green.500" boxSize="1.25em" p={1}>
          <Icon as={IoCheckmarkOutline} color="white" h={2.5} w={2.5} />
        </AvatarBadge>
      </Avatar>
    );
  }

  return <Avatar {...props} />;
};

export default AssetAvatar;
