import { AvatarProps } from '@chakra-ui/react';
import { ReactElement } from 'react';

// types
import type { IARC0072AssetHolding } from '@extension/types';

interface IProps extends AvatarProps {
  assetHolding: IARC0072AssetHolding;
  fallbackIcon?: ReactElement;
}

export default IProps;
