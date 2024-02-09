import { ABIContract } from 'algosdk';
import BigNumber from 'bignumber.js';

// abi
import abi from './abi.json';

// contracts
import BaseContract, { INewBaseContractOptions } from '../BaseContract';

// errors
import { ARC0200NotAValidApplicationError } from '@extension/errors';

// types
import { IARC0200AssetInformation } from '@extension/types';

export default class ARC0200Contract extends BaseContract {
  constructor(options: INewBaseContractOptions) {
    super(options);

    this.abi = new ABIContract(abi);
  }

  /**
   * Gets the metadata for the ARC-0200 application.
   * @param {BigNumber} id - the ID of the ARC-0200 application.
   * @returns {Promise<IARC0200AssetInformation>} returns the ARC-0200 asset information.
   * @throws {ARC0200NotAValidApplication} if the application at ID does not exist or is not a valid ARC-0200
   * application.
   */
  // public async metadata(id: BigNumber): Promise<IARC0200AssetInformation> {
  //   const _functionName: string = 'metadata';
  //   let result: PendingTransactionResponse;
  //   let suggestedParams: SuggestedParams;
  //
  //   try {
  //     suggestedParams = await this.algodClient.getTransactionParams().do();
  //     result = await this.algodClient.simulateTransactions()
  //       .setIntDecoding(IntDecoding.BIGINT)
  //       .do();
  //
  //
  //   } catch (error) {
  //     this.logger.debug(`${ARC0200Contract.name}#${_functionName}: ${error.message}`);
  //   }
  // }

  /**
   * Gets the name of the ARC-0200 asset.
   * @param {BigNumber} appId - the application ID of the ARC-0200 asset.
   * @returns {string} the name of the ARC-0200 asset.
   * @throws {ARC0200NotAValidApplication} if the supplied application ID is not an ARC-0200 asset.
   */
  public async name(appId: BigNumber): Promise<string> {
    const _functionName: string = 'name';
    let result: Uint8Array | null;

    try {
      result = await this.readByMethodName<Uint8Array>('arc200_name', {
        appId,
      });
    } catch (error) {
      this.logger.error(
        `${ARC0200Contract.name}#${_functionName}: ${error.message}`
      );

      throw error;
    }

    if (!result) {
      throw new ARC0200NotAValidApplicationError(appId.toString());
    }

    return this.trimNullBytes(new TextDecoder().decode(result));
  }

  /**
   * Gets the symbol of the ARC-0200 asset.
   * @param {BigNumber} appId - the application ID of the ARC-0200 asset.
   * @returns {string} the symbol of the ARC-0200 asset.
   * @throws {ARC0200NotAValidApplication} if the supplied application ID is not an ARC-0200 asset.
   */
  public async symbol(appId: BigNumber): Promise<string> {
    const _functionName: string = 'symbol';
    let result: Uint8Array | null;

    try {
      result = await this.readByMethodName<Uint8Array>('arc200_symbol', {
        appId,
      });
    } catch (error) {
      this.logger.error(
        `${ARC0200Contract.name}#${_functionName}: ${error.message}`
      );

      throw error;
    }

    if (!result) {
      throw new ARC0200NotAValidApplicationError(appId.toString());
    }

    return this.trimNullBytes(new TextDecoder().decode(result));
  }
}
