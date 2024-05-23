// types
import type { ISettings } from '@extension/types';
import type { IState } from '../types';

/**
 * Convenience function to that filters the settings from the state.
 * @param {IState} state - the state to extract the settings.
 * @returns {ISettings} the settings from the state.
 */
export default function filterSettingsFromState({
  advanced,
  appearance,
  general,
  privacy,
  security,
}: IState): ISettings {
  return {
    advanced,
    appearance,
    general,
    privacy,
    security,
  };
}
