// types
import type { ISettings } from '@extension/types';
import type { IState } from '../types';

/**
 * Convenience function to that maps the settings to state.
 * @param {IState} state - the state to update.
 * @param {ISettings} settings - the settings to map.
 */
export default function mapSettingsToState(
  state: IState,
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
  state.general = {
    ...state.general,
    ...settings.general,
  };
  state.privacy = {
    ...state.privacy,
    ...settings.privacy,
  };
  state.security = {
    ...state.security,
    ...settings.security,
  };
}
