import { CreateToastFnReturn } from '@chakra-ui/react';
import { NavigateFunction } from 'react-router-dom';

// Errors
import { BaseExtensionError } from '@extension/errors';

// Types
import { ILogger } from '@common/types';
import IConfirm from './IConfirm';

interface IApplicationState {
  confirm: IConfirm | null;
  error: BaseExtensionError | null;
  logger: ILogger;
  navigate: NavigateFunction | null;
  online: boolean;
  sidebar: boolean;
  toast: CreateToastFnReturn | null;
}

export default IApplicationState;
