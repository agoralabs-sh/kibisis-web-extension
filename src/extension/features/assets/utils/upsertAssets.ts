// Types
import { IAsset } from '@extension/types';

/**
 * Updates the assets, if any exist, otherwise it adds the assets and returns the updated assets list. This
 * function uses the id as the index.
 * @param {IAsset[]} assets - a list of assets.
 * @param {IAsset[]} upsertAssets - the assets to add or update.
 * @returns {IAsset[]} a new assets list with the assets updated or added.
 */
export default function upsertAssets(
  assets: IAsset[],
  upsertAssets: IAsset[]
): IAsset[] {
  const assetsToAdd: IAsset[] = upsertAssets.filter(
    (asset) => !assets.some((value) => value.id === asset.id)
  );
  const updatedAssets: IAsset[] = assets.map(
    (asset) => upsertAssets.find((value) => value.id === asset.id) || asset
  ); // update the sessions

  return [...updatedAssets, ...assetsToAdd];
}
