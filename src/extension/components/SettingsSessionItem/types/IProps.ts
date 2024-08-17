// types
import type { INetwork, ISession } from '@extension/types';

interface IProps {
  item: ISession;
  network: INetwork;
  onDisconnect: (id: string) => void;
  onSelect: (id: string) => void;
}

export default IProps;
