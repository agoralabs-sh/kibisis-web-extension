// types
import { IState } from '../types';

export default function getInitialState(): IState {
  return {
    fetching: false,
    items: null,
    saving: false,
    updating: false,
  };
}
