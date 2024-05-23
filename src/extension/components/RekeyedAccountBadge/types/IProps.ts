import type { ResponsiveValue } from '@chakra-ui/react';

interface IProps {
  authAddress: string;
  isAuthAccountAvailable?: boolean;
  size?: ResponsiveValue<'size'>;
  tooltipLabel?: string;
}

export default IProps;
