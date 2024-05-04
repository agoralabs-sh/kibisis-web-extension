import {
  ARC0027MethodEnum,
  INetworkConfiguration,
} from '@agoralabs-sh/avm-web-provider';

type INetworkConfigurationWithLegacyMethods = INetworkConfiguration & {
  methods: (ARC0027MethodEnum | 'signTxns')[];
};

export default INetworkConfigurationWithLegacyMethods;
