// types
import { IArc200Asset } from '@extension/types';

/**
 * @property {boolean} fetching - true when ARC200 assets are being fetched from storage.
 * @property {Record<string, IArc200Asset[]> | null} items - the ARC200 assets for each network, indexed by the
 * hex encoded genesis hash.
 * @property {boolean} saving - true when an asset is being saved to storage.
 * @property {boolean} updating - true when remote ARC200 asset information is being updated.
 */
interface IArc200AssetsState {
  fetching: boolean;
  items: Record<string, IArc200Asset[]> | null;
  saving: boolean;
  updating: boolean;
}

export default IArc200AssetsState;
