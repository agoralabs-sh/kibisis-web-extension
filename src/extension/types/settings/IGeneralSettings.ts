interface IGeneralSettings {
  preferredBlockExplorerIds: Record<string, string | null>;
  preferredNFTExplorerIds: Record<string, string | null>;
  selectedNetworkGenesisHash: string | null;
}

export default IGeneralSettings;
