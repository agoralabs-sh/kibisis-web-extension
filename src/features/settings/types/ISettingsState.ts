// Types
import { ISettings } from '../../../types';

/**
 * @property {boolean} fetching - true if the settings are being fetched.
 * @property {boolean} saving - true if the settings are being saved.
 */
interface ISettingsState extends ISettings {
  fetching: boolean;
  saving: boolean;
}

export default ISettingsState;
