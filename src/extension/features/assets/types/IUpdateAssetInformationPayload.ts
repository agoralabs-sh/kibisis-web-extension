/**
 * @property {string} genesisHash - the genesis hash of the network.
 * @property {string[]} ids - the ID of the assets to fetch informtaion for.
 */
interface IUpdateAssetInformationPayload {
  genesisHash: string;
  ids: string[];
}

export default IUpdateAssetInformationPayload;
