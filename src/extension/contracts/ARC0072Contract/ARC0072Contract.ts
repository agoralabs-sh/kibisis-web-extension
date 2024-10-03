import { ABIContract, ABIMethod, ABIType } from 'algosdk';
import BigNumber from 'bignumber.js';

// abi
import abi from './abi.json';

// contracts
import BaseContract from '../BaseContract';

// enums
import { ARC0072MethodEnum } from './enums';

// errors
import { InvalidABIContractError } from '@extension/errors';

// types
import type { INewOptions } from '../BaseContract';

// utils
import isZeroAddress from '@extension/utils/isZeroAddress';

export default class ARC0072Contract extends BaseContract {
  constructor(options: INewOptions) {
    super(options);

    this._abi = new ABIContract(abi);
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
   * Gets the balance of the ARC-0072 asset for a given address.
   * @param {string} owner - the address of the account to check.
   * @returns {Promise<BigNumber>} the balance of the account.
   * @throws {InvalidABIContractError} if the application ID is not an ARC-0072 asset.
   * @throws {ReadABIContractError} if there was a problem reading the data.
   */
  public async balanceOf(owner: string): Promise<BigNumber> {
    const _functionName = 'balanceOf';
    let abiAddressArgType: ABIType | null;
    let abiMethod: ABIMethod;
    let result: BigNumber | null;

    try {
      abiMethod = this._abi.getMethodByName(ARC0072MethodEnum.BalanceOf);
      abiAddressArgType = abiMethod.args[0]?.type as ABIType;

      // if the first arg, owner, is not an address
      if (!abiAddressArgType || abiAddressArgType.toString() !== 'address') {
        throw new InvalidABIContractError(
          this._appId,
          `application "${this._appId}" not valid as method "${ARC0072MethodEnum.BalanceOf}" has an invalid "owner" type`
        );
      }

      result = (await this.readByMethod({
        abiMethod,
        appArgs: [abiAddressArgType.encode(owner)],
      })) as BigNumber | null;
    } catch (error) {
      this._logger.debug(
        `${ARC0072Contract.name}#${_functionName}: ${error.message}`
      );

      throw error;
    }

    if (!result) {
      throw new InvalidABIContractError(
        this._appId,
        `application "${this._appId}" not valid because the result returned "null"`
      );
    }

    return result;
  }

  /**
   * Gets the owner of a token for a given ID.
   * @param {BigNumber} tokenId - the token ID to check.
   * @returns {Promise<string | null>} returns the address or null if the ID has not been assigned.
   * @throws {InvalidABIContractError} if the application ID is not an ARC-0072 asset.
   * @throws {ReadABIContractError} if there was a problem reading the data.
   */
  public async ownerOf(tokenId: BigNumber): Promise<string | null> {
    const _functionName = 'ownerOf';
    let abiMethod: ABIMethod;
    let address: string;
    let encodedTokenId: Uint8Array;
    let result: string | null;

    try {
      abiMethod = this._abi.getMethodByName(ARC0072MethodEnum.OwnerOf);
      encodedTokenId = (abiMethod.args[0].type as ABIType).encode(
        BigInt(tokenId.toFixed())
      );
      result = (await this.readByMethod({
        abiMethod,
        appArgs: [encodedTokenId],
      })) as string | null;
    } catch (error) {
      this._logger.debug(
        `${ARC0072Contract.name}#${_functionName}: ${error.message}`
      );

      throw error;
    }

    if (!result) {
      throw new InvalidABIContractError(
        this._appId,
        `application "${this._appId}" not valid because the result returned "null"`
      );
    }

    address = this.trimNullBytes(result);

    // a zero address indicates the token ID has not been assigned, so return null
    if (isZeroAddress(address)) {
      return null;
    }

    return address;
  }

  /**
   * Gets the token ID of the token with the given index.
   * @param {BigNumber} index - the index.
   * @returns {BigNumber} the token ID for a given index.
   */
  public async tokenByIndex(index: BigNumber): Promise<BigNumber> {
    const _functionName = 'tokenByIndex';
    let abiMethod: ABIMethod;
    let encodedIndex: Uint8Array;
    let result: BigNumber | null;

    try {
      abiMethod = this._abi.getMethodByName(ARC0072MethodEnum.TokenByIndex);
      encodedIndex = (abiMethod.args[0].type as ABIType).encode(
        BigInt(index.toFixed())
      );
      result = (await this.readByMethod({
        abiMethod,
        appArgs: [encodedIndex],
      })) as BigNumber | null;
    } catch (error) {
      this._logger.debug(
        `${ARC0072Contract.name}#${_functionName}: ${error.message}`
      );

      throw error;
    }

    if (!result) {
      throw new InvalidABIContractError(
        this._appId,
        `application "${this._appId}" not valid because the result returned "null"`
      );
    }

    return result;
  }

  /**
   * Gets the token URI, the token metadata, for a given token ID.
   * @param {string} tokenId - the token ID to check.
   * @returns {string} the token URI of the ARC-0072 asset.
   * @throws {InvalidABIContractError} if the application ID is not an ARC-0072 asset.
   * @throws {ReadABIContractError} if there was a problem reading the data.
   */
  public async tokenURI(tokenId: BigNumber): Promise<string> {
    const _functionName = 'tokenURI';
    let abiMethod: ABIMethod;
    let encodedTokenId: Uint8Array;
    let result: string | null;

    try {
      abiMethod = this._abi.getMethodByName(ARC0072MethodEnum.TokenURI);
      encodedTokenId = (abiMethod.args[0].type as ABIType).encode(
        BigInt(tokenId.toFixed())
      );
      result = (await this.readByMethod({
        abiMethod,
        appArgs: [encodedTokenId],
      })) as string | null;
    } catch (error) {
      this._logger.debug(
        `${ARC0072Contract.name}#${_functionName}: ${error.message}`
      );

      throw error;
    }

    if (!result) {
      throw new InvalidABIContractError(
        this._appId,
        `application "${this._appId}" not valid because the result returned "null"`
      );
    }

    return this.trimNullBytes(result);
  }

  /**
   * Gets the total supply of the ARC-0072 asset.
   * @returns {BigNumber} the total supply of the ARC-0072 asset.
   * @throws {InvalidABIContractError} if the supplied application ID is not an ARC-0072 asset.
   * @throws {ReadABIContractError} if there was a problem reading the data.
   */
  public async totalSupply(): Promise<BigNumber> {
    const _functionName = 'totalSupply';
    let abiMethod: ABIMethod;
    let result: BigNumber | null;

    try {
      abiMethod = this._abi.getMethodByName(ARC0072MethodEnum.TotalSupply);
      result = (await this.readByMethod({
        abiMethod,
      })) as BigNumber | null;
    } catch (error) {
      this._logger.debug(
        `${ARC0072Contract.name}#${_functionName}: ${error.message}`
      );

      throw error;
    }

    if (!result) {
      throw new InvalidABIContractError(
        this._appId,
        `application "${this._appId}" not valid because the result returned "null"`
      );
    }

    return result;
  }
}
