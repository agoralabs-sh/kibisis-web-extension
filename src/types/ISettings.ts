// Types
import IAdvancedSettings from './IAdvancedSettings';
import INetwork from './INetwork';

/**
 * @property {IAdvancedSettings} advanced - various advanced settings.
 * @property {INetwork | null} network - the current selected network.
 */
interface ISettings {
  advanced: IAdvancedSettings;
  network: INetwork | null;
}

export default ISettings;
