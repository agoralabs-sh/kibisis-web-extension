// enums
import { AssetTypeEnum } from '@extension/enums';

// types
import type { IARC0200Asset, IARC0200AssetHolding } from '@extension/types';

/**
 * Convenience function that simply maps an ARC-0200 asset to an ARC-0200 asset holding with the default 0 amount.
 * @param {IARC0200Asset} asset - the asset to of the asset holding.
 * @returns {IARC0200AssetHolding} the initialized asset holding for the supplied ARC-0200 asset.
 */
export default function initializeARC0200AssetHoldingFromARC0200Asset({
  id,
}: IARC0200Asset): IARC0200AssetHolding {
  return {
    amount: '0',
    id,
    type: AssetTypeEnum.ARC0200,
  };
}
