import { Context, createContext } from 'react';

// types
import { IMultipleTransactionsContextValue } from '../types';

const MultipleTransactionsContext: Context<IMultipleTransactionsContextValue | null> =
  createContext<IMultipleTransactionsContextValue | null>(null);

export default MultipleTransactionsContext;
