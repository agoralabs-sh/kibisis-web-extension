// types
import type { INetwork, IPropsWithContext, TSizes } from '@extension/types';

interface IProps extends IPropsWithContext {
  networks: INetwork[];
  onSelect: (value: INetwork) => void;
  size?: TSizes;
  value: INetwork;
}

export default IProps;
