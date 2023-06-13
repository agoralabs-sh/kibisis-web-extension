interface IAlgorandAssetFreezeTransaction {
  address: string;
  ['asset-id']: bigint;
  ['new-freeze-status']: boolean;
}

export default IAlgorandAssetFreezeTransaction;
