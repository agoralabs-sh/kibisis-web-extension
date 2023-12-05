interface IGeneralSettings {
  preferredBlockExplorerIds: Record<string, string | null>;
  selectedNetworkGenesisHash: string | null;
}

export default IGeneralSettings;
