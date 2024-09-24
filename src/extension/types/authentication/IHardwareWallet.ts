/**
 * @property {number} accountIndex - The account "index" for the coin type on the derivation path, e.g.
 * "44'/XX'/<account>'/0/X".
 * @property {string} coinType - The type of coin in the derivation path, e.g. "44'/<coinType>'/0'/0/X".
 * @property {number} index - The index of the account on the derivation path, e.g. "44'/XX'/XX'/0/<index>".
 * @property {string} publicKey - the hexadecimal encoded public key.
 */
interface IHardwareWallet {
  accountIndex: number;
  coinType: number;
  index: number;
  publicKey: string;
}

export default IHardwareWallet;
