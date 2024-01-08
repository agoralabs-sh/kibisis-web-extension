// enums
import { Arc0013ProviderMethodEnum } from '@common/enums';

interface IArc0013NetworkConfiguration {
  genesisHash: string;
  genesisId: string;
  methods: Arc0013ProviderMethodEnum[];
}

export default IArc0013NetworkConfiguration;
