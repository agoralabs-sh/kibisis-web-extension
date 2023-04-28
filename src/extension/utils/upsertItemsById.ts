interface IItem {
  id: string;
}

/**
 * Updates the items, if any exist, otherwise it adds the items and returns the updated items list. This function uses
 * the id as the index.
 * @param {T[]} items - a list of items.
 * @param {T[]} upsertItems - the items to add or update.
 * @returns {T[]} a new items list with the items updated or added.
 */
export default function upsertItemsById<T extends IItem>(
  items: T[],
  upsertItems: T[]
): T[] {
  const itemsToAdd: T[] = upsertItems.filter(
    (item) => !items.some((value) => value.id === item.id)
  );
  const updatedItems: T[] = items.map(
    (item) => upsertItems.find((value) => value.id === item.id) || item
  ); // update the sessions

  return [...updatedItems, ...itemsToAdd];
}
