// enums
import { ConnectionTypeEnum } from '../../../enums';

type THandleConnectParams =
  | {
      connectionType:
        | ConnectionTypeEnum.AlgorandProvider
        | ConnectionTypeEnum.AVMWebProvider;
      genesisHash: string;
    }
  | {
      connectionType: ConnectionTypeEnum.UseWallet;
    };

export default THandleConnectParams;
