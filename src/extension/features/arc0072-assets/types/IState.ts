// types
import type { IARC0072Asset } from '@extension/types';

/**
 * @property {boolean} fetching - true when ARC-0072 assets are being fetched from storage.
 * @property {Record<string, IARC0072Asset[]> | null} items - the ARC-0072 assets for each network, indexed by the
 * hex encoded genesis hash.
 * @property {boolean} saving - true when an asset is being saved to storage.
 * @property {boolean} updating - true when remote ARC-0072 asset information is being updated.
 */
interface IState {
  fetching: boolean;
  items: Record<string, IARC0072Asset[]> | null;
  saving: boolean;
  updating: boolean;
}

export default IState;
