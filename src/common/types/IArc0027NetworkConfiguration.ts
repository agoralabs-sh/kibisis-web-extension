// enums
import { Arc0027ProviderMethodEnum } from '@common/enums';

interface IArc0027NetworkConfiguration {
  genesisHash: string;
  genesisId: string;
  methods: Arc0027ProviderMethodEnum[];
}

export default IArc0027NetworkConfiguration;
