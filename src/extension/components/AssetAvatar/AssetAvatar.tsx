import { Avatar, AvatarBadge, AvatarProps, Icon } from '@chakra-ui/react';
import React, { FC, ReactElement } from 'react';
import { IoCheckmarkOutline } from 'react-icons/io5';

// enums
import { AssetTypeEnum } from '@extension/enums';

// hooks
import usePrimaryColor from '@extension/hooks/usePrimaryColor';

// types
import { IAssetTypes, INativeCurrency } from '@extension/types';

interface IProps extends AvatarProps {
  asset: IAssetTypes | INativeCurrency;
  fallbackIcon?: ReactElement;
}

const AssetAvatar: FC<IProps> = ({
  asset,
  fallbackIcon,
  ...avatarProps
}: IProps) => {
  // hooks
  const primaryColor: string = usePrimaryColor();
  // misc
  let props: AvatarProps = avatarProps;

  switch (asset.type) {
    case AssetTypeEnum.ARC0200:
    case AssetTypeEnum.Standard:
      props = {
        ...props,
        ...(asset.iconUrl
          ? {
              src: asset.iconUrl,
            }
          : {
              bg: primaryColor,
              icon: fallbackIcon,
            }),
      };
      break;
    case AssetTypeEnum.Native:
      props = {
        ...props,
        src: asset.listingUri,
      };
      break;
    default:
      break;
  }

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
