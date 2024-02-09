import algosdk, {
  ABIContract,
  ABIMethod,
  Algodv2,
  assignGroupID,
  decodeObj,
  encodeUnsignedSimulateTransaction,
  IntDecoding,
  makeApplicationNoOpTxn,
  SuggestedParams,
  Transaction,
} from 'algosdk';
import type { EncodedSignedTransaction } from 'algosdk/dist/types/types/transactions/encoded';

// constants
import { SIMULATE_MINIMUM_FEE } from './constants';

// types
import type { ILogger } from '@common/types';
import type { INetwork } from '@extension/types';
import type {
  INewBaseContractOptions,
  IParseReadResponseOptions,
  IReadByMethodNameOptions,
} from './types';

// utils
import createAlgodClient from '@common/utils/createAlgodClient';
import createLogger from '@common/utils/createLogger';

export default class BaseContract {
  // protected
  protected abi: ABIContract;
  protected readonly logger: ILogger;
  protected network: INetwork;

  constructor({ logger, network }: INewBaseContractOptions) {
    this.logger =
      logger || createLogger(__ENV__ === 'development' ? 'debug' : 'error');
    this.network = network;
  }

  /**
   * private functions
   */

  private parseReadResponse<Response = Uint8Array>({
    abiMethod,
    appId,
    methodName,
    response,
  }: IParseReadResponseOptions): Response | null {
    const _functionName: string = 'parseReadResponse';
    const log: Uint8Array | null =
      response.txnGroups[0].txnResults[0].txnResult.logs?.pop() || null;
    let type: string;

    if (!log) {
      this.logger.debug(
        `${
          BaseContract.name
        }#${_functionName}: no log found for application "${appId.toString()}" and method "${methodName}"`
      );

      return null;
    }

    // if the abi is not expecting a return
    if (abiMethod.returns.type === 'void') {
      return null;
    }

    type = (abiMethod.returns.type as algosdk.ABIType).toString();

    // if we have bytes return them as bytes
    if (type.includes('byte')) {
      return log.slice(4) as Response; // remove the prefix
    }

    return null;
  }

  /**
   * protected functions
   */

  /**
   * Using the method name, this simulates an app call transaction and reads the logs and parses the response. This is
   * used to read data from an application.
   * @param {string} methodName - the name of the method to call.
   * @param {IReadByMethodNameOptions} - various other options required.
   * @returns {Promise<Response | null>} the parsed response or null.
   * @protected
   */
  protected async readByMethodName<Response = Uint8Array>(
    methodName: string,
    { appId, appArgs }: IReadByMethodNameOptions
  ): Promise<Response | null> {
    const _functionName: string = 'readByMethodName';
    const algodClient: Algodv2 = createAlgodClient(this.network, {
      logger: this.logger,
    });
    let abiMethod: ABIMethod;
    let request: algosdk.modelsv2.SimulateRequest;
    let response: algosdk.modelsv2.SimulateResponse;
    let suggestedParams: SuggestedParams;
    let transactions: Transaction[];

    try {
      abiMethod = this.abi.getMethodByName(methodName);
      suggestedParams = await algodClient.getTransactionParams().do();
      transactions = [
        makeApplicationNoOpTxn(
          this.network.feeSunkAddress,
          {
            ...suggestedParams,
            fee: SIMULATE_MINIMUM_FEE,
            flatFee: true,
          },
          appId.toNumber(),
          [
            abiMethod.getSelector(), // method name
            ...(appArgs ? appArgs : []), // the method parameters
          ]
        ),
      ];

      assignGroupID(transactions);

      request = new algosdk.modelsv2.SimulateRequest({
        allowUnnamedResources: true,
        allowEmptySignatures: true,
        txnGroups: [
          new algosdk.modelsv2.SimulateRequestTransactionGroup({
            txns: transactions.map(
              (value) =>
                decodeObj(
                  encodeUnsignedSimulateTransaction(value)
                ) as EncodedSignedTransaction
            ),
          }),
        ],
      });
      response = await algodClient
        .simulateTransactions(request)
        .setIntDecoding(IntDecoding.BIGINT)
        .do();

      return this.parseReadResponse<Response>({
        abiMethod,
        appId,
        methodName,
        response,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Convenience function that simply removes the null bytes ("\x00") from a decoded string.
   * @param {string} input - the string to trim.
   * @returns {string} the string with the null bytes trimmed.
   * @private
   */
  protected trimNullBytes(input: string): string {
    return input.replaceAll('\x00', '');
  }

  /**
   * public functions
   */
  public setNetwork(network: INetwork): void {
    this.network = network;
  }
}
