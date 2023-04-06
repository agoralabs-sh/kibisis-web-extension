import { CreateToastFnReturn } from '@chakra-ui/react';
import { NavigateFunction } from 'react-router-dom';

// Errors
import { BaseExtensionError } from '../../../errors';

// Types
import { ILogger } from '../../../types';

interface IApplicationState {
  error: BaseExtensionError | null;
  logger: ILogger;
  navigate: NavigateFunction | null;
  online: boolean;
  toast: CreateToastFnReturn | null;
}

export default IApplicationState;
