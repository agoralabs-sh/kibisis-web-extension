import type { ResponsiveValue } from '@chakra-ui/react';

// types
import type { INetwork } from '@extension/types';

interface IProps {
  network: INetwork;
  size?: ResponsiveValue<'size'>;
}

export default IProps;
