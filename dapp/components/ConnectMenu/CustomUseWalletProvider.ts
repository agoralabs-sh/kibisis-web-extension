import {
  encode as encodeBase64,
  decode as decodeBase64,
} from '@stablelib/base64';
import {
  CustomProvider,
  DecodedSignedTransaction,
  DecodedTransaction,
  Metadata,
  PROVIDER_ID,
  Wallet,
} from '@txnlab/use-wallet';
import {
  Algodv2,
  decodeObj,
  decodeSignedTransaction,
  decodeUnsignedTransaction,
  encodeAddress,
} from 'algosdk';
import { v4 as uuid } from 'uuid';

// config
import { networks } from '@extension/config';

// constants
import {
  ARC_0013_CHANNEL_NAME,
  ARC_0013_DEFAULT_REQUEST_TIMEOUT,
  ARC_0013_LOWER_REQUEST_TIMEOUT,
} from '@common/constants';

// enums
import {
  Arc0013MessageReferenceEnum,
  Arc0013ProviderMethodEnum,
} from '@common/enums';

// errors
import {
  SerializableArc0013MethodNotSupportedError,
  SerializableArc0013MethodTimedOutError,
  SerializableArc0013NetworkNotSupportedError,
  SerializableArc0013UnknownError,
} from '@common/errors';

// types
import {
  IArc0013Account,
  IArc0013EnableParams,
  IArc0013EnableResult,
  IArc0013GetProvidersParams,
  IArc0013GetProvidersResult,
  IArc0013NetworkConfiguration,
  IArc0013RequestMessageSchema,
  IArc0013ResponseMessageSchema,
  IArc0013SignTxns,
  IArc0013SignTxnsParams,
  IArc0013SignTxnsResult,
  ILogger,
} from '@common/types';
import { IAlgorandAccountInformation, INetwork } from '@extension/types';

// utils
import createLogger from '@common/utils/createLogger';
import algorandAccountInformationWithDelay from '@extension/utils/algorandAccountInformationWithDelay';

export interface SendRequestWithTimeoutOptions<Params> {
  method: Arc0013ProviderMethodEnum;
  params: Params;
  reference: Arc0013MessageReferenceEnum;
  timeout?: number;
}

export default class CustomUseWalletProvider implements CustomProvider {
  private algod: Algodv2 | null = null;
  public genesisHash: string | null = null;
  private methods: Arc0013ProviderMethodEnum[];
  private readonly logger: ILogger;

  constructor() {
    this.logger = createLogger('debug');
  }

  /**
   * private static functions
   */

  private static async sendRequestWithTimeout<Params, Result>({
    method,
    params,
    timeout,
    reference,
  }: SendRequestWithTimeoutOptions<Params>): Promise<Result | undefined> {
    return new Promise<Result | undefined>((resolve, reject) => {
      const channel = new BroadcastChannel(ARC_0013_CHANNEL_NAME);
      const requestId = uuid();
      // eslint-disable-next-line prefer-const
      let timer: number;

      // listen to responses
      channel.onmessage = (
        message: MessageEvent<IArc0013ResponseMessageSchema<Result>>
      ) => {
        // if the response's request id does not match the intended request, just ignore
        if (message.data.requestId !== requestId) {
          return;
        }

        // clear the timer, we can handle it from here
        window.clearTimeout(timer);

        // if there is an error, reject
        if (message.data.error) {
          return reject(message.data.error);
        }

        // return the result
        resolve(message.data.result);

        // close the channel, we are done here
        channel.close();
      };

      timer = window.setTimeout(() => {
        // close the channel connection
        channel.close();

        reject(
          new SerializableArc0013MethodTimedOutError(
            method,
            `no response from provider "${__PROVIDER_ID__}"`
          )
        );
      }, timeout || ARC_0013_DEFAULT_REQUEST_TIMEOUT);

      // broadcast the request
      channel.postMessage({
        id: requestId,
        params,
        reference,
      } as IArc0013RequestMessageSchema<Params>);
    });
  }

  /**
   * private functions
   */

  private async enable(): Promise<IArc0013Account[]> {
    const _functionName: string = '_functionName';
    const method: Arc0013ProviderMethodEnum = Arc0013ProviderMethodEnum.Enable;
    let result: IArc0013EnableResult | null;

    this.logger.debug(
      `${CustomUseWalletProvider.name}#${_functionName}(): check if "${method}" is supported on "${this.genesisHash}"`
    );

    // check the method is supported
    this.validateMethod(method);

    if (!this.genesisHash) {
      throw new SerializableArc0013UnknownError(
        `no genesis hash set`,
        __PROVIDER_ID__
      );
    }

    result =
      (await CustomUseWalletProvider.sendRequestWithTimeout<
        IArc0013EnableParams,
        IArc0013EnableResult
      >({
        method,
        params: {
          genesisHash: this.genesisHash,
          providerId: __PROVIDER_ID__,
        },
        reference: Arc0013MessageReferenceEnum.EnableRequest,
      })) || null;

    // check for a result
    if (!result) {
      throw new SerializableArc0013UnknownError(
        `received response, but "${method}" request details were empty`,
        __PROVIDER_ID__
      );
    }

    return result.accounts;
  }

  private async getAccountInformation(
    address: string
  ): Promise<IAlgorandAccountInformation | null> {
    if (!this.algod) {
      return null;
    }

    return await algorandAccountInformationWithDelay({
      address,
      client: this.algod,
      delay: 0,
    });
  }

  private async refreshSupportedMethods(): Promise<void> {
    const _functionName: string = 'signTxns';
    const method: Arc0013ProviderMethodEnum =
      Arc0013ProviderMethodEnum.GetProviders;
    let networkConfiguration: IArc0013NetworkConfiguration | null;
    let result: IArc0013GetProvidersResult | null;

    this.logger.debug(
      `${CustomUseWalletProvider.name}#${_functionName}(): refreshing supported methods`
    );

    if (!this.genesisHash) {
      throw new SerializableArc0013UnknownError(
        `no genesis hash set`,
        __PROVIDER_ID__
      );
    }

    result =
      (await CustomUseWalletProvider.sendRequestWithTimeout<
        IArc0013GetProvidersParams,
        IArc0013GetProvidersResult
      >({
        method,
        params: {
          providerId: __PROVIDER_ID__,
        },
        reference: Arc0013MessageReferenceEnum.GetProvidersRequest,
        timeout: ARC_0013_LOWER_REQUEST_TIMEOUT,
      })) || null;

    // check for a result
    if (!result) {
      throw new SerializableArc0013UnknownError(
        `received response, but "${method}" request details were empty`,
        __PROVIDER_ID__
      );
    }

    networkConfiguration =
      result.networks.find((value) => value.genesisHash === this.genesisHash) ||
      null;

    // check if the network is supported
    if (!networkConfiguration) {
      throw new SerializableArc0013NetworkNotSupportedError(
        this.genesisHash,
        __PROVIDER_ID__
      );
    }

    this.logger.debug(
      `${CustomUseWalletProvider.name}#${
        this.refreshSupportedMethods.name
      }(): methods [${networkConfiguration.methods.join(',')}] found for "${
        networkConfiguration.genesisId
      }"`
    );

    // update the methods
    this.methods = networkConfiguration.methods;
  }

  private async signTxns(txns: IArc0013SignTxns[]): Promise<(string | null)[]> {
    const _functionName: string = 'signTxns';
    const method: Arc0013ProviderMethodEnum =
      Arc0013ProviderMethodEnum.SignTxns;
    let result: IArc0013SignTxnsResult | null;

    this.logger.debug(
      `${CustomUseWalletProvider.name}#${_functionName}(): check if "${method}" is supported on "${this.genesisHash}"`
    );

    // check the method is supported
    this.validateMethod(method);

    if (!this.genesisHash) {
      throw new SerializableArc0013UnknownError(
        `no genesis hash set`,
        __PROVIDER_ID__
      );
    }

    result =
      (await CustomUseWalletProvider.sendRequestWithTimeout<
        IArc0013SignTxnsParams,
        IArc0013SignTxnsResult
      >({
        method,
        params: {
          genesisHash: this.genesisHash,
          providerId: __PROVIDER_ID__,
          txns,
        },
        reference: Arc0013MessageReferenceEnum.SignTxnsRequest,
      })) || null;

    // check for a result
    if (!result) {
      throw new SerializableArc0013UnknownError(
        `received response, but "${method}" request details were empty`,
        __PROVIDER_ID__
      );
    }

    return result.stxns;
  }

  private validateMethod(method: Arc0013ProviderMethodEnum): void {
    if (!this.methods.includes(method)) {
      throw new SerializableArc0013MethodNotSupportedError(
        method,
        __PROVIDER_ID__
      );
    }
  }

  /**
   * public functions
   */

  public async connect(metadata: Metadata): Promise<Wallet> {
    let accounts: IArc0013Account[];

    await this.refreshSupportedMethods(); // refresh the supported methods

    accounts = await this.enable();

    return {
      ...metadata,
      accounts: accounts.map(({ address, name }) => ({
        address,
        name,
        providerId: PROVIDER_ID.CUSTOM,
      })),
    };
  }

  public async disconnect(): Promise<void> {
    return;
  }

  public async reconnect(metadata: Metadata): Promise<Wallet | null> {
    return await this.connect(metadata);
  }

  public setGenesisHash(genesisHash: string): void {
    const _functionName: string = 'setGenesisHash';
    const network: INetwork | null =
      networks.find((value) => value.genesisHash === genesisHash) || null;

    if (!network) {
      this.logger.debug(
        `${CustomUseWalletProvider.name}#${_functionName}(): unknown network for ${genesisHash}`
      );

      return;
    }

    this.genesisHash = genesisHash;

    if (network.algods[0]) {
      this.algod = new Algodv2(
        '',
        network.algods[0].url,
        network.algods[0].port
      );
    }
  }

  public async signTransactions(
    connectedAccounts: string[],
    transactions: Uint8Array[],
    indexesToSign?: number[] | undefined,
    returnGroup?: boolean | undefined
  ): Promise<Uint8Array[]> {
    let result: (string | null)[];
    let txns: IArc0013SignTxns[];

    await this.refreshSupportedMethods(); // refresh the supported methods

    txns = await Promise.all(
      transactions.map<Promise<IArc0013SignTxns>>(async (value, index) => {
        const decodedTxn: DecodedTransaction | DecodedSignedTransaction =
          decodeObj(value) as DecodedTransaction | DecodedSignedTransaction;
        const isSigned: boolean = !!(decodedTxn as DecodedSignedTransaction)
          .txn;
        const sender: string = encodeAddress(
          isSigned
            ? (decodedTxn as DecodedSignedTransaction).txn.snd
            : (decodedTxn as DecodedTransaction).snd
        );
        const accountInformation: IAlgorandAccountInformation | null =
          await this.getAccountInformation(sender);
        let authAddr: string | null = null;

        if (accountInformation) {
          authAddr = accountInformation['auth-addr'] || null;
        }

        // if the transaction is signed, instruct the provider not to sign
        if (isSigned) {
          return {
            txn: encodeBase64(decodeSignedTransaction(value).txn.toByte()),
            signers: [],
          };
        }

        // if the transaction has been instructed to sign and the sender is authorized to sign, instruct the provider to sign
        if (
          indexesToSign &&
          indexesToSign.includes(index) &&
          connectedAccounts.includes(sender)
        ) {
          return {
            txn: encodeBase64(decodeUnsignedTransaction(value).toByte()),
            ...(authAddr && { authAddr }),
          };
        }

        // if the transaction is not signed, not instructed to sign or the sender is not authorized, instruct the provider not to sign
        return {
          txn: encodeBase64(decodeUnsignedTransaction(value).toByte()),
          signers: [],
        };
      })
    );
    result = await this.signTxns(txns);

    // null values indicate transactions that were not signed by the provider, as defined in ARC-0001, see https://arc.algorand.foundation/ARCs/arc-0001#semantic-and-security-requirements
    return result.reduce<Uint8Array[]>((acc, value, index) => {
      if (value) {
        return [...acc, decodeBase64(value)];
      }

      // if the group wants to be returned, get the transaction from the input
      return returnGroup ? [...acc, transactions[index]] : acc;
    }, []);
  }
}
