interface INFTExplorer {
  baseURL: string;
  canonicalName: string;
  collectionPath: (appId: string) => string;
  id: string;
  tokenPath: (appId: string, tokenId: string) => string;
}

export default INFTExplorer;
