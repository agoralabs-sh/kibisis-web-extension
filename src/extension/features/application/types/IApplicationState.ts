import { CreateToastFnReturn } from '@chakra-ui/react';
import { NavigateFunction } from 'react-router-dom';

// Errors
import { BaseExtensionError } from '@extension/errors';

// Types
import { ILogger } from '@common/types';

interface IApplicationState {
  error: BaseExtensionError | null;
  isInitialized: boolean | null;
  logger: ILogger;
  navigate: NavigateFunction | null;
  online: boolean;
  toast: CreateToastFnReturn | null;
}

export default IApplicationState;
