import { ABIContract, ABIMethod, ABIType, Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';

// abi
import abi from './abi.json';

// contracts
import BaseContract, {
  IABIResult,
  INewBaseContractOptions,
  ISimulateTransaction,
} from '../BaseContract';

// enums
import { ARC0200MethodEnum } from './enums';

// errors
import { InvalidABIContractError } from '@extension/errors';

// types
import type { IARC0200AssetInformation } from '@extension/types';

export default class ARC0200Contract extends BaseContract {
  constructor(options: INewBaseContractOptions) {
    super(options);

    this.abi = new ABIContract(abi);
  }

  /**
   * public functions
   */

  /**
   * Gets the balance of the asset for a given address.
   * @param {string} address - the address of the account to check.
   * @returns {Promise<BigNumber>} the balance of the account.
   * @throws {InvalidABIContractError} if the application ID is not an ARC-0200 asset.
   * @throws {ReadABIContractError} if there was a problem reading the data.
   */
  public async balanceOf(address: string): Promise<BigNumber> {
    const _functionName: string = 'balanceOf';
    let abiAddressArgType: ABIType | null;
    let abiMethod: ABIMethod;
    let result: (BigNumber | null)[];
    let transaction: Transaction;

    try {
      abiMethod = this.abi.getMethodByName(ARC0200MethodEnum.BalanceOf);
      abiAddressArgType = abiMethod.args[0]?.type as ABIType;

      // if the first arg, owner, is not an address
      if (abiAddressArgType && abiAddressArgType.toString() !== 'address') {
        throw new InvalidABIContractError(
          this.appId.toString(),
          `application "${this.appId.toString()}" not  valid as method "${
            ARC0200MethodEnum.BalanceOf
          }" has an invalid "owner" type`
        );
      }

      transaction = await this.createReadApplicationTransaction({
        abiMethod,
        appArgs: [abiAddressArgType.encode(address)],
      });
      result = (await this.simulateTransactions([
        {
          abiMethod,
          transaction,
        },
      ])) as (BigNumber | null)[];
    } catch (error) {
      this.logger.debug(
        `${ARC0200Contract.name}#${_functionName}: ${error.message}`
      );

      throw error;
    }

    if (!result[0]) {
      throw new InvalidABIContractError(
        this.appId.toString(),
        `application "${this.appId.toString()}" not valid because the result returned "null"`
      );
    }

    return result[0];
  }

  /**
   * Gets the decimals of the ARC-0200 asset.
   * @returns {BigNumber} the decimals of the ARC-0200 asset.
   * @throws {InvalidABIContractError} if the application ID is not an ARC-0200 asset.
   * @throws {ReadABIContractError} if there was a problem reading the data.
   */
  public async decimals(): Promise<BigNumber> {
    const _functionName: string = 'decimals';
    let abiMethod: ABIMethod;
    let result: (BigNumber | null)[];
    let transaction: Transaction;

    try {
      abiMethod = this.abi.getMethodByName(ARC0200MethodEnum.Decimals);
      transaction = await this.createReadApplicationTransaction({
        abiMethod,
      });
      result = (await this.simulateTransactions([
        {
          abiMethod,
          transaction,
        },
      ])) as (BigNumber | null)[];
    } catch (error) {
      this.logger.debug(
        `${ARC0200Contract.name}#${_functionName}: ${error.message}`
      );

      throw error;
    }

    if (!result[0]) {
      throw new InvalidABIContractError(
        this.appId.toString(),
        `application "${this.appId.toString()}" not valid because the result returned "null"`
      );
    }

    return result[0];
  }

  /**
   * Gets the metadata for the ARC-0200 application.
   * @returns {Promise<IARC0200AssetInformation>} returns the ARC-0200 asset information.
   * @throws {InvalidABIContractError} if the application at ID does not exist or is not a valid ARC-0200
   * application.
   * @throws {ReadABIContractError} if there was a problem reading the data.
   */
  public async metadata(): Promise<IARC0200AssetInformation> {
    const _functionName: string = 'metadata';
    let simulateTransactions: ISimulateTransaction[];
    let results: (IABIResult | null)[];

    try {
      simulateTransactions = await Promise.all<ISimulateTransaction>(
        [
          ARC0200MethodEnum.Decimals,
          ARC0200MethodEnum.Name,
          ARC0200MethodEnum.Symbol,
          ARC0200MethodEnum.TotalSupply,
        ].map(async (value) => {
          const abiMethod: ABIMethod = this.abi.getMethodByName(value);

          return {
            abiMethod,
            transaction: await this.createReadApplicationTransaction({
              abiMethod,
            }),
          };
        })
      );
      results = await this.simulateTransactions(simulateTransactions);
    } catch (error) {
      this.logger.debug(
        `${ARC0200Contract.name}#${_functionName}: ${error.message}`
      );

      throw error;
    }

    // if any are null, the application is not an valid arc-0200
    if (results.some((value) => !value)) {
      throw new InvalidABIContractError(
        this.appId.toString(),
        `application "${this.appId.toString()}" not valid because a result returned "null"`
      );
    }

    const [decimalResult, nameResult, symbolResult, totalSupplyResult] =
      results;

    return {
      decimals: BigInt((decimalResult as BigNumber).toString()),
      name: this.trimNullBytes(nameResult as string),
      symbol: this.trimNullBytes(symbolResult as string),
      totalSupply: BigInt((totalSupplyResult as BigNumber).toString()),
    };
  }

  /**
   * Gets the name of the ARC-0200 asset.
   * @returns {string} the name of the ARC-0200 asset.
   * @throws {InvalidABIContractError} if the application ID is not an ARC-0200 asset.
   * @throws {ReadABIContractError} if there was a problem reading the data.
   */
  public async name(): Promise<string> {
    const _functionName: string = 'name';
    let abiMethod: ABIMethod;
    let result: (string | null)[];
    let transaction: Transaction;

    try {
      abiMethod = this.abi.getMethodByName(ARC0200MethodEnum.Name);
      transaction = await this.createReadApplicationTransaction({
        abiMethod,
      });
      result = (await this.simulateTransactions([
        {
          abiMethod,
          transaction,
        },
      ])) as (string | null)[];
    } catch (error) {
      this.logger.debug(
        `${ARC0200Contract.name}#${_functionName}: ${error.message}`
      );

      throw error;
    }

    if (!result[0]) {
      throw new InvalidABIContractError(
        this.appId.toString(),
        `application "${this.appId.toString()}" not valid because the result returned "null"`
      );
    }

    return this.trimNullBytes(result[0]);
  }

  /**
   * Gets the symbol of the ARC-0200 asset.
   * @returns {string} the symbol of the ARC-0200 asset.
   * @throws {InvalidABIContractError} if the supplied application ID is not an ARC-0200 asset.
   * @throws {ReadABIContractError} if there was a problem reading the data.
   */
  public async symbol(): Promise<string> {
    const _functionName: string = 'symbol';
    let abiMethod: ABIMethod;
    let result: (string | null)[];
    let transaction: Transaction;

    try {
      abiMethod = this.abi.getMethodByName(ARC0200MethodEnum.Symbol);
      transaction = await this.createReadApplicationTransaction({
        abiMethod,
      });
      result = (await this.simulateTransactions([
        {
          abiMethod,
          transaction,
        },
      ])) as (string | null)[];
    } catch (error) {
      this.logger.debug(
        `${ARC0200Contract.name}#${_functionName}: ${error.message}`
      );

      throw error;
    }

    if (!result[0]) {
      throw new InvalidABIContractError(
        this.appId.toString(),
        `application "${this.appId.toString()}" not valid because the result returned "null"`
      );
    }

    return this.trimNullBytes(result[0]);
  }

  /**
   * Gets the total supply of the ARC-0200 asset.
   * @returns {BigNumber} the total supply of the ARC-0200 asset.
   * @throws {InvalidABIContractError} if the supplied application ID is not an ARC-0200 asset.
   * @throws {ReadABIContractError} if there was a problem reading the data.
   */
  public async totalSupply(): Promise<BigNumber> {
    const _functionName: string = 'totalSupply';
    let abiMethod: ABIMethod;
    let result: (BigNumber | null)[];
    let transaction: Transaction;

    try {
      abiMethod = this.abi.getMethodByName(ARC0200MethodEnum.TotalSupply);
      transaction = await this.createReadApplicationTransaction({
        abiMethod,
      });
      result = (await this.simulateTransactions([
        {
          abiMethod,
          transaction,
        },
      ])) as (BigNumber | null)[];
    } catch (error) {
      this.logger.debug(
        `${ARC0200Contract.name}#${_functionName}: ${error.message}`
      );

      throw error;
    }

    if (!result[0]) {
      throw new InvalidABIContractError(
        this.appId.toString(),
        `application "${this.appId.toString()}" not valid because the result returned "null"`
      );
    }

    return result[0];
  }
}
