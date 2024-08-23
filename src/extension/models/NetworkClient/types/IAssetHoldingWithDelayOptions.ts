interface IAssetHoldingWithDelayOptions {
  address: string;
  assetID: string;
  delay?: number;
  nodeID: string | null;
}

export default IAssetHoldingWithDelayOptions;
