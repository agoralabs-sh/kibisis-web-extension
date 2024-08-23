// types
import type { ICustomNode, INetwork } from '@extension/types';

/**
 * Filters out the custom algod and indexer nodes and merges them based on their ID. Custom nodes are defined as any
 * node that contains an ID.
 * @param {INetwork} network - the network to filter.
 * @returns {ICustomNode[]} a filtered list of custom nodes.
 */
export default function filterCustomNodesFromNetwork(
  network: INetwork
): ICustomNode[] {
  const customNodes = network.algods.reduce<ICustomNode[]>(
    (acc, value) =>
      value.id
        ? [
            ...acc,
            {
              algod: {
                port: value.port,
                token: value.token,
                url: value.url,
              },
              genesisHash: network.genesisHash,
              id: value.id,
              indexer: null,
              name: value.canonicalName,
            },
          ]
        : acc,
    []
  );

  network.indexers.forEach((value) => {
    let index: number;

    if (!value.id) {
      return;
    }

    index = customNodes.findIndex((_value) => _value.id === value.id);

    // if no custom nodes already exist, add a new one
    if (index < 0) {
      return customNodes.push({
        algod: null,
        genesisHash: network.genesisHash,
        id: value.id,
        indexer: {
          port: value.port,
          token: value.token,
          url: value.url,
        },
        name: value.canonicalName,
      });
    }

    // otherwise update the node's indexer
    customNodes[index] = {
      ...customNodes[index],
      indexer: {
        port: value.port,
        token: value.token,
        url: value.url,
      },
    };

    return;
  });

  return customNodes;
}
