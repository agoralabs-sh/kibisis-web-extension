/**
 * @property {boolean} allowBetaNet - whether to allow BetaNet networks in the network list.
 * @property {boolean} allowDidTokenFormat - whether to allow the did token format in qr code sharing.
 * @property {boolean} allowTestNet - whether to allow TestNet networks in the network list.
 * @property {boolean} debugLogging - whether the extension console debug logging is enabled.
 */
interface IAdvancedSettings {
  allowBetaNet: boolean;
  allowDidTokenFormat: boolean;
  allowTestNet: boolean;
  debugLogging: boolean;
}

export default IAdvancedSettings;
