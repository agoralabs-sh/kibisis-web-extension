// types
import type { IBaseOptions } from '@common/types';
import type { IAccount, IAssetTypes, INetwork } from '@extension/types';

/**
 * @property {IAccount} account - the account to check.
 * @property {IAssetTypes} asset - the asset to check.
 * @property {INetwork} network - the network information.
 */
interface IOptions extends IBaseOptions {
  account: IAccount;
  asset: IAssetTypes;
  network: INetwork;
}

export default IOptions;
