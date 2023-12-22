// types
import { IArc200AssetsState } from '../types';

export default function getInitialState(): IArc200AssetsState {
  return {
    fetching: false,
    items: null,
    saving: false,
    updating: false,
  };
}
