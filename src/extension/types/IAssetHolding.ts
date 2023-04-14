/**
 * @property {string} amount - the amount of the asset.
 * @property {string} id - the asset ID.
 * @property {boolean} isFrozen - whether this asset is frozen.
 */
interface IAssetHolding {
  amount: string;
  id: string;
  isFrozen: boolean;
}

export default IAssetHolding;
