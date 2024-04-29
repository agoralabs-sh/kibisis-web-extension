// types
import { ISettings } from '@extension/types';
import { ISettingsState } from '../types';

/**
 * Convenience function to that filters the settings from the state.
 * @param {ISettingsState} state - the state to extract the settings.
 * @returns {ISettings} the settings from the state.
 */
export default function filterSettingsFromState({
  advanced,
  appearance,
  general,
  privacy,
  security,
}: ISettingsState): ISettings {
  return {
    advanced,
    appearance,
    general,
    privacy,
    security,
  };
}
