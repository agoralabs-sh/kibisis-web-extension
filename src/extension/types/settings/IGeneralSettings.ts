/**
 * @property {Record<string, string | null>} preferredBlockExplorerIds - the preferred block explorer for each network.
 * @property {Record<string, string | null>} preferredNFTExplorerIds - the preferred NFT explorers for each network.
 * @property {string | null} selectedNetworkGenesisHash - the selected network genesis hash.
 * @property {Record<string, string | null>} selectedNodeIDs - the selected node IDs for each network.
 */
interface IGeneralSettings {
  preferredBlockExplorerIds: Record<string, string | null>;
  preferredNFTExplorerIds: Record<string, string | null>;
  selectedNetworkGenesisHash: string | null;
  selectedNodeIDs: Record<string, string | null>;
}

export default IGeneralSettings;
