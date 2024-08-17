// types
import type { IState } from '../types';

export default function getInitialState(): IState {
  return {
    fetching: false,
    items: [],
    saving: false,
  };
}
