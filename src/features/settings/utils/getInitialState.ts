// Types
import { ISettingsState } from '../types';

export default function getInitialState(): ISettingsState {
  return {
    fetching: false,
    network: null,
    saving: false,
  };
}
