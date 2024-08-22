import {
  Algodv2,
  Indexer,
  IntDecoding,
  type SuggestedParams,
  waitForConfirmation,
} from 'algosdk';
import BigNumber from 'bignumber.js';

// constants
import { TRANSACTION_CONFIRMATION_ROUNDS } from '@extension/constants';

// contracts
import ARC0072Contract from '@extension/contracts/ARC0072Contract';
import ARC0200Contract from '@extension/contracts/ARC0200Contract';

// enums
import { AssetTypeEnum, ErrorCodeEnum } from '@extension/enums';

// models
import BaseARC0072Indexer from '@extension/models/BaseARC0072Indexer';

// types
import type { ILogger } from '@common/types';
import type {
  IAlgorandAccountInformation,
  IAlgorandAccountTransaction,
  IAlgorandAsset,
  IAlgorandPendingTransactionResponse,
  IAlgorandSearchApplicationsResult,
  IAlgorandSearchAssetsResult,
  IAlgorandTransactionParams,
  IARC0072AssetHolding,
  IARC0072AssetInformation,
  IARC0200AssetHolding,
  IARC0200AssetInformation,
  INetwork,
  INode,
} from '@extension/types';
import {
  IByAddressWithDelayOptions,
  IAssetHoldingWithDelayOptions,
  IByIDWithDelayOptions,
  ILookupAccountTransactionWithDelayOptions,
  INewOptions,
  ISearchStandardAssetsWithDelayOptions,
  ISendRequestWithDelayOptions,
  ISendTransactionOptions,
  ISearchApplicationsWithDelayOptions,
} from './types';

// utils
import getRandomItem from '@common/utils/getRandomItem';

export default class NetworkClient {
  // public variables
  private readonly _logger: ILogger | undefined;
  private _network: INetwork;

  constructor({ logger, network }: INewOptions) {
    this._logger = logger;
    this._network = network;
  }

  /**
   * private functions
   */

  private async _sendRequestWithDelay<Result>({
    delay = 0,
    request,
  }: ISendRequestWithDelayOptions<Result>): Promise<Result> {
    return new Promise((resolve, reject) => {
      window.setTimeout(async () => {
        try {
          resolve(await request());
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  }

  /**
   * public functions
   */

  public async accountInformationWIthDelay({
    address,
    delay,
    nodeID,
  }: IByAddressWithDelayOptions): Promise<IAlgorandAccountInformation> {
    const algod = this.algodByID(nodeID);

    return await this._sendRequestWithDelay({
      delay,
      request: async () =>
        (await algod
          .accountInformation(address)
          .setIntDecoding(IntDecoding.BIGINT)
          .do()) as IAlgorandAccountInformation,
    });
  }

  /**
   * Gets an algod client by its ID. If the ID is null, a random default algod (algods where the ID is null).
   * @param {string | null} id - the ID of the algod.
   * @returns {Algodv2} an initialized algod client.
   */
  public algodByID(id: string | null): Algodv2 {
    const node = this.algodNodeByID(id);

    return new Algodv2(node.token || '', node.url, node.port || '');
  }

  /**
   * Gets an algod node by its ID. If the ID is null, a random default algod node (algods where the ID is null).
   * @param {string | null} id - the ID of the algod.
   * @returns {INode} the algod node by the id or a random default one.
   */
  public algodNodeByID(id: string | null): INode {
    let node: INode | null = null;

    if (id) {
      node = this._network.algods.find((value) => value.id === id) || null;
    }

    if (!node) {
      node = getRandomItem(this._network.algods);
    }

    return node;
  }

  public async arc0072AssetHoldingsWithDelay({
    address,
    delay,
  }: IByAddressWithDelayOptions): Promise<IARC0072AssetHolding[]> {
    const _functionName = 'arc0072AssetHoldingsWithDelay';
    const arc0072Indexer =
      getRandomItem<BaseARC0072Indexer>(this._network.arc0072Indexers) || null;

    if (!arc0072Indexer) {
      this._logger?.debug(
        `${NetworkClient.name}#${_functionName}: no arc-0072 indexers found for network "${this._network.genesisId}"`
      );

      return [];
    }

    return await this._sendRequestWithDelay({
      delay,
      request: async () => {
        return await arc0072Indexer.fetchTokensByOwner({
          address,
          logger: this._logger,
        });
      },
    });
  }

  public async arc0200AssetHoldingWithDelay({
    address,
    assetID,
    delay,
    nodeID,
  }: IAssetHoldingWithDelayOptions): Promise<IARC0200AssetHolding> {
    const algod = this.algodByID(nodeID);

    return await this._sendRequestWithDelay({
      delay,
      request: async () => {
        const contract: ARC0200Contract = new ARC0200Contract({
          appId: assetID,
          algod,
          feeSinkAddress: this._network.feeSunkAddress,
        });
        const result = await contract.balanceOf(address);

        return {
          id: assetID,
          amount: result.toString(),
          type: AssetTypeEnum.ARC0200,
        };
      },
    });
  }

  /**
   * Fetches ARC-0072 asset information from the node with a delay.
   * @param {IByIDWithDelayOptions} options - options needed to send the request.
   * @returns {Promise<IARC0072AssetInformation | null>} a promise that resolves to the ARC-0072 asset information or
   * null if the asset is not an ARC-0072 asset.
   */
  public async arc0072AssetInformationWithDelay({
    delay,
    id,
    nodeID,
  }: IByIDWithDelayOptions): Promise<IARC0072AssetInformation | null> {
    const algod = this.algodByID(nodeID);

    return await this._sendRequestWithDelay({
      delay,
      request: async () => {
        const contract = new ARC0072Contract({
          appId: id,
          algod,
          feeSinkAddress: this._network.feeSunkAddress,
        });
        let totalSupply: BigNumber;

        try {
          totalSupply = await contract.totalSupply();

          return {
            totalSupply: BigInt(totalSupply.toString()),
          };
        } catch (error) {
          switch (error.code) {
            case ErrorCodeEnum.InvalidABIContractError:
              return null;
            default:
              break;
          }

          throw error;
        }
      },
    });
  }

  /**
   * Fetches ARC-0200 asset information from a node with a delay.
   * @param {IByIDWithDelayOptions} options - options needed to send the request.
   * @returns {Promise<IARC0200AssetInformation | null>} a promise that resolves to the ARC-0200 asset information or
   * null if the asset is not an ARC-0200 asset.
   */
  public async arc0200AssetInformationWithDelay({
    delay,
    id,
    nodeID,
  }: IByIDWithDelayOptions): Promise<IARC0200AssetInformation | null> {
    const algod = this.algodByID(nodeID);

    return await this._sendRequestWithDelay({
      delay,
      request: async () => {
        const contract = new ARC0200Contract({
          appId: id,
          algod,
          feeSinkAddress: this._network.feeSunkAddress,
        });

        try {
          return await contract.metadata();
        } catch (error) {
          switch (error.code) {
            case ErrorCodeEnum.InvalidABIContractError:
              return null;
            default:
              break;
          }

          throw error;
        }
      },
    });
  }

  /**
   * Gets the fee sink address for the network.
   * @returns {string} the fee sink address for the network.
   */
  public feeSinkAddress(): string {
    return this._network.feeSunkAddress;
  }

  /**
   * Gets an indexer client by its ID. If the ID is null, a random default indexer (indexer where the ID is null).
   * @param {string | null} id - the ID of the indexer.
   * @returns {Indexer} an initialized indexer client.
   */
  public indexerByID(id: string | null): Indexer {
    const node = this.indexerNodeByID(id);

    return new Indexer(node.token || '', node.url, node.port || '');
  }

  /**
   * Gets an indexer node by its ID. If the ID is null, a random default indexer node (indexers where the ID is null).
   * @param {string | null} id - the ID of the indexer.
   * @returns {INode} the indexer node by the id or a random default one.
   */
  public indexerNodeByID(id: string | null): INode {
    let node: INode | null = null;

    if (id) {
      node = this._network.indexers.find((value) => value.id === id) || null;
    }

    if (!node) {
      node = getRandomItem(this._network.indexers);
    }

    return node;
  }

  public async lookupAccountTransactionWithDelay({
    address,
    afterTime,
    delay,
    limit,
    next,
    nodeID,
  }: ILookupAccountTransactionWithDelayOptions): Promise<IAlgorandAccountTransaction> {
    const indexer = this.indexerByID(nodeID);

    return await this._sendRequestWithDelay({
      delay,
      request: async () => {
        const requestBuilder = indexer
          .lookupAccountTransactions(address)
          .limit(limit);

        if (afterTime) {
          requestBuilder.afterTime(new Date(afterTime).toISOString());
        }

        if (next) {
          requestBuilder.nextToken(next);
        }

        return (await requestBuilder
          .setIntDecoding(IntDecoding.BIGINT)
          .do()) as IAlgorandAccountTransaction;
      },
    });
  }

  /**
   * Searches for applications by the application ID from the node with a delay.
   * @param {IOptions} options - options needed to send the request.
   * @returns {Promise<IAlgorandSearchApplicationsResult>} a promise that resolves to the applications via the
   * application ID.
   */
  public async searchApplicationsWithDelay({
    applicationId,
    delay,
    limit,
    next,
    nodeID,
  }: ISearchApplicationsWithDelayOptions): Promise<IAlgorandSearchApplicationsResult> {
    const indexer = this.indexerByID(nodeID);

    return await this._sendRequestWithDelay({
      delay,
      request: async () => {
        const requestBuilder = indexer
          .searchForApplications()
          .index(parseInt(applicationId))
          .limit(limit);

        if (next) {
          requestBuilder.nextToken(next);
        }

        return (await requestBuilder
          .setIntDecoding(IntDecoding.BIGINT)
          .do()) as IAlgorandSearchApplicationsResult;
      },
    });
  }

  /**
   * Searches for standard assets by the asset index, name or unit from the node with a delay.
   * @param {IOptions} options - options needed to send the request.
   * @returns {Promise<IAlgorandSearchAssetsResult>} a promise that resolves to the standard assets by the supplied
   * parameters.
   */
  public async searchStandardAssetsWithDelay({
    assetId,
    delay,
    limit,
    name,
    next,
    nodeID,
    unit,
  }: ISearchStandardAssetsWithDelayOptions): Promise<IAlgorandSearchAssetsResult> {
    let indexer: Indexer;

    if (!assetId && !unit && !name) {
      return {
        assets: [],
        ['current-round']: BigInt(0),
      };
    }

    indexer = this.indexerByID(nodeID);

    return await this._sendRequestWithDelay({
      delay,
      request: async () => {
        const requestBuilder = indexer.searchForAssets().limit(limit);

        if (assetId) {
          requestBuilder.index(parseInt(assetId));
        }

        if (name) {
          requestBuilder.name(name);
        }

        if (next) {
          requestBuilder.nextToken(next);
        }

        if (unit) {
          requestBuilder.unit(unit);
        }

        return (await requestBuilder
          .setIntDecoding(IntDecoding.BIGINT)
          .do()) as IAlgorandSearchAssetsResult;
      },
    });
  }

  /**
   * Sends signed transactions to the network.
   * @param {IOptions} options - the signed transactions and an optional node ID.
   * @returns {Promise<string>} a promise that resolves to the round the transactions were confirmed in.
   */
  public async sendTransactions({
    nodeID,
    signedTransactions,
  }: ISendTransactionOptions): Promise<string> {
    const _functionName = 'sendTransactions';
    const algod = this.algodByID(nodeID);
    let sentRawTransaction: { txId: string };
    let transactionsResponse: IAlgorandPendingTransactionResponse;

    this._logger?.debug(
      `${_functionName}: sending transactions to the network "${this._network.genesisId}"`
    );

    sentRawTransaction = await algod
      .sendRawTransaction(signedTransactions)
      .setIntDecoding(IntDecoding.BIGINT)
      .do();

    this._logger?.debug(
      `${NetworkClient.name}#${_functionName}: transaction "${sentRawTransaction.txId}" sent to the network "${this._network.genesisId}", confirming`
    );

    transactionsResponse = (await waitForConfirmation(
      algod,
      sentRawTransaction.txId,
      TRANSACTION_CONFIRMATION_ROUNDS
    )) as IAlgorandPendingTransactionResponse;

    this._logger?.debug(
      `${NetworkClient.name}#${_functionName}: transaction "${sentRawTransaction.txId}" confirmed in round "${transactionsResponse['confirmed-round']}"`
    );

    return String(transactionsResponse['confirmed-round']);
  }

  public setNetwork(network: INetwork): void {
    this._network = network;
  }

  public async standardAssetInformationByIDWithDelay({
    delay,
    id,
    nodeID,
  }: IByIDWithDelayOptions): Promise<IAlgorandAsset> {
    const algod = this.algodByID(nodeID);

    return await this._sendRequestWithDelay({
      delay,
      request: async () =>
        (await algod
          .getAssetByID(parseInt(id))
          .setIntDecoding(IntDecoding.BIGINT)
          .do()) as IAlgorandAsset,
    });
  }

  public async suggestedParams(
    nodeID: string | null
  ): Promise<SuggestedParams> {
    const algod = this.algodByID(nodeID);

    return await algod.getTransactionParams().do();
  }

  /**
   * Fetches the transaction params for the given network.
   * @param {string | null} nodeID - an optional node ID to choose.
   * @returns {Promise<IAlgorandTransactionParams>} a promise that resolves to the transaction params.
   */
  public async transactionParams(
    nodeID: string | null
  ): Promise<IAlgorandTransactionParams> {
    const algodNode = this.algodNodeByID(nodeID);
    let response: Response;

    // use rest api as the
    response = await fetch(
      new URL(
        `${
          algodNode.port ? `${algodNode.url}:${algodNode.port}` : algodNode.url
        }`
      ),
      {
        ...(algodNode.token && {
          headers: {
            ['X-Algo-API-Token']: algodNode.token,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return await response.json();
  }
}
