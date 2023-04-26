// Enums
import { NetworkTypeEnum } from '../enums';

// Types
import IExplorer from './IExplorer';
import INativeCurrency from './INativeCurrency';
import INode from './INode';

interface INetwork {
  canonicalName: string;
  chakraTheme: string;
  explorers: IExplorer[];
  genesisHash: string;
  genesisId: string;
  nativeCurrency: INativeCurrency;
  nodes: INode[];
  type: NetworkTypeEnum;
}

export default INetwork;
