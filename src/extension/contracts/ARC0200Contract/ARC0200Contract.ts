import { ABIContract, ABIMethod, Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';

// abi
import abi from './abi.json';

// contracts
import BaseContract, { INewBaseContractOptions } from '../BaseContract';

// errors
import { ARC0200NotAValidApplicationError } from '@extension/errors';

// types
import { IARC0200AssetInformation } from '@extension/types';

import formatCurrencyUnit from '@common/utils/formatCurrencyUnit';

export default class ARC0200Contract extends BaseContract {
  constructor(options: INewBaseContractOptions) {
    super(options);

    this.abi = new ABIContract(abi);
  }

  /**
   * public functions
   */

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
   * Gets the decimals of the ARC-0200 asset.
   * @param {BigNumber} appId - the application ID of the ARC-0200 asset.
   * @returns {BigNumber} the decimals of the ARC-0200 asset.
   * @throws {ARC0200NotAValidApplication} if the supplied application ID is not an ARC-0200 asset.
   */
  public async decimals(appId: BigNumber): Promise<BigNumber> {
    const _functionName: string = 'decimals';
    let abiMethod: ABIMethod;
    let result: (BigNumber | null)[];
    let transaction: Transaction;

    try {
      abiMethod = this.abi.getMethodByName('arc200_decimals');
      transaction = await this.createReadApplicationTransaction({
        abiMethod,
        appId,
      });
      result = (await this.simulateTransactions(appId, [
        {
          abiMethod,
          transaction,
        },
      ])) as (BigNumber | null)[];
    } catch (error) {
      this.logger.error(
        `${ARC0200Contract.name}#${_functionName}: ${error.message}`
      );

      throw error;
    }

    if (!result[0]) {
      throw new ARC0200NotAValidApplicationError(appId.toString());
    }

    return result[0];
  }

  /**
   * Gets the name of the ARC-0200 asset.
   * @param {BigNumber} appId - the application ID of the ARC-0200 asset.
   * @returns {string} the name of the ARC-0200 asset.
   * @throws {ARC0200NotAValidApplication} if the supplied application ID is not an ARC-0200 asset.
   */
  public async name(appId: BigNumber): Promise<string> {
    const _functionName: string = 'name';
    let abiMethod: ABIMethod;
    let result: (string | null)[];
    let transaction: Transaction;

    try {
      abiMethod = this.abi.getMethodByName('arc200_name');
      transaction = await this.createReadApplicationTransaction({
        abiMethod,
        appId,
      });
      result = (await this.simulateTransactions(appId, [
        {
          abiMethod,
          transaction,
        },
      ])) as (string | null)[];
    } catch (error) {
      this.logger.error(
        `${ARC0200Contract.name}#${_functionName}: ${error.message}`
      );

      throw error;
    }

    if (!result[0]) {
      throw new ARC0200NotAValidApplicationError(appId.toString());
    }

    return this.trimNullBytes(result[0]);
  }

  /**
   * Gets the symbol of the ARC-0200 asset.
   * @param {BigNumber} appId - the application ID of the ARC-0200 asset.
   * @returns {string} the symbol of the ARC-0200 asset.
   * @throws {ARC0200NotAValidApplication} if the supplied application ID is not an ARC-0200 asset.
   */
  public async symbol(appId: BigNumber): Promise<string> {
    const _functionName: string = 'symbol';
    let abiMethod: ABIMethod;
    let result: (string | null)[];
    let transaction: Transaction;

    try {
      abiMethod = this.abi.getMethodByName('arc200_symbol');
      transaction = await this.createReadApplicationTransaction({
        abiMethod,
        appId,
      });
      result = (await this.simulateTransactions(appId, [
        {
          abiMethod,
          transaction,
        },
      ])) as (string | null)[];
    } catch (error) {
      this.logger.error(
        `${ARC0200Contract.name}#${_functionName}: ${error.message}`
      );

      throw error;
    }

    if (!result[0]) {
      throw new ARC0200NotAValidApplicationError(appId.toString());
    }

    return this.trimNullBytes(result[0]);
  }

  /**
   * Gets the total supply of the ARC-0200 asset.
   * @param {BigNumber} appId - the application ID of the ARC-0200 asset.
   * @returns {BigNumber} the total supply of the ARC-0200 asset.
   * @throws {ARC0200NotAValidApplication} if the supplied application ID is not an ARC-0200 asset.
   */
  public async totalSupply(appId: BigNumber): Promise<BigNumber> {
    const _functionName: string = 'totalSupply';
    let abiMethod: ABIMethod;
    let result: (BigNumber | null)[];
    let transaction: Transaction;

    try {
      abiMethod = this.abi.getMethodByName('arc200_totalSupply');
      transaction = await this.createReadApplicationTransaction({
        abiMethod,
        appId,
      });
      result = (await this.simulateTransactions(appId, [
        {
          abiMethod,
          transaction,
        },
      ])) as (BigNumber | null)[];
    } catch (error) {
      this.logger.error(
        `${ARC0200Contract.name}#${_functionName}: ${error.message}`
      );

      throw error;
    }

    if (!result[0]) {
      throw new ARC0200NotAValidApplicationError(appId.toString());
    }

    return result[0];
  }
}
