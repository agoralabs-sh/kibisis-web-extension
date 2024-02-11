// enums
import { ARC0027ProviderMethodEnum } from '@common/enums';

interface IARC0027NetworkConfiguration {
  genesisHash: string;
  genesisId: string;
  methods: ARC0027ProviderMethodEnum[];
}

export default IARC0027NetworkConfiguration;
