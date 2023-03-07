import { CreateToastFnReturn } from '@chakra-ui/react';
import { NavigateFunction } from 'react-router-dom';

// Errors
import { BaseError } from '../../../errors';

// Types
import { ILogger } from '../../../types';

interface IApplicationState {
  error: BaseError | null;
  logger: ILogger;
  navigate: NavigateFunction | null;
  toast: CreateToastFnReturn | null;
}

export default IApplicationState;
