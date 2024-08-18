import { ARC0027MethodEnum } from '@agoralabs-sh/avm-web-provider';

// enums
import { NetworkTypeEnum } from '@extension/enums';

// models
import BaseBlockExplorer from '@extension/models/BaseBlockExplorer';
import BaseARC0072Indexer from '@extension/models/BaseARC0072Indexer';
import BaseNFTExplorer from '@extension/models/BaseNFTExplorer';

// types
import type { IBaseWithDiscriminator } from '@common/types';
import type { INativeCurrency } from '../assets';
import type IChainNamespace from './IChainNamespace';
import type INode from './INode';

interface INetwork extends IBaseWithDiscriminator<'INetwork'> {
  algods: INode[];
  arc0072Indexers: BaseARC0072Indexer[];
  blockExplorers: BaseBlockExplorer[];
  canonicalName: string;
  chakraTheme: string;
  feeSunkAddress: string;
  genesisHash: string;
  genesisId: string;
  indexers: INode[];
  methods: ARC0027MethodEnum[];
  namespace: IChainNamespace;
  nativeCurrency: INativeCurrency;
  nftExplorers: BaseNFTExplorer[];
  type: NetworkTypeEnum;
}

export default INetwork;
