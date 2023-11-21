import { CreateToastFnReturn } from '@chakra-ui/react';
import { NavigateFunction } from 'react-router-dom';

// errors
import { BaseExtensionError } from '@extension/errors';

// types
import { ILogger } from '@common/types';
import IConfirm from './IConfirm';

interface ISystemState {
  confirm: IConfirm | null;
  error: BaseExtensionError | null;
  logger: ILogger;
  navigate: NavigateFunction | null;
  online: boolean;
  sidebar: boolean;
  toast: CreateToastFnReturn | null;
}

export default ISystemState;
