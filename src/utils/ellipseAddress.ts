/**
 * Options to tailor the start and end lengths
 * @property {number} end - [optional] the length of characters to show at the end.
 * @property {number} start - [optional] the length of characters to show at the beginning.
 */
interface IOptions {
  end?: number;
  start?: number;
}

/**
 * Utility function to use an ellipsis in the middle of an address. E.g
 * @param {string} address - the address to ellipse.
 * @param {IOptions} options - [optional] options to customise.
 * @returns {string} an ellipsed address.
 */
export default function ellipseAddress(
  address: string,
  options?: IOptions
): string {
  const defaultLength: number = 5;
  const start: number =
    options && options.start ? options.start : defaultLength;
  const end: number = options && options.end ? options.end : defaultLength;

  return `${address.slice(0, start)}...${address.slice(-end)}`;
}
