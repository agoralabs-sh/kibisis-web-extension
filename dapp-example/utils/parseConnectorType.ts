// types
import { ConnectionTypeEnum } from '../enums';

export default function parseConnectorType(value: ConnectionTypeEnum): string {
  switch (value) {
    case ConnectionTypeEnum.AlgorandProvider:
      return 'Alogrand Provider (Legacy)';
    case ConnectionTypeEnum.AVMWebProvider:
      return 'AVM Web Provider';
    case ConnectionTypeEnum.UseWallet:
      return 'UseWallet v3';
    case ConnectionTypeEnum.WalletConnect:
      return 'WalletConnect v2';
    default:
      return 'Unknown';
  }
}
