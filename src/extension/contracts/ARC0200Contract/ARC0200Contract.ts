import algosdk, {
  ABIContract,
  ABIMethod,
  ABIType,
  assignGroupID,
  makePaymentTxnWithSuggestedParams,
  SuggestedParams,
  Transaction,
} from 'algosdk';
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
import {
  InvalidABIContractError,
  ReadABIContractError,
} from '@extension/errors';

// types
import type { IARC0200AssetInformation } from '@extension/types';
import type { ITransferOptions } from './types';

// utils
import calculateAppMbrForBox from '@extension/utils/calculateAppMbrForBox';

export default class ARC0200Contract extends BaseContract {
  constructor(options: INewBaseContractOptions) {
    super(options);

    this.abi = new ABIContract(abi);
  }

  /**
   * public static functions
   */

  public static getABI(): ABIContract {
    return new ABIContract(abi);
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
    let result: BigNumber | null;

    try {
      abiMethod = this.abi.getMethodByName(ARC0200MethodEnum.BalanceOf);
      abiAddressArgType = abiMethod.args[0]?.type as ABIType;

      // if the first arg, owner, is not an address
      if (!abiAddressArgType || abiAddressArgType.toString() !== 'address') {
        throw new InvalidABIContractError(
          this.appId.toString(),
          `application "${this.appId.toString()}" not valid as method "${
            ARC0200MethodEnum.BalanceOf
          }" has an invalid "owner" type`
        );
      }

      result = (await this.readByMethod({
        abiMethod,
        appArgs: [abiAddressArgType.encode(address)],
      })) as BigNumber | null;
    } catch (error) {
      this.logger.debug(
        `${ARC0200Contract.name}#${_functionName}: ${error.message}`
      );

      throw error;
    }

    if (!result) {
      throw new InvalidABIContractError(
        this.appId.toString(),
        `application "${this.appId.toString()}" not valid because the result returned "null"`
      );
    }

    return result;
  }

  public async buildUnsignedTransferTransactions({
    amountInAtomicUnits,
    authAddress,
    fromAddress,
    note,
    toAddress,
  }: ITransferOptions): Promise<Transaction[]> {
    const _functionName: string = 'buildUnsignedTransferTransactions';
    let _error: string;
    let abiMethod: ABIMethod;
    let appArgs: Uint8Array[];
    let appWriteTransaction: Transaction;
    let toBalance: BigNumber;
    let paymentTransaction: Transaction | null = null;
    let boxStorageAmount: BigNumber;
    let boxReferences: algosdk.modelsv2.BoxReference[] | null;
    let encodedAmount: Uint8Array;
    let encodedToAddress: Uint8Array;
    let suggestedParams: SuggestedParams;
    let transactions: Transaction[];

    try {
      abiMethod = this.abi.getMethodByName(ARC0200MethodEnum.Transfer);

      // check the "to" arg
      if (
        !abiMethod.args[0] ||
        abiMethod.args[0].type.toString() !== 'address'
      ) {
        throw new InvalidABIContractError(
          this.appId.toString(),
          `application "${this.appId.toString()}" not valid as method "${
            ARC0200MethodEnum.Transfer
          }" has an invalid "to" type`
        );
      }

      // check the "value" arg
      if (
        !abiMethod.args[1] ||
        abiMethod.args[1].type.toString() !== 'uint256'
      ) {
        throw new InvalidABIContractError(
          this.appId.toString(),
          `application "${this.appId.toString()}" not valid as method "${
            ARC0200MethodEnum.Transfer
          }" has an invalid "value" type`
        );
      }

      encodedAmount = (abiMethod.args[1].type as ABIType).encode(
        BigInt(String(amountInAtomicUnits.toString()))
      );
      encodedToAddress = (abiMethod.args[0].type as ABIType).encode(toAddress);
      appArgs = [encodedToAddress, encodedAmount];
      toBalance = await this.balanceOf(toAddress);
      suggestedParams = await this.algodClient.getTransactionParams().do();
      boxReferences = await this.determineBoxReferences({
        abiMethod,
        appArgs,
        authAddress,
        fromAddress,
        suggestedParams,
      });

      if (!boxReferences) {
        throw new Error(
          `failed to get box references for sender "${fromAddress}" and recipient "${toAddress}"`
        );
      }

      // if the balance is zero, we will need to create a payment transaction to fund a box
      if (toBalance.lte(0)) {
        this.logger.debug(
          `${ARC0200Contract.name}#${_functionName}: no balance detected, adding payment for box`
        );

        boxStorageAmount = calculateAppMbrForBox(
          new BigNumber(boxReferences[0].name.length),
          new BigNumber(encodedAmount.length)
        );
        paymentTransaction = makePaymentTxnWithSuggestedParams(
          fromAddress,
          this.applicationAddress(), // send funds to application account
          BigInt(String(boxStorageAmount.toString())),
          undefined,
          new TextEncoder().encode(
            `initial box storage funding for account "${toAddress}" in application "${this.appId.toString()}"`
          ),
          suggestedParams
        );
      }

      // create the app write application based on the box storage
      appWriteTransaction = await this.createWriteApplicationTransaction({
        abiMethod,
        appArgs,
        boxes: boxReferences.map(({ name }: algosdk.modelsv2.BoxReference) => ({
          appIndex: new BigNumber(this.appId).toNumber(),
          name,
        })),
        fromAddress,
        note,
        suggestedParams,
      });
      transactions = [
        ...(paymentTransaction ? [paymentTransaction] : []),
        appWriteTransaction,
      ];

      // if there is a payment transaction, group them together
      if (transactions.length > 1) {
        assignGroupID(transactions);
      }

      return transactions;
    } catch (error) {
      this.logger.debug(
        `${ARC0200Contract.name}#${_functionName}: ${error.message}`
      );

      throw error;
    }
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
    let result: BigNumber | null;

    try {
      abiMethod = this.abi.getMethodByName(ARC0200MethodEnum.Decimals);
      result = (await this.readByMethod({
        abiMethod,
      })) as BigNumber | null;
    } catch (error) {
      this.logger.debug(
        `${ARC0200Contract.name}#${_functionName}: ${error.message}`
      );

      throw error;
    }

    if (!result) {
      throw new InvalidABIContractError(
        this.appId.toString(),
        `application "${this.appId.toString()}" not valid because the result returned "null"`
      );
    }

    return result;
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
    let response: algosdk.modelsv2.SimulateResponse;
    let results: (IABIResult | null)[];
    let suggestedParams: SuggestedParams;

    try {
      suggestedParams = await this.algodClient.getTransactionParams().do();
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
              suggestedParams,
            }),
          };
        })
      );

      response = await this.simulateTransactions(simulateTransactions);

      if (response.txnGroups[0].failureMessage) {
        throw new ReadABIContractError(
          this.appId.toString(),
          response.txnGroups[0].failureMessage
        );
      }

      results = response.txnGroups[0].txnResults.map((value, index) =>
        this.parseTransactionResponse({
          abiMethod: simulateTransactions[index].abiMethod,
          response: value.txnResult,
        })
      );
    } catch (error) {
      this.logger.debug(
        `${ARC0200Contract.name}#${_functionName}: ${error.message}`
      );

      throw error;
    }

    // if any are null, the application is not a valid arc-0200 application
    if (results.some((value) => !value)) {
      throw new InvalidABIContractError(
        this.appId.toString(),
        `application "${this.appId.toString()}" not valid because a result returned "null"`
      );
    }

    const [decimalResult, nameResult, symbolResult, totalSupplyResult] =
      results;

    return {
      decimals: (decimalResult as BigNumber).toNumber(),
      name: this.trimNullBytes(nameResult as string),
      symbol: this.trimNullBytes(symbolResult as string),
      totalSupply: (totalSupplyResult as BigNumber).toString(),
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
    let result: string | null;

    try {
      abiMethod = this.abi.getMethodByName(ARC0200MethodEnum.Name);
      result = (await this.readByMethod({
        abiMethod,
      })) as string | null;
    } catch (error) {
      this.logger.debug(
        `${ARC0200Contract.name}#${_functionName}: ${error.message}`
      );

      throw error;
    }

    if (!result) {
      throw new InvalidABIContractError(
        this.appId.toString(),
        `application "${this.appId.toString()}" not valid because the result returned "null"`
      );
    }

    return this.trimNullBytes(result);
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
    let result: string | null;

    try {
      abiMethod = this.abi.getMethodByName(ARC0200MethodEnum.Symbol);
      result = (await this.readByMethod({
        abiMethod,
      })) as string | null;
    } catch (error) {
      this.logger.debug(
        `${ARC0200Contract.name}#${_functionName}: ${error.message}`
      );

      throw error;
    }

    if (!result) {
      throw new InvalidABIContractError(
        this.appId.toString(),
        `application "${this.appId.toString()}" not valid because the result returned "null"`
      );
    }

    return this.trimNullBytes(result);
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
    let result: BigNumber | null;

    try {
      abiMethod = this.abi.getMethodByName(ARC0200MethodEnum.TotalSupply);
      result = (await this.readByMethod({
        abiMethod,
      })) as BigNumber | null;
    } catch (error) {
      this.logger.debug(
        `${ARC0200Contract.name}#${_functionName}: ${error.message}`
      );

      throw error;
    }

    if (!result) {
      throw new InvalidABIContractError(
        this.appId.toString(),
        `application "${this.appId.toString()}" not valid because the result returned "null"`
      );
    }

    return result;
  }
}
