// types
import type { ISettings } from '@extension/types';

/**
 * @property {boolean} fetching - true if the settings are being fetched.
 * @property {boolean} saving - true if the settings are being saved.
 */
interface IState extends ISettings {
  fetching: boolean;
  saving: boolean;
}

export default IState;
