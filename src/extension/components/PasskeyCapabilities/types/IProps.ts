// types
import type { TSizes } from '@extension/types';

interface IProps {
  capabilities: AuthenticatorTransport[];
  size?: TSizes;
}

export default IProps;
