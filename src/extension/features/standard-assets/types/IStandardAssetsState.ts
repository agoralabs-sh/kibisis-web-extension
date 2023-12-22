// types
import { IStandardAsset } from '@extension/types';

/**
 * @property {boolean} fetching - true when assets are being fetched from storage.
 * @property {Record<string, IStandardAsset[]> | null} items - the standard assets for each network, indexed by the
 * hex encoded genesis hash.
 * @property {boolean} saving - true when an asset is being saved to storage.
 * @property {boolean} updating - true when remote asset information is being updated.
 */
interface IStandardAssetsState {
  fetching: boolean;
  items: Record<string, IStandardAsset[]> | null;
  saving: boolean;
  updating: boolean;
}

export default IStandardAssetsState;
