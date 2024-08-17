/**
 * @property {string | null} preferredBlockExplorerIds - the preferred block explorer for each network.
 * @property {string | null} preferredNFTExplorerIds - the preferred NFT explorers for each network.
 * @property {string | null} selectedCustomNetworkId - the selected custom network by its ID. If this is null, use the
 * default algod/indexers.
 * @property {string | null} selectedNetworkGenesisHash - the selected network genesis hash.
 */
interface IGeneralSettings {
  preferredBlockExplorerIds: Record<string, string | null>;
  preferredNFTExplorerIds: Record<string, string | null>;
  selectedCustomNetworkId: string | null;
  selectedNetworkGenesisHash: string | null;
}

export default IGeneralSettings;
