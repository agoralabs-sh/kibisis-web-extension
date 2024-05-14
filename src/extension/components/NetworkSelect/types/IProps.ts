// types
import type { INetwork } from '@extension/types';

interface IProps {
  network: INetwork;
  networks: INetwork[];
  onSelect: (value: INetwork) => void;
}

export default IProps;
