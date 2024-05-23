// types
import type { IState } from '../types';

export default function getInitialState(): IState {
  return {
    items: [],
    showingConfetti: false,
  };
}
