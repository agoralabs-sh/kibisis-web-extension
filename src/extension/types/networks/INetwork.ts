import { ARC0027MethodEnum } from '@agoralabs-sh/avm-web-provider';

// enums
import { NetworkTypeEnum } from '@extension/enums';

// types
import type { IARC0072Indexer } from '../arc-0072';
import type { INativeCurrency } from '../assets';
import type IChainNamespace from './IChainNamespace';
import type IBlockExplorer from './IBlockExplorer';
import type INFTExplorer from './INFTExplorer';
import type INode from './INode';

interface INetwork {
  algods: INode[];
  arc0072Indexers: IARC0072Indexer[];
  blockExplorers: IBlockExplorer[];
  canonicalName: string;
  chakraTheme: string;
  feeSunkAddress: string;
  genesisHash: string;
  genesisId: string;
  indexers: INode[];
  methods: ARC0027MethodEnum[];
  namespace: IChainNamespace;
  nativeCurrency: INativeCurrency;
  nftExplorers: INFTExplorer[];
  type: NetworkTypeEnum;
}

export default INetwork;
