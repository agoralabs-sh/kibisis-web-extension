/**
 * @property {string} amount - the amount of the standard asset.
 * @property {string} id - the standard asset ID.
 * @property {boolean} isFrozen - whether this standard asset is frozen.
 */
interface IStandardAssetHolding {
  amount: string;
  id: string;
  isFrozen: boolean;
}

export default IStandardAssetHolding;
