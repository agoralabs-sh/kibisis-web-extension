// types
import type { IARC0200Asset } from '@extension/types';

/**
 * @property {boolean} fetching - true when ARC200 assets are being fetched from storage.
 * @property {Record<string, IARC0200Asset[]> | null} items - the ARC200 assets for each network, indexed by the
 * hex encoded genesis hash.
 * @property {boolean} saving - true when an asset is being saved to storage.
 * @property {boolean} updating - true when remote ARC200 asset information is being updated.
 */
interface IARC0200AssetsState {
  fetching: boolean;
  items: Record<string, IARC0200Asset[]> | null;
  saving: boolean;
  updating: boolean;
}

export default IARC0200AssetsState;
