// types
import IArc0001SignTxns from './IArc0013SignTxns';

interface IArc0013SignTxnsParams {
  genesisHash: string;
  providerId: string;
  txns: IArc0001SignTxns[];
}

export default IArc0013SignTxnsParams;
