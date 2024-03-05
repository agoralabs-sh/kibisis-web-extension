/**
 * Convenience function that randomly picks an item from a list.
 * @param {Item[]} list - a list of items.
 * @returns {Item} a random item from the list.
 */
export default function getRandomItem<Item>(list: Item[]): Item {
  return list[Math.floor(Math.random() * list.length)];
}
