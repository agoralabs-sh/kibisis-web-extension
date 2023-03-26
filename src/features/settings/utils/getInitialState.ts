// Types
import { ISettingsState } from '../types';

export default function getInitialState(): ISettingsState {
  return {
    fetching: false,
    loaded: false,
    network: null,
    saving: false,
  };
}
