import type { Algodv2 } from 'algosdk';

// types
import type { IBaseOptions } from '@common/types';

/**
 * @property {string} feeSinkAddress - an account with some currency in is needed to guarantee a read transaction will
 * succeed.
 */
interface INewOptions extends IBaseOptions {
  algod: Algodv2;
  appId: string;
  feeSinkAddress: string;
}

export default INewOptions;
