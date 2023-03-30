/**
 * @property {boolean} allowBetaNet - whether to allow BetaNet networks in the network list.
 * @property {boolean} allowTestNet - whether to allow TestNet networks in the network list.
 */
interface IAdvancedSettings {
  allowBetaNet: boolean;
  allowTestNet: boolean;
}

export default IAdvancedSettings;
