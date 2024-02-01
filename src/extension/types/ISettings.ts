// types
import IAdvancedSettings from './IAdvancedSettings';
import IAppearanceSettings from './IAppearanceSettings';
import IGeneralSettings from './IGeneralSettings';
import ISecuritySettings from './ISecuritySettings';

/**
 * @property {IAdvancedSettings} advanced - various advanced settings.
 * @property {IAppearanceSettings} appearance - various appearance settings.
 * @property {IGeneralSettings} general - various general settings.
 */
interface ISettings {
  advanced: IAdvancedSettings;
  appearance: IAppearanceSettings;
  general: IGeneralSettings;
  security: ISecuritySettings;
}

export default ISettings;
