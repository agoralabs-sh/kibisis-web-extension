import { IAsset, INetwork } from '@extension/types';

/**
 * Creates a "dummy" asset for the native currency of the supplied network. The native "dummy" assets will always have
 * an ID of '0' as all other assets will have an ID > 0.
 * @param {INetwork} network - the network to create the native "dummy" asset from.
 * @returns {IAsset} a "dummy" asset with an ID of '0'.
 */
export default function createNativeCurrencyAsset(network: INetwork): IAsset {
  return {
    clawbackAddress: null,
    creator: network.feeSunkAddress, // null address
    decimals: network.nativeCurrency.decimals,
    defaultFrozen: false,
    deleted: false,
    freezeAddress: null,
    iconUrl: network.nativeCurrency.listingUri,
    id: '0',
    managerAddress: null,
    metadataHash: null,
    name: null,
    nameBase64: null,
    reserveAddress: null,
    total: Number.POSITIVE_INFINITY.toString(),
    unitName: network.nativeCurrency.code.toString(),
    unitNameBase64: null,
    url: null,
    urlBase64: null,
    verified: true, // always verified
  };
}
