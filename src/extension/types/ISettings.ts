// Types
import IAdvancedSettings from './IAdvancedSettings';
import IAppearanceSettings from './IAppearanceSettings';
import INetwork from './INetwork';

/**
 * @property {IAdvancedSettings} advanced - various advanced settings.
 * @property {IAppearanceSettings} appearance - various appearance settings.
 * @property {INetwork | null} network - the current selected network.
 */
interface ISettings {
  advanced: IAdvancedSettings;
  appearance: IAppearanceSettings;
  network: INetwork | null;
}

export default ISettings;
