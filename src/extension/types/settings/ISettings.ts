// types
import type IAdvancedSettings from './IAdvancedSettings';
import type IAppearanceSettings from './IAppearanceSettings';
import type IGeneralSettings from './IGeneralSettings';
import type IPrivacySettings from './IPrivacySettings';
import type ISecuritySettings from './ISecuritySettings';

/**
 * @property {IAdvancedSettings} advanced - various advanced settings.
 * @property {IAppearanceSettings} appearance - various appearance settings.
 * @property {IGeneralSettings} general - various general settings.
 * @property {IPrivacySettings} privacy - various general settings.
 * @property {ISecuritySettings} security - various security settings.
 */
interface ISettings {
  advanced: IAdvancedSettings;
  appearance: IAppearanceSettings;
  general: IGeneralSettings;
  privacy: IPrivacySettings;
  security: ISecuritySettings;
}

export default ISettings;
