// types
import { IAsset } from '@extension/types';

/**
 * @property {boolean} fetching - true when assets are being fetched from storage.
 * @property {Record<string, IAsset[]> | null} items - the standard assets for each network, indexed by the
 * hex encoded genesis hash.
 * @property {boolean} saving - true when an asset is being saved to storage.
 * @property {boolean} updating - true when remote asset information is being updated.
 */
interface IStandardAssetsState {
  fetching: boolean;
  items: Record<string, IAsset[]> | null;
  saving: boolean;
  updating: boolean;
}

export default IStandardAssetsState;
