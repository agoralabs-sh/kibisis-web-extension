/**
 * @property {string | null} clawbackAddress - the address of the account used to clawback holdings of this asset.
 * @property {string} creator - the address of the account that created this asset.
 * @property {number} decimals - the number of digits to use after the decimal point when displaying this asset.
 * @property {boolean} defaultFrozen - whether holdings of this asset are frozen by default.
 * @property {boolean} deleted - whether this asset is deleted or not.
 * @property {string | null} freezeAddress - the address of the account that can freeze this asset.
 * @property {string} id - the ID of this asset.
 * @property {string | null} iconUrl - the URL of the asset icon.
 * @property {string | null} managerAddress - the address of the account that can manage the keys of this asset and to
 * destroy it.
 * @property {string | null} metadataHash - a hash of the metadata for this asset. Usually base64 encoded.
 * @property {string | null} name - the utf-8 name of the asset.
 * @property {string | null} nameBase64 - the base64 encoded name of this asset.
 * @property {string | null} reserveAddress - the address of the account holding reserve (non-minted) units of this
 * asset.
 * @property {string} total - the total number of units of this asset.
 * @property {string | null} unitName - the utf-8 name of a unit of this asset.
 * @property {string | null} unitNameBase64 - the base64 encoded name of a unit of this asset.
 * @property {string | null} url  - the URL where more information about the asset can be retrieved.
 * @property {string | null} urlBase64  - the base64 encoded URL where more information about the asset can be
 * retrieved.
 * @property {boolean} verified - whether this asset is verified according to vestige.fi
 */
interface IAsset {
  clawbackAddress: string | null;
  creator: string;
  decimals: number;
  defaultFrozen: boolean;
  deleted: boolean;
  freezeAddress: string | null;
  iconUrl: string | null;
  id: string;
  managerAddress: string | null;
  metadataHash: string | null;
  name: string | null;
  nameBase64: string | null;
  reserveAddress: string | null;
  total: string;
  unitName: string | null;
  unitNameBase64: string | null;
  url: string | null;
  urlBase64: string | null;
  verified: boolean;
}

export default IAsset;
