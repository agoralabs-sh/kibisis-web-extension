/**
 * Updates the items, if any exist, otherwise it adds the items and returns the updated items list. This function uses
 * the id as the index.
 * @param {T extends Record<'id', string>[]} items - a list of items.
 * @param {T extends Record<'id', string>[]} upsertItems - the items to add or update.
 * @returns {T extends Record<'id', string>[]} a new items list with the items updated or added.
 */
export default function upsertItemsById<Type extends Record<'id', string>>(
  items: Type[],
  upsertItems: Type[]
): Type[] {
  const itemsToAdd = upsertItems.filter(
    (item) => !items.some((value) => value.id === item.id)
  );
  const updatedItems = items.map(
    (item) => upsertItems.find((value) => value.id === item.id) || item
  );

  return [...updatedItems, ...itemsToAdd];
}
