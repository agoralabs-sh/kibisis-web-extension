// Types
import { ISettings } from '@extension/types';
import { ISettingsState } from '../types';

/**
 * Convenience function to that maps the settings to state.
 * @param {ISettingsState} state - the state to update.
 * @param {ISettings} settings - the settings to map.
 */
export default function mapSettingsToState(
  state: ISettingsState,
  settings: ISettings
): void {
  state.advanced = {
    ...state.advanced,
    ...settings.advanced,
  };
  state.appearance = {
    ...state.appearance,
    ...settings.appearance,
  };
  state.network = settings.network;
}
