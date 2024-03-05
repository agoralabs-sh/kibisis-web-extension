import { AvatarProps } from '@chakra-ui/react';
import { ReactElement } from 'react';

// types
import type { IAssetTypes, INativeCurrency } from '@extension/types';

interface IProps extends AvatarProps {
  asset: IAssetTypes | INativeCurrency;
  fallbackIcon?: ReactElement;
}

export default IProps;
