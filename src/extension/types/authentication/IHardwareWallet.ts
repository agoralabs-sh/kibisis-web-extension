/**
 * @property {number} accountIndex - The account "index" for the coin type on the derivation path, e.g.
 * "44'/XX'/<account>'/0/X".
 * @property {string} coinType - The type of coin in the derivation path, e.g. "44'/<coinType>'/0'/0/X".
 * @property {number} createdAt - The time in milliseconds since the UNIX epoch for when the resource was created.
 * @property {string} id - A unique v4 UUID compliant string.
 * @property {number} index - The index of the account on the derivation path, e.g. "44'/XX'/XX'/0/<index>".
 * @property {string} publicKey - the hexadecimal encoded public key.
 */
interface IHardwareWallet {
  accountIndex: number;
  coinType: number;
  createdAt: number;
  id: string;
  index: number;
  publicKey: string;
}

export default IHardwareWallet;
