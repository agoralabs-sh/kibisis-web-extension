interface INFTIndexer {
  baseUrl: string;
  canonicalName: string;
  createOwnerHoldingsURL: (address: string) => string;
  id: string;
}

export default INFTIndexer;
