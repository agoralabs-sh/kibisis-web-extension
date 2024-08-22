// types
import type { INetwork } from '@extension/types';

interface IProps {
  context: string;
  networks: INetwork[];
  onSelect: (value: INetwork) => void;
  value: INetwork;
}

export default IProps;
