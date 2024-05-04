import {
  ARC0027MethodEnum,
  INetworkConfiguration,
} from '@agoralabs-sh/avm-web-provider';

type IUseWalletNetworkConfiguration = INetworkConfiguration & {
  methods: (ARC0027MethodEnum | 'signTxns')[];
};

export default IUseWalletNetworkConfiguration;
